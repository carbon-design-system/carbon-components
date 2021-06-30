/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * A token set is a collection of tokens which should be along with each other.
 * For example, we have tokens that correspond to a layer level in a UI. A
 * token set allows us to group these tokens together in a way that's different
 * than their token group.
 */
export class TokenSet {
  static create({ name, tokens }) {
    return new TokenSet(name, tokens);
  }

  constructor(name, tokens = []) {
    this.kind = 'TokenSet';
    this.name = name;
    this.children = tokens;
  }

  *[Symbol.iterator]() {
    for (const child of this.children) {
      yield child;

      if (child.kind === 'TokenSet') {
        yield* child;
      }
    }
  }

  getTokenSets() {
    const children = this.children
      .filter((child) => {
        return child.kind === 'TokenSet';
      })
      .flatMap((child) => {
        return child.getTokenSets();
      });

    return [this, ...children];
  }

  getTokenSet(name) {
    for (const child of this) {
      if (!child.kind === 'TokenSet') {
        continue;
      }

      if (child.name === name) {
        return child;
      }
    }

    return null;
  }

  hasToken(tokenOrName) {
    const name =
      typeof tokenOrName === 'string' ? tokenOrName : tokenOrName.name;

    for (const child of this) {
      if (child.kind === 'TokenSet') {
        continue;
      }

      if (child.name === name) {
        return true;
      }
    }

    return false;
  }
}
