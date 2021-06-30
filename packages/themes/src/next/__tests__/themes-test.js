/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

import { themes, group } from '../';
import { TokenFormat } from '../tokens';

const tokens = group.getTokens().map((token) => {
  return TokenFormat.convert({
    name: token.name,
    format: TokenFormat.formats.js,
  });
});

describe('themes', () => {
  describe.each(Object.entries(themes))('%s', (_name, theme) => {
    test.each(tokens)('%s should be defined', (token) => {
      expect(theme[token]).toBeDefined();
    });
  });
});
