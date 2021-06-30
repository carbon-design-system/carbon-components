/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { prompt } = require('inquirer');

const Planner = {
  /**
   * Prompt the user to see which migrations they would like to apply for each
   * workspace
   * @param {Array<WorkspaceMigration>} migrationsByWorkspace
   * @returns {Array<WorkspaceMigration>}
   */
  async getSelectedMigrations(migrationsByWorkspace) {
    const answers = [];

    for (const { workspace, migrationOptions } of migrationsByWorkspace) {
      const answer = await prompt({
        type: 'checkbox',
        message: `Migrations available for ${workspace.name}`,
        name: 'selected',
        choices: migrationOptions
          .filter((migrationOption) => {
            return migrationOption.available === true;
          })
          .map((migrationOption) => {
            const { dependency, migration } = migrationOption;
            return {
              name: `Migrate ${dependency.name} from: ${dependency.version} to: ${migration.to}`,
              value: migration,
              checked: true,
            };
          }),
      });

      answers.push(answer);
    }

    return migrationsByWorkspace.map(({ workspace, migrationOptions }, i) => {
      const answer = answers[i];
      return {
        workspace,
        migrationOptions: migrationOptions.filter((migrationOption) => {
          return answer.selected.includes(migrationOption.migration);
        }),
      };
    });
  },
};

module.exports = {
  Planner,
};
