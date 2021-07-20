/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Document } from 'sketch/dom';
import { command } from '../command';
import { syncColorVariables } from '../../sharedStyles/colors';

export function syncColorVars() {
  command('commands/colors/syncColorVars', () => {
    syncColorVariables({ document: Document.getSelectedDocument() });
  });
}
