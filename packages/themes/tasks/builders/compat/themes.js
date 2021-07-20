/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { types: t } = require('@carbon/scss-generator');
const { TokenFormat } = require('../../../src/next');
const { white, g10, g90, g100, tokens } = require('../../../src');
const { FILE_BANNER, primitive } = require('../shared');
const { shouldIncludeToken } = require('./shared');

function buildCompatFile() {
  const themes = {
    white,
    g10,
    g90,
    g100,
  };
  const variables = Object.entries(themes).flatMap(([key, theme]) => {
    return [
      t.Newline(),
      t.Comment(`/ Token values for the ${key} theme`),
      t.Assignment({
        id: t.Identifier(key),
        init: t.SassMap({
          properties: Object.entries(theme)
            .filter(([token]) => {
              return tokens.colors.includes(token) && shouldIncludeToken(token);
            })
            .map(([token, value]) => {
              const id = TokenFormat.convert({
                name: token,
                format: TokenFormat.formats.scss,
              });
              return t.SassMapProperty(t.Identifier(id), primitive(value));
            }),
        }),
        default: true,
      }),
    ];
  });

  return t.StyleSheet([
    // Preamble
    FILE_BANNER,
    ...variables,
  ]);
}

module.exports = buildCompatFile;
