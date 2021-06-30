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

function setupWorkspace(mockVol) {
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
  return require('../workspace').Workspace;
}

describe('Workspace', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should load a single directory with a `package.json`', async () => {
    const directory = '/test';
    const Workspace = setupWorkspace(
      Volume.fromJSON(
        {
          './package.json': JSON.stringify({}),
        },
        directory
      )
    );
    const workspace = await Workspace.load(directory);

    expect(
      Array.from(workspace.getWorkspaces()).map((w) => w.directory)
    ).toEqual(['/test']);

    await expect(Workspace.load(directory)).resolves.toBeInstanceOf(Workspace);
  });

  it('should load a workspace', async () => {
    const directory = '/test';
    const Workspace = setupWorkspace(
      Volume.fromJSON(
        {
          './package.json': JSON.stringify({
            workspaces: ['packages/*'],
          }),
          'packages/a/package.json': JSON.stringify({
            version: '0.1.0',
          }),
          'packages/b/package.json': JSON.stringify({
            dependencies: {
              a: '^0.1.0',
            },
          }),
          'packages/c/package.json': JSON.stringify({
            workspaces: ['examples/*'],
          }),
          'packages/c/examples/d/package.json': JSON.stringify({}),
        },
        directory
      )
    );

    const workspace = await Workspace.load(directory);
    expect(
      Array.from(workspace.getWorkspaces()).map((w) => w.directory)
    ).toEqual([
      '/test',
      '/test/packages/a',
      '/test/packages/b',
      '/test/packages/c',
      '/test/packages/c/examples/d',
    ]);
  });
});
