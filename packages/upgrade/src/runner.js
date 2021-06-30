/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');
const clone = require('lodash.cloneDeep');
const { diff } = require('jest-diff');

const logger = {
  info(message) {
    console.log(`${chalk.yellow.inverse(' INFO ')} ${message}`);
  },
};

const Runner = {
  /**
   * Run the given migrations for each workspace
   * @param {Array<WorkspaceMigration} migrationsByWorkspace
   * @returns void
   */
  async run(migrationsByWorkspace, options) {
    for (const { workspace, migrationOptions } of migrationsByWorkspace) {
      logger.info(
        `Running migrations for ${workspace.name} in ${workspace.directory}`
      );

      const updated = [];
      for (const { dependency, migration } of migrationOptions) {
        logger.info(
          `Running migration for ${migration.packageName} from ${dependency.version} to ${migration.to}`
        );

        updated.push({
          ...dependency,
          version: migration.to,
        });
      }

      // Update package.json
      const originalPackageJson = await workspace.getPackageJson();
      const updatedPackageJson = updatePackageJson(
        originalPackageJson,
        updated
      );

      if (!options.write) {
        console.log(
          diff(originalPackageJson, updatedPackageJson, {
            aAnnotation: 'Original',
            bAnnotation: 'Modified',
            contextLines: 3,
          })
        );
      }
    }
  },
};

function updatePackageJson(packageJson, dependencies) {
  const result = clone(packageJson);

  for (const { name, version, type } of dependencies) {
    result[type][name] = version;
  }

  return result;
}

module.exports = {
  Runner,
};
