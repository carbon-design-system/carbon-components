/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'node'],
  modulePathIgnorePatterns: ['/build/', '/es/', '/lib/', '/umd/', '/examples/'],
  reporters: ['default'],
  setupFiles: [require.resolve('./setup/setup.js')],
  setupFilesAfterEnv: [require.resolve('./setup/setupAfterEnv.js')],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js?(x)',
    '<rootDir>/**/*.(spec|test).js?(x)',
    '<rootDir>/**/*-(spec|test).js?(x)',
  ],
  transform: {
    '^.+\\.(js|jsx)$': require.resolve('./transform/jsTransform.js'),
    '^.+\\.css$': require.resolve('./transform/cssTransform.js'),
    '^(?!.*\\.(js|jsx|css|json)$)': require.resolve(
      './transform/fileTransform.js'
    ),
  },
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  testPathIgnorePatterns: [
    '/cjs/',
    '/dist/',
    '/es/',
    '/lib/',
    '/build/',
    'e2e',
    'examples',
    '/umd/',
  ],
  transformIgnorePatterns: [
    '/build/',
    '/es/',
    '/lib/',
    '/umd/',
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
  ],
  watchPathIgnorePatterns: [
    '/cjs/',
    '/dist/',
    '/es/',
    '/examples/',
    '/lib/',
    '/storybook/',
    '/results/',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
