/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TokenSet, Token } from '../';

describe('TokenSet', () => {
  describe('iterator', () => {
    it('should support Symbol.iterator', () => {
      const layer01 = Token.create('layer-01');
      const layer02 = Token.create('layer-02');
      const layers = TokenSet.create({
        name: 'layers',
        tokens: [layer01, layer02],
      });

      const background = Token.create('background');
      const group = TokenSet.create({
        name: 'group',
        tokens: [background, layers],
      });

      const items = Array.from(group);
      expect(items.length).toBe(4);

      // Preorder traversal
      expect(items[0]).toEqual(background);
      expect(items[1]).toEqual(layers);
      expect(items[2]).toEqual(layer01);
      expect(items[3]).toEqual(layer02);
    });
  });

  describe('getTokenSets', () => {
    it('should return a single element array if no nested token sets exist', () => {
      const set = TokenSet.create({
        name: 'test',
        tokens: [Token.create('test')],
      });
      expect(set.getTokenSets()).toEqual([set]);
    });

    it('should return each child token set in the parent set', () => {
      const set1 = TokenSet.create({
        name: 'set-1',
        tokens: [Token.create('set-1-token')],
      });
      const set3 = TokenSet.create({
        name: 'set-3',
        tokens: [Token.create('set-3-token')],
      });
      const set2 = TokenSet.create({
        name: 'set-2',
        tokens: [Token.create('set-2-token'), set3],
      });
      const group = TokenSet.create({
        name: 'group',
        tokens: [set1, set2],
      });
      expect(group.getTokenSets()).toEqual([group, set1, set2, set3]);
    });
  });

  describe('getTokenSet', () => {
    it('should return a specific set, or null if it does not exist', () => {
      const test = TokenSet.create({
        name: 'test',
        tokens: [],
      });
      const group = TokenSet.create({
        name: 'group',
        tokens: [test],
      });

      expect(group.getTokenSet('test')).toEqual(test);
      expect(group.getTokenSet('does-not-exist')).toEqual(null);
    });
  });

  describe('hasToken', () => {
    it('should return a boolean indiciating if the token is in the set, or a child set', () => {
      const token01 = Token.create('token-01');
      const group = TokenSet.create({
        name: 'group',
        tokens: [
          token01,
          TokenSet.create({
            name: 'nested',
            tokens: [Token.create('token-02')],
          }),
        ],
      });

      // Direct tokens
      expect(group.hasToken('token-01')).toBe(true);
      expect(group.hasToken(token01)).toBe(true);

      // Nested tokens
      expect(group.hasToken('token-02')).toBe(true);

      // Non-existent tokens
      expect(group.hasToken('token-03')).toBe(false);
    });
  });
});
