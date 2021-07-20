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

const filepaths = [
  'scss/breakpoint',
  'scss/colors',
  'scss/config',
  'scss/feature-flags',
  'scss/grid',
  'scss/motion',
  'scss/reset',
  'scss/spacing',
  'scss/theme',
  'scss/themes',
  'scss/type',
  'scss/utilities/box-shadow',
  'scss/utilities/button-reset',
  'scss/utilities/component-reset',
  'scss/utilities/component-tokens',
  'scss/utilities/convert',
  'scss/utilities/custom-property',
  'scss/utilities/focus-outline',
  'scss/utilities/high-contrast-mode',
  'scss/utilities/keyframes',
  'scss/utilities/layer-set',
  'scss/utilities/placeholder-colors',
  'scss/utilities/rotate',
  'scss/utilities/skeleton',
  'scss/utilities/text-overflow',
  'scss/utilities/tooltip',
  'scss/utilities/visually-hidden',
  'scss/utilities/z-index',
  'scss/components',
  'scss/components/accordion',
  'scss/components/breadcrumb',
  'scss/components/button',
  'scss/components/checkbox',
  'scss/components/code-snippet',
  // 'scss/components/combobox',
  'scss/components/content-switcher',
  'scss/components/copy-button',
  'scss/components/data-table',
  'scss/components/date-picker',
  // 'scss/components/dropdown',
  'scss/components/file-uploader',
  'scss/components/form',
  'scss/components/inline-loading',
  'scss/components/link',
  'scss/components/list',
  // 'scss/components/list-box',
  'scss/components/loading',
  'scss/components/menu',
  'scss/components/modal',
  // 'scss/components/multiselect',
  'scss/components/notification',
  'scss/components/number-input',
  'scss/components/overflow-menu',
  'scss/components/pagination',
  'scss/components/pagination-nav',
  'scss/components/progress-indicator',
  'scss/components/radio-button',
  'scss/components/search',
  'scss/components/select',
  'scss/components/slider',
  'scss/components/structured-list',
  'scss/components/tabs',
  // 'scss/components/tag',
  'scss/components/text-area',
  'scss/components/text-input',
  'scss/components/tile',
  'scss/components/time-picker',
  'scss/components/toggle',
  'scss/components/tooltip',
  'scss/components/treeview',
  'scss/components/ui-shell',
];
describe.each(filepaths)('%s', (filepath) => {
  it('should be importable', async () => {
    await expect(render(`@use '../${filepath}';`)).resolves.toBeDefined();
  });
});

describe('@carbon/styles/scss/config', () => {
  test('Config overrides', async () => {
    const { get } = await render(`
      @use 'sass:meta';
      @use '../scss/config' with (
        $prefix: 'custom-prefix',
      );

      $_: get('config', (
        prefix: config.$prefix,
      ));
    `);

    expect(get('config').value).toEqual({
      prefix: 'custom-prefix',
    });
  });
});
