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
  testMatch: ['<rootDir>/e2e/**/*-test.js'],
  testPathIgnorePatterns: [
    'examples',
    '/packages/components/',
    '/packages/react/',
  ],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  reporters: ['default', 'jest-junit'],
};
