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
const { themes } = require('../src');

const { render } = SassRenderer.create(__dirname);

describe('_mixins.scss', () => {
  it('should export a carbon--theme mixin', async () => {
    const { unwrap } = await render(`
      @import '../scss/mixins';

      $_: get('mixin', mixin-exists(carbon--theme));
    `);

    expect(unwrap('mixin')).toBe(true);
  });

  it('should set token variables for the given theme', async () => {
    const themeTests = Object.keys(themes).map((key) => {
      const variable = `$carbon--theme--${key}`;
      const test = `
        @include carbon--theme(${variable}) {
          $_: get('${variable}', $interactive-01);
        }
      `;
      return [variable, themes[key].interactive01, test];
    });

    const tests = themeTests
      .map(([_variable, _expectedColor, test]) => test)
      .join('\n');
    const { unwrap } = await render(`
      @import '../scss/themes';
      ${tests}
    `);

    themeTests.forEach(([variable, expectedColor]) => {
      expect(unwrap(variable)).toBe(expectedColor);
    });
  });

  it('should set token variables for the given theme', async () => {
    const themeTests = Object.keys(themes).map((key) => {
      const variable = `$carbon--theme--${key}`;
      const test = `
        $feature-flags: (enable-css-custom-properties: true);
        @include carbon--theme(${variable}) {
          $_: get('${variable}', $field-01);
        }
      `;
      return [variable, themes[key].interactive01, test];
    });
    const tests = themeTests
      .map(([_variable, _expectedColor, test]) => test)
      .join('\n');
    const { unwrap } = await render(`
      @import '../scss/themes';
      ${tests}
    `);
    themeTests.forEach(([variable]) => {
      expect(unwrap(variable)).toBeDefined();
    });
  });

  it('should reset token variables after using the theme', async () => {
    const { unwrap } = await render(`
      @import '../scss/themes';

      $custom-theme: map-merge($carbon--theme--white, (
        interactive-01: #ffffff,
      ));

      $_: get('before', $interactive-01);

      @include carbon--theme($custom-theme) {
        $_: get('mixin', $interactive-01);
      }

      $_: get('after', $interactive-01);
    `);

    expect(unwrap('before')).toBe(unwrap('after'));
    expect(unwrap('mixin')).toBe('#ffffff');
  });

  it('should reset token variables after using the theme with css custom properties', async () => {
    const { unwrap } = await render(`
      $feature-flags: (enable-css-custom-properties: true);

      @import '../scss/themes';

      $custom-theme: map-merge($carbon--theme--white, (
        interactive-01: #ffffff,
      ));

      $_: get('before', $interactive-01);

      @include carbon--theme($custom-theme) {
        $_: get('mixin', $interactive-01);
      }

      $_: get('after', $interactive-01);
    `);

    expect(unwrap('mixin')).toBe('var(--cds-interactive-01, #ffffff)');
    expect(unwrap('after')).toBe(
      `var(--cds-interactive-01, ${unwrap('before')})`
    );
  });

  it('should set the global carbon--theme to match the given theme', async () => {
    const { unwrap } = await render(`
      @import '../scss/themes';
      $carbon--theme: ( value-01: #000000 );
      $custom-theme: ( value-01: #ffffff );

      @include carbon--theme($custom-theme) {
        $_: get('mixin', $carbon--theme);
      }

      $_: get('after', $carbon--theme);
    `);

    const mixin = unwrap('mixin');
    const after = unwrap('after');

    expect(mixin['value-01']).toBe('#ffffff');
    expect(after['value-01']).toBe('#000000');
  });

  describe('@mixin custom-property', () => {
    it('should create a custom property for a given token name and value', async () => {
      const { result } = await render(`
        @import '../scss/mixins';
        .selector {
          @include custom-property('token-01', #000000);
        }
      `);

      expect(result.css.toString()).toEqual(
        expect.stringContaining('--cds-token-01: #000000;')
      );
    });

    it('should export multiple tokens for maps', async () => {
      const { result } = await render(`
        @import '../scss/mixins';
        .selector {
          @include custom-property('token-01', (
            property-01: #000000,
            property-02: #ffffff,
          ));
        }
      `);

      const output = result.css.toString();
      expect(output).toEqual(
        expect.stringContaining('--cds-token-01-property-01: #000000')
      );
      expect(output).toEqual(
        expect.stringContaining('--cds-token-01-property-02: #ffffff')
      );
    });
  });

  describe('@function should-emit', () => {
    it('should emit a value only if they are different', async () => {
      const { unwrap } = await render(`
        @import '../scss/mixins';

        $theme-a: (
          property-01: #000000,
          property-02: #ffffff,
          property-03: (
            sub-property-01: 16px,
          ),
          property-04: (
            sub-property-01: 16px,
          ),
        );
        $theme-b: (
          property-01: #343434,
          property-02: #ffffff,
          property-03: (
            sub-property-01: 16px,
          ),
          property-04: (
            sub-property-01: 20px,
          ),
        );

        // The properties are different, so should emit
        $_: get('first', should-emit($theme-a, $theme-b, 'property-01', true));
        $_: get('second', should-emit($theme-a, $theme-b, 'property-04', true));

        // The properties are the same so should not emit
        $_: get('third', should-emit($theme-a, $theme-b, 'property-02', true));
        $_: get('fourth', should-emit($theme-a, $theme-b, 'property-03', true));
      `);

      expect(unwrap('first')).toBe(true);
      expect(unwrap('second')).toBe(true);
      expect(unwrap('third')).toBe(false);
      expect(unwrap('fourth')).toBe(false);
    });
  });

  describe('v11', () => {
    it('should use fallback values for v11 tokens', async () => {
      const { unwrap } = await render(`
        @import '../scss/mixins';
        @import '../scss/theme-maps';

        $carbon--theme: (
          ui-background: #ffffff,
        );
        @include carbon--theme();

        $_: get('token', $background);
      `);

      // `ui-background` is the fallback for `background`
      expect(unwrap('token')).toBe('#ffffff');
    });
  });
});
