/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Document } from 'sketch/dom';
import { command } from '../command';
import { syncIconSymbols } from './shared';
import { findOrCreateSymbolPage } from '../../tools/page';

const IDL_SKETCH_LIBRARY_METADATA = {
  id: '9E0A7EC6-C3F3-4DE6-BA36-3F90C4853BA5',
  name: 'IBM Design Language v2',
};

export function syncSmallIcons() {
  command('commands/icons/syncSmallIcons', () => {
    const document = Document.getSelectedDocument();
    const symbolsPage = findOrCreateSymbolPage(document);
    const symbols = document.getSymbols();
    syncIconSymbols({
      document,
      IDL_SKETCH_LIBRARY_METADATA,
      symbols: Array.from(symbols),
      symbolsPage,
      sizes: [16, 20],
    });
  });
}

export function syncLargeIcons() {
  command('commands/icons/syncLargeIcons', () => {
    const document = Document.getSelectedDocument();
    const symbolsPage = findOrCreateSymbolPage(document);
    const symbols = document.getSymbols();
    syncIconSymbols({
      document,
      IDL_SKETCH_LIBRARY_METADATA,
      symbols: Array.from(symbols),
      symbolsPage,
      sizes: [24, 32],
    });
  });
}
