/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { types: t } = require('@carbon/scss-generator');
const { TokenFormat } = require('../../../src/next');
const { tokens } = require('../../../src');
const { FILE_BANNER } = require('../shared');
const { shouldIncludeToken } = require('./shared');

function buildCompatFile() {
  const variables = tokens.colors
    .filter(shouldIncludeToken)
    .flatMap((token) => {
      const id = TokenFormat.convert({
        name: token,
        format: TokenFormat.formats.scss,
      });

      return [
        t.Newline(),
        t.Comment(`/ CSS Custom Property for the ${id} token`),
        t.Assignment({
          id: t.Identifier(id),
          init: t.SassFunctionCall({
            id: t.Identifier('_get'),
            params: [t.SassString(id)],
          }),
          default: true,
        }),
      ];
    });

  return t.StyleSheet([
    // Preamble
    FILE_BANNER,
    t.Newline(),

    // Modules
    t.SassModule('sass:map'),
    t.SassModule('../../modules/config'),
    t.SassModule('../../modules/theme'),
    t.Newline(),

    t.Comment('/ Internal helper for generating CSS Custom Properties'),
    t.SassFunction({
      id: t.Identifier('_get'),
      params: [t.Identifier('token')],
      body: t.BlockStatement([
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.SassValue('config.$use-fallback-value'),
            operator: '==',
            right: t.SassBoolean(false),
          }),
          consequent: t.BlockStatement([
            t.AtReturn(t.SassValue('var(--#{config.$prefix}-#{$token})')),
          ]),
          alternate: t.BlockStatement([
            t.AtReturn(
              t.SassValue(
                'var(--#{config.$prefix}-#{$token}, #{theme.get($token)})'
              )
            ),
          ]),
        }),
      ]),
    }),

    // Variables
    ...variables,
  ]);
}

module.exports = buildCompatFile;
