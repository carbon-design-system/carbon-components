/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Document } from 'sketch/dom';
import { command } from '../command';
import { syncColorStyles, syncColorVariables } from '../../sharedStyles/colors';

export function sync() {
  command('commands/colors/sync', () => {
    syncColorStyles({ document: Document.getSelectedDocument() });
  });
}

export function syncColorVars() {
  command('commands/colors/syncvars', () => {
    syncColorVariables({ document: Document.getSelectedDocument() });
  });
}
