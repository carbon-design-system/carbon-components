/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * A Token is the simplest unit in our theme. It can have a name, properties
 * that it applies to like border or background, along with a state if the
 * token should only be used for specific states like hover or focus.
 */
export class Token {
  static create(token) {
    if (typeof token === 'string') {
      return new Token(token);
    }

    return new Token(token.name, token.properties, token.state);
  }

  constructor(name, properties, state) {
    this.kind = 'Token';
    this.name = name;

    if (properties) {
      this.properties = properties;
    }

    if (state) {
      this.state = state;
    }
  }
}
