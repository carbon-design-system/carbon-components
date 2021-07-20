/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

'use strict';

require('core-js/features/array/flat-map');

const { reporter } = require('@carbon/cli-reporter');
const { generate } = require('@carbon/scss-generator');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { formatTokenName, themes, tokens } = require('../lib');
const buildTokensFile = require('./builders/tokens');
const buildThemesFile = require('./builders/themes');
const buildCompatThemesFile = require('./builders/compat/themes');
const buildCompatTokensFile = require('./builders/compat/tokens');
const buildModulesThemesFile = require('./builders/modules-themes');
const buildModulesTokensFile = require('./builders/modules-tokens');
const buildMixinsFile = require('./builders/mixins');

const defaultTheme = 'white';
const defaultThemeMapName = 'carbon--theme';

async function build() {
  reporter.info('Building scss files for themes...');

  const METADATA_FILE = path.resolve(__dirname, '../metadata.yml');
  const metadata = transformMetadata(
    yaml.safeLoad(fs.readFileSync(METADATA_FILE, 'utf8'))
  );

  const SCSS_DIR = path.resolve(__dirname, '../scss/generated');
  const files = [
    {
      filepath: path.join(SCSS_DIR, '_tokens.scss'),
      builder() {
        return buildTokensFile(tokens, metadata, themes[defaultTheme]);
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_themes.scss'),
      builder() {
        return buildThemesFile(
          themes,
          tokens,
          defaultTheme,
          defaultThemeMapName
        );
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_mixins.scss'),
      builder() {
        return buildMixinsFile(
          themes,
          tokens,
          defaultTheme,
          defaultThemeMapName
        );
      },
    },
    {
      filepath: path.resolve(
        SCSS_DIR,
        '..',
        'compat',
        'generated',
        '_themes.scss'
      ),
      builder() {
        return buildCompatThemesFile();
      },
    },
    {
      filepath: path.resolve(
        SCSS_DIR,
        '..',
        'compat',
        'generated',
        '_tokens.scss'
      ),
      builder() {
        return buildCompatTokensFile();
      },
    },
    {
      filepath: path.resolve(
        SCSS_DIR,
        '..',
        'modules',
        'generated',
        '_themes.scss'
      ),
      builder() {
        return buildModulesThemesFile(
          themes,
          tokens,
          defaultTheme,
          defaultThemeMapName
        );
      },
    },
    {
      filepath: path.resolve(
        SCSS_DIR,
        '..',
        'modules',
        'generated',
        '_tokens.scss'
      ),
      builder() {
        return buildModulesTokensFile(tokens);
      },
    },
  ];

  for (const { filepath, builder } of files) {
    await fs.ensureFile(filepath);

    const { code } = generate(builder());
    await fs.writeFile(filepath, code);
  }

  reporter.success('Done! 🎉');
}

/**
 * Transform token names to formats expected by Sassdoc for descriptions and
 * aliases
 * @param {object} metadata - token metadata
 * @returns {object} token metadata
 */
function transformMetadata(metadata) {
  const namesRegEx = new RegExp(
    metadata.tokens.map((token) => token.name).join('|'),
    'g'
  );

  const replaceMap = {};
  metadata.tokens.map((token) => {
    replaceMap[token.name] = formatTokenName(token.name);
  });

  metadata.tokens.forEach((token, i) => {
    // interactive01 to `$interactive-01`
    if (token.role) {
      token.role.forEach((role, j) => {
        metadata.tokens[i].role[j] = role.replace(namesRegEx, (match) => {
          return '`$' + replaceMap[match] + '`';
        });
      });
    }

    // brand01 to brand-01
    if (token.alias) {
      token.alias = formatTokenName(token.alias);
    }
  });

  return metadata;
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
