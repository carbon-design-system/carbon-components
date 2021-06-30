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
 * Sync color shared styles to the given document and return the result
 * @param {object} params - syncColorStyles parameters
 * @param {Document} params.document
 * @returns {Array<SharedStyle>}
 */
export function syncColorStyles({ document }) {
  const sharedStyles = Object.keys(swatches).flatMap((swatchName) => {
    const name = formatTokenName(swatchName);
    const result = Object.keys(swatches[swatchName]).map((grade) => {
      return syncColorStyle({
        document,
        name: formatColorName({ name, grade, formatFor: 'sharedLayerStyle' }),
        value: swatches[swatchName][grade],
      });
    });
    return result;
  });

  const singleColors = [
    ['black', black['100']],
    ['white', white['0']],
    ['orange', orange['40']],
    ['yellow', yellow['30']],
  ].map(([name, value]) => {
    return syncColorStyle({
      document,
      name: formatColorName({ name, formatFor: 'sharedLayerStyle' }),
      value,
    });
  });

  return sharedStyles.concat(singleColors);
}

/**
 * Sync color variables (Swatches) in the given document and return an array
 * @param {object} params - syncColorVariables parameters
 * @param {Document} params.document
 * @returns {Array<Swatch>}
 */
export function syncColorVariables({ document }) {
  const colorVariables = Object.keys(swatches).flatMap((swatchName) => {
    const name = formatTokenName(swatchName);
    const result = Object.keys(swatches[swatchName]).map((grade) => {
      return syncColorVariable({
        document,
        name: formatColorName({ name, grade, formatFor: 'colorVariable' }),
        color: swatches[swatchName][grade],
      });
    });
    return result;
  });

  const singleColors = [
    ['black', black['100']],
    ['white', white['0']],
    ['orange', orange['40']],
    ['yellow', yellow['30']],
  ].map(([name, color]) => {
    return syncColorVariable({
      document,
      name: formatColorName({ name, formatFor: 'colorVariable' }),
      color,
    });
  });

  return colorVariables.concat(singleColors);
}
