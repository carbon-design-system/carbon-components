/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { TokenFormat, group } = require('../../../src/next');

const denylist = new Set([
  'background',
  'layer',
  'layerAccent',
  'layerAccentHover',
  'layerAccentActive',
  'field',
  'backgroundInverse',
  'backgroundBrand',
  'interactive',

  'borderSubtle',
  'borderStrong',
  'borderInverse',
  'borderInteractive',

  'textPrimary',
  'textSecondary',
  'textPlaceholder',
  'textHelper',
  'textOnColor',
  'textInverse',

  'linkPrimary',
  'linkSecondary',
  'linkVisited',
  'linkInverse',

  'iconPrimary',
  'iconSecondary',
  'iconOnColor',
  'iconInverse',

  'supportError',
  'supportSuccess',
  'supportWarning',
  'supportInfo',
  'supportErrorInverse',
  'supportSuccessInverse',
  'supportWarningInverse',
  'supportInfoInverse',

  'overlay',
  'toggleOff',

  'buttonPrimary',
  'buttonSecondary',
  'buttonTertiary',
  'buttonDangerPrimary',
  'buttonDangerSecondary',

  'backgroundActive',
  'layerActive',

  'buttonDangerActive',
  'buttonPrimaryActive',
  'buttonSecondaryActive',
  'buttonTertiaryActive',

  'focusInset',
  'focusInverse',

  'backgroundHover',
  'layerHover',
  'fieldHover',
  'backgroundInverseHover',
  'linkPrimaryHover',
  'buttonDangerHover',
  'buttonPrimaryHover',
  'buttonSecondaryHover',
  'buttonTertiaryHover',

  'backgroundSelected',
  'backgroundSelectedHover',
  'layerSelected',
  'layerSelectedHover',
  'layerSelectedInverse',
  'borderSubtleSelected',

  'layerDisabled',
  'fieldDisabled',
  'borderDisabled',

  'textDisabled',
  'buttonDisabled',
  'iconDisabled',

  'textOnColorDisabled',
  'iconOnColorDisabled',
  'layerSelectedDisabled',

  'skeletonBackground',
  'skeletonElement',

  // Deprecated
  'brand01',
  'brand02',
  'brand03',
  'active01',
  // 'hoverField',
  'danger',
]);

function shouldIncludeToken(token) {
  if (denylist.has(token)) {
    return false;
  }
  const id = TokenFormat.convert({
    name: token,
    format: TokenFormat.formats.scss,
  });
  return !group.getToken(id);
}

module.exports = {
  shouldIncludeToken,
};
