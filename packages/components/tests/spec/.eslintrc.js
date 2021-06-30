/* eslint-disable */

'use strict';

const restrictedGlobals = require('eslint-restricted-globals');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint-config-carbon/vanilla'],
  globals: {
    jasmine: true,
    describe: true,
    beforeAll: true,
    beforeEach: true,
    afterAll: true,
    afterEach: true,
    it: true,
    expect: true,
    spyOn: true,
  },
  rules: {
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'max-len': [2, 130, 4],
    'func-names': 0,
    'no-new': 0,
    'no-restricted-globals': ['error', 'isFinite'].concat(restrictedGlobals),
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'prefer-arrow-callback': 0,
  },
  overrides: [
    {
      files: ['*_spec.js'],
      rules: {
        'import/no-unresolved': 0,
      },
    },
  ],
};
