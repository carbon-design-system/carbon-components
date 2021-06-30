/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const cli = require('yargs');
const packageJson = require('../package.json');
const { UpgradeError } = require('./error');
const { Migration } = require('./migration');
const { Planner } = require('./planner');
const { Project } = require('./project');
const { Runner } = require('./runner');

async function main({ argv, cwd }) {
  cli.scriptName(packageJson.name).version(packageJson.version);

  cli
    .option('verbose', {
      default: false,
      describe: 'display the full output while running a command',
    })
    .option('write', {
      alias: 'w',
      describe: 'update the files with changes found by running the migration',
      default: false,
    })
    .option('ignore', {
      alias: 'i',
      describe:
        'provide a list of glob pattern for directories you would like ignored',
      default: [],
      array: true,
    });

  cli.usage('Usage: $0 [options]').command(
    '$0',
    'run to upgrade your project',
    {},
    run(async (args) => {
      const { ignore, verbose, write } = args;
      const options = {
        cwd: cwd(),
        ignore,
        verbose,
        write,
      };

      const project = await Project.detect(options.cwd);
      const migrationsByWorkspace = await Migration.getMigrationsByWorkspace(
        Array.from(project.getWorkspaces()),
        Migration.getMigrations()
      );
      const migrationsToRun = await Planner.getSelectedMigrations(
        migrationsByWorkspace
      );

      await Runner.run(migrationsToRun, options);
    })
  );

  cli.strict().parse(argv.slice(2)).argv;
}

function run(command) {
  return async (...args) => {
    console.log('Thanks for trying out @carbon/upgrade! 🙏');

    try {
      await command(...args);
      console.log('Done! ✨');
    } catch (error) {
      if (error instanceof UpgradeError) {
        console.error(error.message);
        process.exit(1);
      }
      console.error('Yikes, looks like something really went wrong.');
      console.error('Please make an issue with the following info:');
      console.log(error);
      process.exit(1);
    }
  };
}

module.exports = main;
