/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global MSSVGImporter, NSString, NSUTF8StringEncoding */

import { Artboard, Rectangle, Shape } from 'sketch/dom';
import { syncColorStyles } from '../../sharedStyles/colors';
import { groupByKey } from '../../tools/grouping';
import { syncSymbol } from '../../tools/symbols';

const metadata = require('../../../generated/icons/metadata.json');

/**
 * Returns the formatted icon symbol name, given an icon object and a size value
 * @param {object} params - getSymbolName parameters
 * @param {object} params.icon - an icon object from the icon metadata
 * @param {number} params.size
 * @returns {string} - formatted icon symbol name:
 * `[icon.subcategory] / [icon.subcategory] / <name> / <size>`
 */
function getSymbolName({ icon, size }) {
  const symbolName = `${icon.name} / ${size}`;
  if (icon.category && icon.subcategory) {
    return `${icon.category} / ${icon.subcategory} / ${symbolName}`;
  }

  return symbolName;
}

/**
 * Remove deprecated icon symbols from the current Sketch document
 * @param {object} params - removeDeprecatedSymbolArtboards parameters
 * @param {Array<object>} params.icons - array of all icon object metadata
 * @param {Array<number>} params.sizes - array of icon sizes
 * @param {Page} params.symbolsPage - the symbols page as identified by Sketch
 */
function removeDeprecatedSymbolArtboards({ icons, sizes, symbolsPage }) {
  const deprecatedIcons = icons.reduce((deprecatedIconsMap, currentIcon) => {
    if (currentIcon.deprecated) {
      sizes.forEach((size) => {
        const symbolName = getSymbolName({ icon: currentIcon, size });
        deprecatedIconsMap.set(symbolName, currentIcon);
      });
    }

    return deprecatedIconsMap;
  }, new Map());

  symbolsPage.layers.forEach((symbol) => {
    if (deprecatedIcons.get(symbol.name)) {
      symbol.remove();
    }
  });
}

/**
 * Sync Carbon icon symbols into current Sketch Document
 * @param {object} params - syncIconSymbols parameters
 * @param {Document} params.document - current document
 * @param {Array<SymbolMaster>} params.symbols
 * @param {Page} params.symbolsPage - the symbols page as identified by Sketch
 * @param {Array<number>} params.sizes - array of icon sizes
 */
export function syncIconSymbols({
  document,
  symbols,
  symbolsPage,
  sizes = [32, 24, 20, 16],
}) {
  const sharedStyles = syncColorStyles({ document });
  const [sharedStyle] = sharedStyles.filter(
    ({ name }) => name === 'color / black'
  );

  if (!sharedStyle) {
    throw new Error(
      'Unexpected error occurred, expected shared style but found none'
    );
  }

  removeDeprecatedSymbolArtboards({
    icons: metadata.icons,
    sizes,
    symbolsPage,
  });

  const artboards = createSVGArtboards(
    symbolsPage,
    sharedStyle,
    metadata.icons,
    sizes.sort().reverse()
  );

  return artboards.map((artboard) => {
    return syncSymbol({
      symbols,
      name: artboard.name,
      config: {
        name: artboard.name,
        frame: artboard.frame,
        layers: artboard.layers,
        background: artboard.background,
        parent: symbolsPage,
      },
    });
  });
}

/**
 * Given a page, determine what the initial y-offset is based on the layers in
 * the page
 * @param {Page} page
 * @returns {number}
 */
function getInitialPageOffset(page) {
  return page.layers.reduce((acc, layer) => {
    if (layer.frame.y + layer.frame.height > acc) {
      return layer.frame.y + layer.frame.height;
    }
    return acc;
  }, 0);
}

/**
 * Create the SVG artboards for a given set of icons and sizes and place them in
 * the given page with the given shared style set as the fill.
 * @param {Page} page
 * @param {SharedStyle} sharedStyle
 * @param {Array} icons
 * @param {Array<number>} [sizes]
 * @returns {Array<Artboard>}
 */
function createSVGArtboards(
  page,
  sharedStyle,
  icons,
  sizes = [32, 24, 20, 16]
) {
  // We keep track of the current X and Y offsets at the top-level, each
  // iteration of an icon set should reset the X_OFFSET and update the
  // Y_OFFSET with the maximum size in the icon set.
  const ARTBOARD_MARGIN = 32;
  let X_OFFSET = 0;
  let Y_OFFSET = getInitialPageOffset(page) + ARTBOARD_MARGIN;

  return icons
    .filter((icon) => !icon.deprecated)
    .flatMap((icon) => {
      X_OFFSET = 0;

      const artboards = sizes.map((size) => {
        const asset =
          icon.assets.find((asset) => asset.size === 32) ?? icon.assets[0];
        const svgString = NSString.stringWithString(asset.source);
        const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
        const svgImporter = MSSVGImporter.svgImporter();
        svgImporter.prepareToImportFromData(svgData);
        const svgLayer = svgImporter.importAsLayer();

        svgLayer.rect = {
          origin: {
            x: 0,
            y: 0,
          },
          size: {
            width: size,
            height: size,
          },
        };

        const symbolName = getSymbolName({ icon, size });
        const artboard = new Artboard({
          name: symbolName,
          frame: new Rectangle(X_OFFSET, Y_OFFSET, size, size),
          layers: [svgLayer],
        });

        const [group] = artboard.layers;
        const paths = group.layers.map((layer) => layer.duplicate());

        /**
         * There are several different types of layers that we might run into.
         * These include:
         * 1. Fill paths, used to specify the fill for the majority of the icon
         * 2. Inner paths, used to specify the fill for a part of an icon
         * 3. Transparent, used as the bounding box for icon artboards
         * 4. Cutouts, leftover assets or ones used to cut out certain parts of
         *    an icon. They should have no fill associated with them
         */
        const {
          fillPaths = [],
          innerPaths = [],
          transparent = [],
          cutouts = [],
        } = groupByKey(paths, (layer) => {
          if (layer.name === 'Rectangle') {
            if (layer.frame.width === size && layer.frame.height === size) {
              return 'transparent';
            }
          }

          // workspace
          if (layer.name.includes('_Rectangle_')) {
            return 'transparent';
          }

          if (layer.name.includes('Transparent_Rectangle')) {
            return 'transparent';
          }

          if (layer.name === 'inner-path') {
            return 'innerPaths';
          }

          if (layer.style.fills.length > 0) {
            return 'fillPaths';
          }

          return 'cutouts';
        });

        let shape;
        if (fillPaths.length === 1) {
          shape = fillPaths[0];
          shape.name = 'Fill';
          shape.style = sharedStyle.style;
          shape.sharedStyleId = sharedStyle.id;
        } else {
          // If we have multiple fill paths, we need to consolidate them into a
          // single Shape so that we can style the icon with one override in the
          // symbol
          shape = new Shape({
            name: 'Fill',
            frame: new Rectangle(0, 0, size, size),
            layers: fillPaths,
            style: sharedStyle.style,
            sharedStyleId: sharedStyle.id,
          });
        }

        for (const layer of transparent) {
          layer.remove();
        }

        for (const innerPath of innerPaths) {
          innerPath.name = 'Inner Fill';
          innerPath.style = sharedStyle.style;
          innerPath.style.opacity = 0;
          innerPath.sharedStyleId = sharedStyle.id;
        }

        artboard.layers.push(shape, ...innerPaths, ...cutouts);
        group.remove();

        X_OFFSET += size + ARTBOARD_MARGIN;

        return artboard;
      });

      Y_OFFSET += 32 + ARTBOARD_MARGIN;

      return artboards;
    });
}
