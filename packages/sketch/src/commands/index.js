/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// We export all commands through one entrypoint to prevent build errors
// triggered by having separate entrypoints. Most notably we would encounter
// parse errors because the bundlers were being generated incorrectly during
// incremental rebuilds.
export {
  sync as syncColors,
  syncColorVars,
  generate as generateColors,
} from './colors';
export { generate as generateIcons } from './icons';
export { syncSmallIcons, syncLargeIcons } from './icons';
export { sync as syncThemes, generate as generateThemes } from './themes';
export { sync as syncType, generate as generateType } from './type';

// Test commands
export { testSyncSymbolId } from './test/sync-symbol-id';
export { testSyncSharedStyles } from './test/sync-shared-styles';
