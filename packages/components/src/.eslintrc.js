/* eslint-disable */

'use strict';

const restrictedGlobals = require('eslint-restricted-globals');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    __DEV__: true,
  },
  extends: ['eslint-config-carbon/vanilla'],
  plugins: ['jsdoc'],
  rules: {
    'jsdoc/check-param-names': 2,
    'jsdoc/check-tag-names': [
      'error',
      {
        definedTags: ['jest-environment'],
      },
    ],
    'jsdoc/check-types': 2,
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
    'class-methods-use-this': 0,
    'func-names': 0,
    'max-len': [2, 130, 4],
    'no-plusplus': 0,
    'no-restricted-globals': ['error', 'isFinite'].concat(restrictedGlobals),
    'no-underscore-dangle': [
      2,
      { allowAfterThis: true, allowAfterSuper: true },
    ],
    strict: ['error', 'global'],
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        augments: 'extends',
      },
    },
  },
  overrides: [
    {
      files: ['**/*.config.js'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
      },
    },
    {
      files: ['**/__tests__/**'],
      env: {
        jest: true,
      },
      rules: {
        'no-restricted-syntax': [
          2,
          { selector: 'LabeledStatement' },
          { selector: 'WithStatement' },
        ],
      },
    },
  ],
};
