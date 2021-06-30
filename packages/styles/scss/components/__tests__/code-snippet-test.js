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

describe('scss/components/code-snippet', () => {
  test('Public API', async () => {
    const { unwrap } = await render(`
      @use 'sass:map';
      @use 'sass:meta';
      @use '../code-snippet';

      $_: get('mixin', meta.mixin-exists('code-snippet', 'code-snippet'));
      $_: get('variables', map.keys(meta.module-variables('code-snippet')));
    `);
    expect(unwrap('mixin')).toBe(true);
    expect(unwrap('variables')).toMatchInlineSnapshot(`
      Array [
        "copy-active",
        "copy-btn-feedback",
      ]
    `);
  });

  test('configuration', async () => {
    const { unwrap } = await render(`
      @use '../code-snippet' with (
        $copy-active: #000,
      );
      $_: get('background-color', code-snippet.$copy-active);
    `);
    expect(unwrap('background-color')).toBe('#000');
  });
});
