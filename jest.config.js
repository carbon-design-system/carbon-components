/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

module.exports = {
  preset: 'jest-config-carbon',
  collectCoverageFrom: [
    'packages/**/src/**/*.js',
    '!packages/{cli,components,sketch}/**',
    '!packages/**/{examples,stories}/**',
    '!**/*-story.js',
  ],
  reporters: ['default', 'jest-junit'],
};
