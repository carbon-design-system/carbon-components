/**
 * Copyright IBM Corp. 2015, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import stripBanner from 'rollup-plugin-strip-banner';

const BANNER = `/**
 * Copyright IBM Corp. 2015, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;

const baseConfig = {
  external: [],
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    stripBanner(),
    {
      renderChunk(code) {
        return `${BANNER}\n${code}`;
      },
    },
  ],
};

export default [
  {
    ...baseConfig,
    input: path.join(__dirname, './src/index.js'),
    output: {
      file: 'es/index.js',
      format: 'esm',
    },
  },
  {
    ...baseConfig,
    input: path.join(__dirname, './src/index.js'),
    output: {
      file: 'lib/index.js',
      format: 'commonjs',
    },
  },
];
