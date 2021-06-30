/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      basePath: '/themes/examples/preview-v11',
    };
  }

  return defaultConfig;
};
