#!/usr/bin/env node

/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (error) => {
  console.error(error);
});

var chalk = require('chalk');

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 14) {
  console.error(
    chalk.red(
      `You are running Node ${currentNodeVersion}.\n` +
        `carbon-upgrade requires Node 14 or higher, please update your ` +
        `version of Node.`
    )
  );
  process.exit(1);
}

var main = require('../src/cli');

main(process).catch((error) => {
  console.error(error);
  process.exit(1);
});
