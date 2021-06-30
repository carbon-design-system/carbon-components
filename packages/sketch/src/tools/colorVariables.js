/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global MSColor */

import { Swatch } from 'sketch/dom';

/**
 * Creates or updates a color variable (Swatch) in the current working document
 * @param {object} params - syncColorVariable parameters
 * @param {Document} params.document
 * @param {string} params.name - color name
 * @param {string} params.color - color hex
 * @returns {void}
 */
export function syncColorVariable({ document, name, color }) {
  // check existing color variables
  const documentColorVariables = document.swatches;
  const colorVariable = documentColorVariables.find(
    (swatch) => swatch.name === name
  );

  // generate new Swatch
  const generatedSwatch = Swatch.from({
    name,
    color,
  });

  // create and add new color variable if existing Swatch not found
  if (!colorVariable) {
    document.swatches.push(generatedSwatch);
    return;
  }

  // update existing color variable
  if (colorVariable.color !== generatedSwatch.color) {
    // slice up Sketch swatch color hex since they use rgba hex
    const generatedColor = generatedSwatch.color.slice(0, -2);
    const generatedAlpha = generatedSwatch.color.slice(-2);

    /**
     * currently (May 2021) need native API to update color of a swatch
     * ref: https://sketchplugins.com/d/2205-js-api-guide-whats-up-with-color-variables
     */
    colorVariable.sketchObject.updateWithColor(
      MSColor.colorWithHex_alpha(
        generatedColor,
        // convert hex alpha channel to decimal
        parseInt(generatedAlpha, 16) / 255
      )
    );

    /**
     * because the color does not get updated automatically we have to manually
     * call an update method. may possibly be fixed in future Sketch API
     * versions
     */
    const swatchContainer = document.sketchObject
      .documentData()
      .sharedSwatches();
    swatchContainer.updateReferencesToSwatch(colorVariable.sketchObject);
  }
}
