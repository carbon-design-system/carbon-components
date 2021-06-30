/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { types: t } = require('@carbon/scss-generator');
const { formatTokenName } = require('../../lib');
const { FILE_BANNER } = require('./shared');

function buildMixinsFile(themes, tokens, defaultTheme, defaultThemeMapName) {
  const comment = t.Comment(`/ Define theme variables from a map of tokens
/ @access public
/ @param {Map} $theme [$${defaultThemeMapName}] - Map of theme tokens
/ @param {Bool} $emit-custom-properties [false] - Output CSS Custom Properties for theme tokens
/ @content Pass in your custom declaration blocks to be used after the token maps set theming variables.
/
/ @example scss
/   // Default usage
/   @include carbon--theme();
/
/   // Alternate styling (not white theme)
/   @include carbon--theme($carbon--theme--g90) {
/     // declarations...
/   }
/
/   // Inline styling
/   @include carbon--theme($carbon--theme--g90) {
/     .my-dark-theme {
/       // declarations...
/     }
/   }
/
/ @group @carbon/themes`);

  // Create carbon--theme mixin, takes a theme as input and assigns all theme
  // variables using the `!global` flag before resetting at the end of the
  // function block
  const mixin = t.SassMixin({
    id: t.Identifier('carbon--theme'),
    params: [
      t.AssignmentPattern({
        left: t.Identifier('theme'),
        right: t.Identifier(defaultThemeMapName),
      }),
      t.AssignmentPattern({
        left: t.Identifier('emit-custom-properties'),
        right: t.SassBoolean(false),
      }),
      t.AssignmentPattern({
        left: t.Identifier('emit-difference'),
        right: t.SassBoolean(false),
      }),
    ],
    body: t.BlockStatement({
      body: [
        t.Assignment({
          id: t.Identifier('parent-carbon-theme'),
          init: t.Identifier('carbon--theme'),
        }),
        t.Assignment({
          id: t.Identifier('carbon--theme'),
          init: t.Identifier('theme'),
          global: true,
        }),
        ...Object.keys(tokens).flatMap((group) => {
          return tokens[group].flatMap((token) => {
            const name = formatTokenName(token);

            return t.Assignment({
              id: t.Identifier(name),
              init: t.CallExpression({
                callee: t.Identifier('map-get'),
                arguments: [t.Identifier('theme'), t.SassString(name)],
              }),
              global: true,
            });
          });
        }),
        t.IfStatement({
          // global-variable-exists('feature-flags') == false or
          //   global-variable-exists('feature-flags') and
          //     map-get($feature-flags, 'enable-v11-release') == true
          test: t.LogicalExpression({
            // global-variable-exists('feature-flags') == false
            left: t.LogicalExpression({
              left: t.SassFunctionCall(t.Identifier('global-variable-exists'), [
                t.SassString('feature-flags'),
              ]),
              operator: '==',
              right: t.SassBoolean(false),
            }),
            operator: 'or',
            // global-variable-exists('feature-flags') and
            //   map-get($feature-flags, 'enable-v11-release') == true
            right: t.LogicalExpression({
              left: t.SassFunctionCall(t.Identifier('global-variable-exists'), [
                t.SassString('feature-flags'),
              ]),
              operator: 'and',
              right: t.LogicalExpression({
                left: t.SassFunctionCall(t.Identifier('map-get'), [
                  t.Identifier('feature-flags'),
                  t.SassString('enable-v11-release'),
                ]),
                operator: '!=',
                right: t.SassBoolean(true),
              }),
            }),
          }),
          consequent: t.BlockStatement(
            Object.entries(tokenMappings).map(([key, value]) => {
              return t.Assignment({
                id: t.Identifier(key),
                init: t.Identifier(value),
                global: true,
              });
            })
          ),
        }),
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.SassFunctionCall(t.Identifier('global-variable-exists'), [
              t.SassString('feature-flags'),
            ]),
            operator: 'and',
            right: t.SassFunctionCall(t.Identifier('map-get'), [
              t.Identifier('feature-flags'),
              t.SassString('enable-css-custom-properties'),
            ]),
          }),
          consequent: t.BlockStatement(
            Object.keys(tokens).flatMap((group) => {
              return tokens[group]
                .filter((token) => {
                  // We don't want to inline CSS Custom Properties for tokens
                  // that are maps, we'll need to use a corresponding mixin for
                  // that token to embed CSS Custom Properties
                  return typeof themes[defaultTheme][token] !== 'object';
                })
                .flatMap((token) => {
                  const name = formatTokenName(token);
                  return t.Assignment({
                    id: t.Identifier(name),
                    init: t.CallExpression({
                      callee: t.Identifier('var'),
                      arguments: [
                        t.SassValue({
                          value: `--#{$custom-property-prefix}-${name}`,
                        }),
                        t.CallExpression({
                          callee: t.Identifier('map-get'),
                          arguments: [
                            t.Identifier('theme'),
                            t.SassString(name),
                          ],
                        }),
                      ],
                    }),
                    global: true,
                  });
                });
            })
          ),
        }),
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.Identifier('emit-custom-properties'),
            operator: '==',
            right: t.SassBoolean(true),
          }),
          consequent: t.BlockStatement(
            Object.keys(tokens).flatMap((group) => {
              return tokens[group].flatMap((token) => {
                const name = formatTokenName(token);
                return [
                  t.Newline(),
                  t.IfStatement({
                    test: t.SassFunctionCall(t.Identifier('should-emit'), [
                      t.Identifier('theme'),
                      t.Identifier('parent-carbon-theme'),
                      t.SassString(name),
                      t.Identifier('emit-difference'),
                    ]),
                    consequent: t.BlockStatement([
                      t.SassMixinCall(t.Identifier('custom-property'), [
                        t.SassString(name),
                        t.SassFunctionCall(t.Identifier('map-get'), [
                          t.Identifier('theme'),
                          t.SassString(name),
                        ]),
                      ]),
                    ]),
                  }),
                ];
              });
            })
          ),
        }),
        t.AtContent(),
        t.Newline(),
        t.Comment(' Reset to default theme after apply in content'),
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.Identifier('carbon--theme'),
            operator: '!=',
            right: t.Identifier('parent-carbon-theme'),
          }),
          consequent: t.BlockStatement([
            t.Assignment({
              id: t.Identifier('carbon--theme'),
              init: t.Identifier('parent-carbon-theme'),
              global: true,
            }),
            t.SassMixinCall(t.Identifier('carbon--theme')),
          ]),
        }),
      ],
    }),
  });

  return t.StyleSheet([
    FILE_BANNER,
    t.Newline(),
    t.SassImport('./themes'),
    t.Newline(),
    comment,
    mixin,
  ]);
}

