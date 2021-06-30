/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as FeatureFlags from '@carbon/feature-flags';

FeatureFlags.merge({
  'enable-css-custom-properties': true,
  'enable-css-grid': true,
  'enable-v11-release': true,
});
