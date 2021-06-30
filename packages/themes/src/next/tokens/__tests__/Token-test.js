/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Token } from '../';

describe('Token', () => {
  it('should build a token with a string or object', () => {
    const test1 = Token.create('test1');
    expect(test1).toBeInstanceOf(Token);

    const test2 = Token.create({
      name: 'test2',
    });
    expect(test2).toBeInstanceOf(Token);
  });

  it('should have a name property', () => {
    const token = Token.create('test');
    expect(token.name).toBe('test');
  });

  it('should have a properties property if one is provided', () => {
    const none = Token.create('none');
    expect(none.properties).not.toBeDefined();

    const some = Token.create({
      name: 'some',
      properties: ['background'],
    });
    expect(some.properties).toBeDefined();
  });

  it('should have a state property if one is provided', () => {
    const none = Token.create('none');
    expect(none.state).not.toBeDefined();

    const some = Token.create({
      name: 'some',
      state: 'hover',
    });
    expect(some.state).toBeDefined();
  });
});
