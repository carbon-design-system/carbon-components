/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { types: t } = require('@carbon/scss-generator');
const { TokenFormat, themes, group } = require('../../src/next');
const { FILE_BANNER, primitive } = require('./shared');

function buildThemesFile() {
  const imports = [
    t.SassModule('sass:map'),
    t.SassModule('@carbon/layout'),
    t.SassModule('@carbon/type'),
    t.SassModule('../utilities'),
  ];
  const variables = Object.entries(themes).flatMap(([key, theme]) => {
    return [
      t.Newline(),
      t.Assignment({
        id: t.Identifier(key),
        init: t.SassMap({
          properties: Object.entries(theme)
            .filter(([token]) => {
              return group.getToken(
                TokenFormat.convert({
                  name: token,
                  format: TokenFormat.formats.scss,
                })
              );
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
      t.Assignment({
        id: t.Identifier(key),
        init: t.SassFunctionCall({
          id: t.Identifier('utilities.merge'),
          params: [
            t.Identifier(key),
            t.SassValue('layout.$spacing'),
            t.SassValue('layout.$fluid-spacing'),
            t.SassValue('type.$tokens'),
          ],
        }),
      }),
    ];
  });

  const mappings = new Map();
  for (const [key, value] of Object.entries(tokenMappings)) {
    if (!mappings.has(value)) {
      mappings.set(value, []);
    }

    mappings.set(value, [...mappings.get(value), key]);
  }

  return t.StyleSheet([FILE_BANNER, t.Newline(), ...imports, ...variables]);
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

module.exports = buildThemesFile;
