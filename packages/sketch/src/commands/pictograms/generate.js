/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Document, Text, Rectangle, Group } from 'sketch/dom';
import { command } from '../command';
import { findOrCreatePage, selectPage } from '../../tools/page';

const { categories } = require('../../../generated/pictograms/metadata.json');

export function generate() {
  command('commands/pictograms/generate', () => {
    const document = Document.getSelectedDocument();
    const symbols = document.getSymbols();
    const page = selectPage(findOrCreatePage(document, 'pictograms'));
    const groups = [];
    let PAGE_X_OFFSET = 0;
    let PAGE_Y_OFFSET = 0;

    for (const category of categories) {
      const categoryText = new Text({
        text: category.name,
        style: {
          fontFamily: 'IBM Plex Sans',
          fontSize: 32,
          fontStyle: undefined,
          fontWeight: 4,
          lineHeight: 40,
        },
      });
      const group = new Group({
        name: category.name,
        frame: new Rectangle(PAGE_X_OFFSET, PAGE_Y_OFFSET),
        layers: [categoryText],
      });

      const layers = [];
      const MARGIN = 4;
      let PICTOGRAM_X_OFFSET = 0;
      let PICTOGRAM_Y_OFFSET = categoryText.frame.height + 8;
      let COLUMN_COUNT = 0;

      for (const pictogram of category.members) {
        const symbol = symbols.find(symbol => {
          const parts = symbol.name.split('/').map(string => string.trim());
          const [_type, _category, name] = parts;
          return name === pictogram;
        });

        if (!symbol) {
          throw new Error(`Unable to find symbol for pictogram ${pictogram}!`);
        }

        const instance = symbol.createNewInstance();
        instance.frame.offset(PICTOGRAM_X_OFFSET, PICTOGRAM_Y_OFFSET);

        layers.push(instance);
        PICTOGRAM_X_OFFSET = PICTOGRAM_X_OFFSET + 48 + MARGIN;
        COLUMN_COUNT = COLUMN_COUNT + 1;

        // 8 column layout
        if (COLUMN_COUNT > 7) {
          PICTOGRAM_X_OFFSET = 0;
          COLUMN_COUNT = 0;
          PICTOGRAM_Y_OFFSET = PICTOGRAM_Y_OFFSET + 48 + MARGIN;
        }
      }

      group.layers.push(...layers);
      group.adjustToFit();
      PAGE_Y_OFFSET = PAGE_Y_OFFSET + group.frame.height;

      groups.push(group);
    }

    page.layers.push(...groups);
  });
}
