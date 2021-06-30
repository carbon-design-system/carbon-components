/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const semver = require('semver');
const migrations = require('./migrations');

const codes = {
  // The migration is supported for the current workspace for the matching
  // dependency
  SUPPORTED: 'supported',
  // The migration is supported for the current dependency in the workspace but
  // the version range does not intersect
  RANGE_MISMATCH: 'range_mismatch',
};

/**
 * Get the currently supported migrations
 * @returns {Array<Migration>}
 */
function getMigrations() {
  return migrations;
}

function getMigrationsByWorkspace(workspaces, migrations) {
  return workspaces
    .map((workspace) => {
      const { dependencies } = workspace;

      return {
        workspace,
        migrationOptions: migrations
          .filter((migration) => {
            return dependencies.find((dependency) => {
              return dependency.name === migration.packageName;
            });
          })
          .map((migration) => {
            const dependency = dependencies.find((dependency) => {
              return dependency.name === migration.packageName;
            });

            if (semver.intersects(migration.from, dependency.version)) {
              return {
                dependency,
                migration,
                available: true,
                code: codes.SUPPORTED,
              };
            }

            return {
              dependency,
              migration,
              available: false,
              code: codes.RANGE_MISMATCH,
            };
          }),
      };
    })
    .filter((workspace) => {
      return workspace.migrationOptions.length > 0;
    });
}

function applyMigrations() {}

/**
 * A module for finding and running migrations
 */
const Migration = {
  codes,
  getMigrations,
  getMigrationsByWorkspace,
  applyMigrations,
};

module.exports = {
  Migration,
};
