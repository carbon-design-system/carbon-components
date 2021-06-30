/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */

'use strict';

const { Volume } = require('memfs');

function setupProject(mockVol) {
  jest.mock('fs', () => {
    const { createFsFromVolume } = require('memfs');
    const fs = createFsFromVolume(mockVol);

    // Our usage of `fs-extra` requires a fs.realpath.native value that memfs
    // does not seem to provide.
    Object.defineProperty(fs.realpath, 'native', {
      value: jest.fn(),
      enumerable: true,
      writable: false,
    });

    return fs;
  });
  return require('../project').Project;
}

describe('Project', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should detect a project from the current working directory', async () => {
    const directory = '/test';
    const Project = setupProject(
      Volume.fromJSON(
        {
          './package.json': JSON.stringify({}),
          './src/test.js': '',
        },
        directory
      )
    );

    const project = await Project.detect('/test/src');
    expect(project.directory).toEqual('/test');
  });
});
