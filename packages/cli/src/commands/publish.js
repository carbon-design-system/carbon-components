/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const execa = require('execa');
const { prompt } = require('inquirer');
const semver = require('semver');
const { generate } = require('../changelog');
const { fetchLatestFromUpstream } = require('../git');
const { createLogger, displayBanner } = require('../logger');
const { getPackages } = require('../workspace');

const logger = createLogger('publish');
// Enqueue tasks to run at the end of the command where we want to "clean-up"
// the environment
const deferred = [];
function defer(thunk) {
  deferred.push(thunk);
}
async function cleanup() {
  for (let i = deferred.length - 1; i >= 0; i--) {
    const task = deferred[i];
    await task;
  }
  deferred.length = 0;
}

/**
 * Publish is the counterpart to the `release` command and is responsible for
 * taking the current state of the project and publishing it to a given package
 * registry. In addition, this command will handle local operations like
 * creating git tags, making sure npm dist-tag's for packages are correct, and
 * will generate a changelog to be used in a GitHub release.
 *
 * @param {object} tag
 * @param {string} tag.tag
 * @returns {void}
 */
async function publish({ tag, ...flags }) {
  const { gitRemote, noGitTagVersion, noPush, registry, skipReset } = flags;
  const lastTag = await getLastGitTag();
  const packages = await getPackages();

  displayBanner();

  logger.start(`Validating the tag: ${tag}`);

  if (tag[0] !== 'v') {
    throw new Error(
      `Expected tag name to match vX.Y.Z, instead received: ${tag}`
    );
  }

  if (!semver.valid(tag.slice(1))) {
    throw new Error(
      `Given tag is not a semantically valid version, received: ${tag}`
    );
  }

  logger.stop();

  logger.start('Resetting the project to a known state');

  if (!skipReset) {
    const type = semver.diff(lastTag, tag);

    if (type !== 'patch' && type !== 'prepatch') {
      logger.info('Fetching latest from upstream master');
      await fetchLatestFromUpstream();
    }

    logger.info('Cleaning any local artifacts or node_modules');
    // Make sure that our tooling is defined before running clean
    await execa('yarn', ['install', '--offline']);
    await execa('yarn', ['clean']);

    logger.info('Installing known dependencies from offline mirror');
    await execa('yarn', ['install', '--offline']);

    logger.info('Building packages from source');
    await execa('yarn', ['build']);
  }

  logger.stop();

  logger.start('Checking project for out-of-sync generated files');

  const { stdout } = await execa('git', ['status', '--porcelain']);
  if (stdout !== '') {
    throw new Error(
      'There are generated files that are out-of-sync. Please wait for ' +
        'these changes to be committed upstream or commit manually'
    );
  }

  logger.stop();

  logger.start('Publishing packages');
  logger.info('Logging into npm');

  try {
    // This command will fail if the user is unauthenticated
    await execa('npm', ['whoami', '--registry', registry]);
  } catch {
    await execa('npm', ['login'], {
      stdio: 'inherit',
    });
  }

  logger.info(`Setting the npm registry to ${registry}`);
  const { stdout: originalRegistryUrl } = await execa('npm', [
    'get',
    'registry',
  ]);
  if (originalRegistryUrl !== registry) {
    await execa('npm', ['set', 'registry', registry]);
    defer(() => execa('npm', ['set', 'registry', originalRegistryUrl]));
  }

  // Publish packages using `lerna`, we default to placing these under the
  // `next` tag instead of `latest` so that we can verify the release.
  await execa(
    'yarn',
    [
      'lerna',
      'publish',
      'from-package',
      '--dist-tag',
      'next',
      '--registry',
      registry,
    ],
    {
      stdio: 'inherit',
    }
  );

  logger.stop();

  // We specify a stopping point so that the operator can verify the packages
  // published as intended before setting the `latest` dist-tag
  const answers = await prompt([
    {
      type: 'confirm',
      name: 'tags',
      message: 'Would you like to update the package tags from next to latest?',
    },
  ]);

  if (answers.tags) {
    logger.start('Setting npm dist tags to latest');

    for (const { name, version } of packages) {
      logger.info(`Setting npm dist-tag for ${name}@${version} to latest`);
      await execa('npm', ['dist-tag', 'add', `${name}@${version}`, 'latest']);
    }

    logger.stop();
  }

  if (!noGitTagVersion) {
    logger.start(`Generating the git tag ${tag}`);
    await execa('git', ['tag', '-a', tag, '-m', tag]);
    logger.stop();
  }

  if (!noPush) {
    const { remote } = await prompt([
      {
        type: 'confirm',
        name: 'remote',
        message: `Should we push the tag ${tag} to the ${gitRemote} remote?`,
      },
    ]);

    if (remote) {
      logger.start(`Pushing the tag ${tag} to the ${gitRemote} remote`);
      await execa('git', ['push', gitRemote, tag]);
      logger.stop();
    }
  }

  logger.start('Generating the changelog');
  logger.info(`Using commits from ${lastTag}...${tag}`);

  const changelog = await generate(packages, lastTag, tag);
  logger.stop();

  const { display } = await prompt([
    {
      type: 'confirm',
      name: 'display',
      message: 'Display contents of generated changelog for release?',
    },
  ]);

  if (display) {
    // eslint-disable-next-line no-console
    console.log(changelog);
  }
}

/**
 * Gets the last known git tag from the `git tag` sub-command.
 * @returns {string}
 */
async function getLastGitTag() {
  const { stdout: tagInfo } = await execa('git', [
    'tag',
    '-l',
    '--sort=-v:refname',
  ]);
  const tags = tagInfo.split('\n');
  return tags[0];
}

module.exports = {
  command: 'publish <tag>',
  desc:
    'publish packages that have different versions from the package registry',
  builder(yargs) {
    yargs.positional('tag', {
      describe: 'the version tag associated with the release',
      type: 'string',
    });

    yargs.option('skip-reset', {
      demandOption: false,
      default: false,
      describe: 'Skip the project reset step',
      type: 'boolean',
    });

    yargs.option('registry', {
      demandOption: false,
      describe: 'Specify registry URL',
      default: 'https://registry.npmjs.org/',
      type: 'string',
    });

    yargs.option('no-git-tag-version', {
      demandOption: false,
      describe: 'Do not commit or tag version changes.',
      default: false,
      type: 'boolean',
    });

    yargs.option('git-remote', {
      demandOption: false,
      describe: 'Push git changes to the specified remote.',
      default: 'upstream',
      type: 'string',
    });

    yargs.option('no-push', {
      demandOption: false,
      describe: 'Do not push tagged commit to git remote.',
      default: false,
      type: 'boolean',
    });
  },
  async handler(...args) {
    try {
      await publish(...args);
    } finally {
      await cleanup();
    }
  },
};
