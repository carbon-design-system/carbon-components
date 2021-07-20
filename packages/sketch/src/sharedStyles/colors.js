/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { colors } from '@carbon/colors';
import { formatTokenName } from '@carbon/themes';
import { syncColorStyle } from '../tools/sharedStyles';
import { syncColorVariable } from '../tools/colorVariables';

// We separate out certain colors that are not a part of the primary swatches
// that we need to render
const { black, white, orange, yellow, ...swatches } = colors;

/**
 * Format name for shared layer styles or color variables
 * Shared styles names will need to have the `color` namespace
 * Both shared styles and color variables need a name for the swatch and an
 * optional grade.
 * @param {object} params
 * @param {string} params.name - kebab cased color name
 * @param {string?} params.grade - color grade
 * @param {string?} params.formatFor - color name output format
 * @returns {string}
 */
function formatColorName({ name, grade, formatFor }) {
  const formattedName = name.split('-').join(' ');
  switch (formatFor) {
    case 'sharedLayerStyle':
      return ['color', formattedName, grade].filter(Boolean).join(' / ');
    case 'colorVariable':
      return [
        grade ? `${formattedName}/${formattedName}` : formattedName,
        grade,
      ]
        .filter(Boolean)
        .join(' ');
    default:
      return '';
  }
}

/**
 * Sync color shared styles OR color variables to the given document and return
 * the result
 * @param {object} params - syncColors parameters
 * @param {Document} params.document
 * @param {string} params.formatFor - one of 'colorVariable' or
 * 'sharedLayerStyle'
 * @returns {Array<SharedStyle|Swatch>}
 */
export function syncColors({ document, formatFor }) {
  // determine sync function based on `formatFor`
  const syncColorModel = {
    sharedLayerStyle: syncColorStyle,
    colorVariable: syncColorVariable,
  }[formatFor];

  const colorModels = Object.entries(swatches).flatMap(
    ([swatchName, gradesObj]) =>
      Object.entries(gradesObj).map(([grade, color]) => {
        const tokenName = formatTokenName(swatchName);
        const name = formatColorName({ name: tokenName, grade, formatFor });
        return syncColorModel({ document, name, color });
      })
  );

  const singleColors = [
    ['black', black['100']],
    ['white', white['0']],
    ['orange', orange['40']],
    ['yellow', yellow['30']],
  ].map(([name, color]) =>
    syncColorModel({
      document,
      name: formatColorName({ name, formatFor }),
      color,
    })
  );

  return colorModels.concat(singleColors);
}

/**
 * Sync color shared styles to the given document and return the result
 * @param {object} params - syncColorStyles parameters
 * @param {Document} params.document
 * @returns {Array<SharedStyle>}
 */
export function syncColorStyles({ document }) {
  return syncColors({ document, formatFor: 'sharedLayerStyle' });
}

/**
 * Sync color variables (Swatches) in the given document and return an array
 * @param {object} params - syncColorVariables parameters
 * @param {Document} params.document
 * @returns {Array<Swatch>}
 */
export function syncColorVariables({ document }) {
  return syncColors({ document, formatFor: 'colorVariable' });
}
