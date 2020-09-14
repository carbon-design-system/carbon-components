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

const metadata = require('../../../generated/pictograms/metadata.json');

export function syncPictogramSymbols(
  document,
  symbols,
  symbolsPage,
  sharedLayerStyles,
  sizes = [48]
) {
  const sharedStyles = syncColorStyles(document, 'border');
  const [sharedStyle] = sharedStyles.filter(
    ({ name }) => name === 'color / border / black'
  );

  if (!sharedStyle) {
    throw new Error(
      'Unexpected error occurred, expected shared style but found none'
    );
  }

  const artboards = createSVGArtboards(
    symbolsPage,
    sharedStyle,
    metadata.icons,
    sizes
  );

  return artboards.map(artboard => {
    return syncSymbol(symbols, sharedLayerStyles, artboard.name, {
      name: artboard.name,
      frame: artboard.frame,
      layers: artboard.layers,
      background: artboard.background,
      parent: symbolsPage,
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
 * Create the SVG artboards for the pictograms and place them in
 * the given page with the given shared style set as the border.
 * @param {Page} page
 * @param {SharedStyle} sharedStyle
 * @param {Array} pictograms
 * @param {Array<number>} [sizes]
 * @returns {Array<Artboard>}
 */
function createSVGArtboards(page, sharedStyle, pictograms, sizes = [48]) {
  // We keep track of the current X and Y offsets at the top-level, each
  // iteration of pictogram should reset the X_OFFSET and update the
  // Y_OFFSET with the maximum size in the pictogram.
  const ARTBOARD_MARGIN = 48;
  let X_OFFSET = 0;
  let Y_OFFSET = getInitialPageOffset(page) + ARTBOARD_MARGIN;

  return pictograms
    .filter(pictogram => !pictogram.deprecated)
    .flatMap(pictogram => {
      X_OFFSET = 0;

      const artboards = sizes.map(size => {
        const [asset] = pictogram.assets;
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

        let symbolName = `${pictogram.name}`;

        if (pictogram.category) {
          symbolName = `${pictogram.category} / ${symbolName}`;
        }

        symbolName = `pictogram / ${symbolName}`;

        const artboard = new Artboard({
          name: symbolName,
          frame: new Rectangle(X_OFFSET, Y_OFFSET, size, size),
          layers: [svgLayer],
        });

        const [group] = artboard.layers;
        const paths = group.layers.map(layer => layer.duplicate());

        /**
         * There are several different types of layers that we might run into.
         * These include:
         * 1. Stroke paths, used to specify the stroke for the majority of the
         *    icon
         * 2. Transparent, used as the bounding box for icon artboards
         * 3. Cutouts, leftover assets or ones used to cut out certain parts of
         *    an icon. They should have no stroke associated with them
         */
        const { strokePaths = [], transparent = [], cutouts = [] } = groupByKey(
          paths,
          layer => {
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

            if (layer.style.fills.length > 0) {
              return 'strokePaths';
            }

            return 'cutouts';
          }
        );

        let shape;
        if (strokePaths.length === 1) {
          shape = strokePaths[0];
          shape.name = 'Border';
          shape.style = sharedStyle.style;
          shape.sharedStyleId = sharedStyle.id;
        } else {
          // If we have multiple stroke paths, we need to consolidate them into
          // a single Shape so that we can style the icon with one override in
          // the symbol
          shape = new Shape({
            name: 'Border',
            frame: new Rectangle(0, 0, size, size),
            layers: strokePaths,
            style: sharedStyle.style,
            sharedStyleId: sharedStyle.id,
          });
        }

        shape.style.fills = [];

        for (const layer of transparent) {
          layer.remove();
        }

        artboard.layers.push(shape, ...cutouts);
        group.remove();

        X_OFFSET += size + ARTBOARD_MARGIN;

        return artboard;
      });

      Y_OFFSET += 48 + ARTBOARD_MARGIN;

      return artboards;
    });
}
