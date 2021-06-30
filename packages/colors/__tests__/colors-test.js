/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

'use strict';

import { colors, unstable_hoverColors } from '../src';

test('colors', () => {
  expect(colors).toMatchSnapshot();
});

test('unstable_hoverColors', () => {
  expect(unstable_hoverColors).toMatchSnapshot();
});
