/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const { UpgradeError } = require('../error');
const { Workspace } = require('./workspace');

class Project {
  /**
   * Detects the project root directory from a given current working directory
   * @param {string} directory
   * @returns Promise<Project>
   */
  static async detect(directory) {
    const rootDirectory = getProjectRoot(directory);
    const workspace = await Workspace.load(rootDirectory);
    return Project.create(rootDirectory, workspace);
  }

  static create(directory, workspace) {
    return new Project(directory, workspace);
  }

  constructor(directory, workspace) {
    this.directory = directory;
    this.workspace = workspace;
  }

  getWorkspaces() {
    return Array.from(this.workspace.getWorkspaces());
  }
}

/**
 * Returns the root directory of a project, either as a workspace root with a
 * collection of packages or a single project with a `package.json`
 * @param {string} directory
 * @returns {string}
 */
function getProjectRoot(directory) {
  const packageJsonPaths = ancestors(directory).filter((directory) => {
    return fs.existsSync(path.join(directory, 'package.json'));
  });

  const rootDirectory =
    packageJsonPaths.length > 0
      ? packageJsonPaths[packageJsonPaths.length - 1]
      : null;

  if (!rootDirectory) {
    throw new UpgradeError(
      `Unable to find a \`package.json\` file from directory: ${directory}`
    );
  }

  return rootDirectory;
}

const { root: ROOT_DIR } = path.parse(__dirname);

/**
 * Returns an array of the the directory and its ancestors
 * @param {string} directory
 * @returns {Array<string>}
 */
function ancestors(directory) {
  const result = [directory];
  let current = directory;

  while (current !== '') {
    result.push(current);

    if (current !== ROOT_DIR) {
      current = path.dirname(current);
    } else {
      current = '';
    }
  }

  return result;
}

module.exports = {
  Project,
};
