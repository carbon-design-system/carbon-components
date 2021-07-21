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

describe('scss/components/tag', () => {
  test('Public API', async () => {
    const { unwrap } = await render(`
      @use 'sass:meta';
      @use '../tag/tag';
      $_: get('mixin', meta.mixin-exists('tag', 'tag'));
    `);
    expect(unwrap('mixin')).toBe(true);
  });
});
