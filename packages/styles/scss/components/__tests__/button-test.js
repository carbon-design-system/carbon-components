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

describe('scss/components/button', () => {
  test('Public API', async () => {
    const { unwrap } = await render(`
      @use 'sass:map';
      @use 'sass:meta';
      @use '../button';

      $_: get('mixin', meta.mixin-exists('button', 'button'));
      $_: get('variables', map.keys(meta.module-variables('button')));
    `);
    expect(unwrap('mixin')).toBe(true);
    expect(unwrap('variables')).toMatchInlineSnapshot(`
      Array [
        "button-font-weight",
        "button-font-size",
        "button-border-radius",
        "button-height",
        "button-padding",
        "button-padding-field",
        "button-padding-sm",
        "button-padding-lg",
        "button-padding-ghost",
        "button-padding-ghost-field",
        "button-padding-ghost-sm",
        "button-border-width",
        "button-outline-width",
      ]
    `);
  });

  test('configuration', async () => {
    const { unwrap } = await render(`
      @use '../button' with (
        $button-height: 2rem,
      );
      $_: get('height', button.$button-height);
    `);
    expect(unwrap('height')).toBe('2rem');
  });
});
