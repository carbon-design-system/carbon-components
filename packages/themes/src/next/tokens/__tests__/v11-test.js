/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as v11TokenGroup from '../v11TokenGroup';

describe('v11', () => {
  test('v11 token group', () => {
    expect(
      v11TokenGroup.group.getTokens().map((token) => token.name)
    ).toMatchSnapshot();
  });

  test.each([
    'background',
    'layer',
    'field',
    'border',
    'text',
    'link',
    'icon',
    'support',
    'focus',
    'skeleton',
  ])('%s token group', (group) => {
    expect(
      v11TokenGroup[group].getTokens().map((token) => token.name)
    ).toMatchSnapshot();
  });
});