const tokenMappings = {
  background: 'ui-background',
  layer: 'ui-01',
  'layer-accent': 'ui-03',
  field: 'field-01',
  'background-inverse': 'inverse-02',
  'background-brand': 'interactive-01',
  interactive: 'interactive-04',

  'border-subtle': 'ui-03',
  'border-strong': 'ui-04',
  'border-inverse': 'ui-05',
  'border-interactive': 'interactive-04',

  'text-primary': 'text-01',
  'text-secondary': 'text-02',
  'text-placeholder': 'text-03',
  'text-helper': 'text-05',
  'text-on-color': 'text-04',
  'text-inverse': 'inverse-01',

  'link-primary': 'link-01',
  'link-secondary': 'link-02',
  'link-visited': 'visited-link',
  'link-inverse': 'inverse-link',

  'icon-primary': 'icon-01',
  'icon-secondary': 'icon-02',
  'icon-on-color': 'icon-03',
  'icon-inverse': 'inverse-01',

  'support-error': 'support-01',
  'support-success': 'support-02',
  'support-warning': 'support-03',
  'support-info': 'support-04',
  'support-error-inverse': 'inverse-support-01',
  'support-success-inverse': 'inverse-support-02',
  'support-warning-inverse': 'inverse-support-03',
  'support-info-inverse': 'inverse-support-04',

  overlay: 'overlay-01',
  'toggle-off': 'ui-04',

  'button-primary': 'interactive-01',
  'button-secondary': 'interactive-02',
  'button-tertiary': 'interactive-03',
  'button-danger-primary': 'danger-01',
  'button-danger-secondary': 'danger-02',

  'background-active': 'active-ui',
  'layer-active': 'active-ui',

  'button-danger-active': 'active-danger',
  'button-primary-active': 'active-primary',
  'button-secondary-active': 'active-secondary',
  'button-tertiary-active': 'active-tertiary',

  'focus-inset': 'inverse-01',
  'focus-inverse': 'inverse-focus-ui',

  'background-hover': 'hover-ui',
  'layer-hover': 'hover-ui',
  'field-hover': 'hover-ui',
  'background-inverse-hover': 'inverse-hover-ui',
  'link-primary-hover': 'hover-primary-text',
  'button-danger-hover': 'hover-danger',
  'button-primary-hover': 'hover-primary',
  'button-secondary-hover': 'hover-secondary',
  'button-tertiary-hover': 'hover-tertiary',

  'background-selected': 'selected-ui',
  'background-selected-hover': 'hover-selected-ui',
  'layer-selected': 'selected-ui',
  'layer-selected-hover': 'hover-selected-ui',
  'layer-selected-inverse': 'ui-05',
  'border-subtle-selected': 'active-ui',

  'layer-disabled': 'disabled-01',
  'field-disabled': 'disabled-01',
  'border-disabled': 'disabled-01',

  'text-disabled': 'disabled-02',
  'button-disabled': 'disabled-02',
  'icon-disabled': 'disabled-02',

  'text-on-color-disabled': 'disabled-03',
  'icon-on-color-disabled': 'disabled-03',
  'layer-selected-disabled': 'disabled-03',

  'skeleton-background': 'skeleton-01',
  'skeleton-element': 'skeleton-02',
};

module.exports = buildMixinsFile;
