/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TokenGroup, Token } from '../';

describe('TokenGroup', () => {
  describe('getToken', () => {
    it('should return a token if it exists, otherwise return null', () => {
      const token01 = Token.create('token-01');
      const token02 = Token.create('token-02');
      const nested = TokenGroup.create({
        name: 'nested',
        tokens: [token02],
      });
      const group = TokenGroup.create({
        name: 'group',
        tokens: [token01, nested],
      });

      // Direct descendant
      expect(group.getToken(token01)).toEqual(token01);
      expect(group.getToken('token-01')).toEqual(token01);

      // Nested
      expect(group.getToken('token-02')).toEqual(token02);

      // Non-existent
      expect(group.getToken('token-03')).toEqual(null);
    });
  });

  describe('getTokens', () => {
    it('should return a flat list of tokens with context', () => {
      const nested = TokenGroup.create({
        name: 'nested',
        properties: ['border'],
        tokens: ['token-04'],
      });
      const group = TokenGroup.create({
        name: 'group',
        properties: ['background'],
        tokens: [
          'token-01',
          {
            state: 'hover',
            name: 'token-02',
          },
          {
            name: 'token-03',
            properties: ['background', 'fill'],
          },
          nested,
        ],
      });

      expect(group.getTokens()).toEqual([
        {
          groups: [group],
          name: 'token-01',
          properties: ['background'],
        },
        {
          groups: [group],
          name: 'token-02',
          properties: ['background'],
          state: 'hover',
        },
        {
          groups: [group],
          name: 'token-03',
          properties: ['background', 'fill'],
        },
        {
          groups: [group, nested],
          name: 'token-04',
          properties: ['border'],
        },
      ]);
    });
  });

  describe('getTokenGroups', () => {
    it('should return an array of all token groups', () => {
      const nested = TokenGroup.create({
        name: 'nested',
        tokens: ['token-02'],
      });
      const group = TokenGroup.create({
        name: 'group',
        tokens: ['token-01', nested],
      });
      const groups = group.getTokenGroups();

      expect(groups.includes(group)).toBe(true);
      expect(groups.includes(nested)).toBe(true);
    });
  });

  describe('getTokenProperties', () => {
    it('should return an array of all properties in the groups or tokens', () => {
      const group = TokenGroup.create({
        name: 'group',
        properties: ['background'],
        tokens: [
          'token-01',
          {
            name: 'token-02',
            properties: ['fill'],
          },
          TokenGroup.create({
            name: 'nested',
            properties: ['border'],
            tokens: [
              'token-03',
              {
                name: 'token-04',
                properties: ['stroke'],
              },
            ],
          }),
        ],
      });
      const properties = group.getTokenProperties();

      expect(properties.includes('background')).toBe(true);
      expect(properties.includes('border')).toBe(true);
      expect(properties.includes('fill')).toBe(true);
      expect(properties.includes('stroke')).toBe(true);
    });
  });

  describe('getTokenStates', () => {
    it('should return an array of states in the tokens of the group', () => {
      const group = TokenGroup.create({
        name: 'group',
        tokens: [
          'token-01',
          {
            name: 'token-02',
            state: 'hover',
          },
          TokenGroup.create({
            name: 'nested',
            tokens: [
              {
                name: 'token-03',
                state: 'focus',
              },
            ],
          }),
        ],
      });

      const states = group.getTokenStates();
      expect(states.includes('hover')).toBe(true);
      expect(states.includes('focus')).toBe(true);
    });
  });
});
