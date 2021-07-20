/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

'use strict';

const { SassRenderer } = require('@carbon/test-utils/scss');

const { render } = SassRenderer.create(__dirname);

describe('@carbon/styles/scss/theme', () => {
  test('Public API', async () => {
    const { get } = await render(`
      @use 'sass:map';
      @use 'sass:meta';
      @use '../theme';

      $_: get('api', (
        variables: map.keys(meta.module-variables('theme')),
        mixins: (
          theme: meta.mixin-exists('theme', 'theme'),
        ),
      ));
    `);

    const { value: api } = get('api');
    expect(api.mixins).toEqual({
      theme: true,
    });
    expect(api.variables).toMatchInlineSnapshot(`
Array [
  "fallback",
  "theme",
  "background",
  "background-active",
  "background-selected",
  "background-selected-hover",
  "background-hover",
  "background-brand",
  "background-inverse",
  "background-inverse-hover",
  "layer-01",
  "layer-active-01",
  "layer-hover-01",
  "layer-selected-01",
  "layer-selected-hover-01",
  "layer-02",
  "layer-active-02",
  "layer-hover-02",
  "layer-selected-02",
  "layer-selected-hover-02",
  "layer-03",
  "layer-active-03",
  "layer-hover-03",
  "layer-selected-03",
  "layer-selected-hover-03",
  "layer-disabled",
  "layer-selected-inverse",
  "layer-selected-disabled",
  "layer-accent-01",
  "layer-accent-active-01",
  "layer-accent-hover-01",
  "layer-accent-02",
  "layer-accent-active-02",
  "layer-accent-hover-02",
  "layer-accent-03",
  "layer-accent-active-03",
  "layer-accent-hover-03",
  "field-01",
  "field-hover-01",
  "field-02",
  "field-hover-02",
  "field-03",
  "field-hover-03",
  "field-disabled",
  "interactive",
  "border-subtle-00",
  "border-subtle-01",
  "border-subtle-selected-01",
  "border-subtle-02",
  "border-subtle-selected-02",
  "border-subtle-03",
  "border-subtle-selected-03",
  "border-strong-01",
  "border-strong-02",
  "border-strong-03",
  "border-inverse",
  "border-interactive",
  "border-disabled",
  "text-primary",
  "text-secondary",
  "text-placeholder",
  "text-helper",
  "text-error",
  "text-inverse",
  "text-on-color",
  "text-on-color-disabled",
  "text-disabled",
  "link-primary",
  "link-primary-hover",
  "link-secondary",
  "link-inverse",
  "link-visited",
  "icon-primary",
  "icon-secondary",
  "icon-inverse",
  "icon-on-color",
  "icon-on-color-disabled",
  "icon-disabled",
  "support-error",
  "support-success",
  "support-warning",
  "support-info",
  "support-error-inverse",
  "support-success-inverse",
  "support-warning-inverse",
  "support-info-inverse",
  "support-caution-major",
  "support-caution-minor",
  "support-caution-undefined",
  "highlight",
  "overlay",
  "toggle-off",
  "focus",
  "focus-inset",
  "focus-inverse",
  "skeleton-background",
  "skeleton-element",
  "border-subtle",
  "border-strong",
  "layer",
  "layer-active",
  "layer-hover",
  "layer-accent",
  "layer-selected",
  "layer-selected-hover",
  "field",
  "field-hover",
]
`);
  });
});
