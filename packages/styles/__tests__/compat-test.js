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

describe('@carbon/styles/scss/compat', () => {
  it('should export white, g10, g90, and g100 themes', async () => {
    const { unwrap } = await render(`
      @use 'sass:map';
      @use 'sass:meta';
      @use '../scss/compat/themes';

      $_: get('variables', map.keys(meta.module-variables('themes')));
    `);
    const themes = unwrap('variables').sort();
    expect(themes).toEqual(['white', 'g10', 'g90', 'g100'].sort());
  });

  it('should export v10 tokens as Sass Variables', async () => {
    const { unwrap } = await render(`
      @use '../scss/config' with ( $prefix: 'cds' );
      @use '../scss/compat/themes';
      @use '../scss/compat/theme' with (
        $theme: themes.$white,
      );

      $_: get('theme', themes.$white);
      $_: get('variable', theme.$interactive-01);
    `);
    const theme = unwrap('theme');
    const variable = unwrap('variable');

    expect(variable).toEqual(
      `var(--cds-interactive-01, ${theme['interactive-01']})`
    );
  });

  it('should export v11 tokens that match the fallback theme', async () => {
    const { unwrap } = await render(`
      @use '../scss/config' with ( $prefix: 'cds' );
      @use '../scss/themes';
      @use '../scss/compat/themes' as compat;
      @use '../scss/compat/theme' with (
        $fallback: themes.$g100,
        $theme: compat.$g100,
      );

      $_: get('theme', themes.$g100);
      $_: get('variable', theme.$background);
    `);

    const theme = unwrap('theme');
    const variable = unwrap('variable');

    expect(variable).toEqual(`var(--cds-background, ${theme['background']})`);
  });
});
