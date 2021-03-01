/**
 * Copyright IBM Corp. 2016, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

'use strict';

const CarbonPictograms = require('@carbon/pictograms');

describe('@carbon/pictograms', () => {
  it('should not update exports without a semver change', () => {
    expect(Object.keys(CarbonPictograms).sort()).toMatchSnapshot();
  });
});
