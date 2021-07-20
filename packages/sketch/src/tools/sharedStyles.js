/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SharedStyle, Style } from 'sketch/dom';

/**
 * Sync a shared style within a document.
 * @param {object} params - syncSharedStyle parameters
 * @param {Document} params.document
 * @param {string} params.name
 * @param {object} params.style
 * @param {StyleType?} params.styleType
 * @returns {SharedStyle}
 */
export function syncSharedStyle({
  document,
  name,
  style,
  styleType = SharedStyle.StyleType.Layer,
}) {
  // Figure out the type of shared style and try and find if we have already
  // created a shared style with the given name
  const documentSharedStyles =
    styleType === SharedStyle.StyleType.Layer
      ? document.sharedLayerStyles
      : document.sharedTextStyles;
  const [sharedStyle] = Array.from(documentSharedStyles).filter(
    (sharedStyle) => {
      /**
       * TODO: remove the following block after next Sketch plugin release
       * backwards compatibility to avoid breaking changes from #5664, #5744
       * we search for style names with the following format
       *   `color/teal/60`
       * and reformat it to
       *   `color / teal / 60`
       * this search and replace will not be needed after the plugin has been
       * published with renamed style layers
       */
      // start removal
      if (sharedStyle.name.split('/').join(' / ') === name) {
        sharedStyle.name = name;
      }
      // end removal
      return sharedStyle.name === name;
    }
  );

  // If none exists, we can create one from scratch
  if (!sharedStyle) {
    const generatedSharedStyle = SharedStyle.fromStyle({
      name,
      style,
      styleType,
      document,
    });
    generatedSharedStyle.style.borders = [];
    return generatedSharedStyle;
  }

  // Otherwise, we'll go and update values of the sharedStyle with the given
  // style if the values are different
  Object.keys(style).forEach((key) => {
    if (sharedStyle.style[key] !== style[key]) {
      sharedStyle.style[key] = style[key];
    }
  });

  for (const layer of Array.from(sharedStyle.getAllInstancesLayers())) {
    layer.style.syncWithSharedStyle(sharedStyle);
  }

  return sharedStyle;
}

/**
 * Sync the given color value as a shared style for the document
 * @param {object} params - syncColorStyle parameters
 * @param {Document} params.document
 * @param {string} params.name
 * @param {string} params.color
 * @returns {SharedStyle}
 */
export function syncColorStyle({ document, name, color }) {
  return syncSharedStyle({
    document,
    name,
    style: {
      fills: [
        {
          color,
          fillType: Style.FillType.Color,
        },
      ],
    },
  });
}
