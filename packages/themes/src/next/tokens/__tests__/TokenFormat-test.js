/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TokenFormat } from '../';

describe('TokenFormat', () => {
  it('should return the given name if no formatting is required', () => {
    expect(TokenFormat.convert({ name: 'token-name' })).toBe('token-name');
  });

  describe('formats.js', () => {
    test.each([
      ['token-name', 'tokenName'],
      ['test-ui', 'testUI'],
      ['token-01', 'token01'],
    ])('%s should be formatted to %s', (input, formatted) => {
      expect(
        TokenFormat.convert({
          name: input,
          format: TokenFormat.formats.js,
        })
      ).toBe(formatted);
    });
  });
});
