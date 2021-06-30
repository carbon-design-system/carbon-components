/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const supported = [
  {
    packageName: 'react',
    // the range we would like to migrate *from*
    from: '>=16',
    // the version we would like to migrate *to*
    to: '18.0.0',

    async migrate(workspace) {
      console.log(
        'migrate the react package in the %s workspace',
        workspace.name
      );
    },
  },
  {
    packageName: 'react-dom',
    // the range we would like to migrate *from*
    from: '>=16',
    // the version we would like to migrate *to*
    to: '18.0.0',

    async migrate(workspace) {
      console.log(
        'migrate the react-dom package in the %s workspace',
        workspace.name
      );
    },
  },
];

module.exports = supported;
