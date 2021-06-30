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

describe('scss/components/form', () => {
  test('Public API', async () => {
    const { unwrap } = await render(`
      @use 'sass:map';
      @use 'sass:meta';
      @use '../form';

      $_: get('mixin', meta.mixin-exists('form', 'form'));
      $_: get('variables', map.keys(meta.module-variables('form')));
    `);
    expect(unwrap('mixin')).toBe(true);
    expect(unwrap('variables')).toMatchInlineSnapshot(`
      Array [
        "input-label-weight",
      ]
    `);
  });

  test('configuration', async () => {
    const { unwrap } = await render(`
      @use '../form' with (
        $input-label-weight: 600,
      );
      $_: get('font-weight', form.$input-label-weight);
    `);
    expect(unwrap('font-weight')).toBe(600);
  });
});
