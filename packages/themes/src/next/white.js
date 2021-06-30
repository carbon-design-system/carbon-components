/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  // Blue
  blue20,
  blue40,
  blue60,
  blue70,

  // Gray
  gray10,
  gray20,
  gray20Hover,
  gray30,
  gray40,
  gray50,
  gray60,
  gray70,
  gray80,
  gray100,

  // Support
  blue50,
  green40,
  green50,
  yellow30,
  orange40,
  red50,
  red60,
  purple60,

  // Constants
  white,
  whiteHover,
} from '@carbon/colors';
import { adjustLightness } from '../tools';

// Background
export const background = white;
export const backgroundInverse = gray80;
export const backgroundBrand = blue60;
export const backgroundActive = gray30;
export const backgroundHover = whiteHover;
export const backgroundInverseHover = adjustLightness(backgroundInverse, 6);
export const backgroundSelected = gray20;
export const backgroundSelectedHover = adjustLightness(backgroundSelected, -6);

// Layer
// layer-01
export const layer01 = gray10;
export const layerActive01 = gray30;
export const layerHover01 = adjustLightness(layer01, -5);
export const layerSelected01 = gray20;
export const layerSelectedHover01 = gray20Hover;

// layer-02
export const layer02 = white;
export const layerActive02 = gray30;
export const layerHover02 = adjustLightness(layer01, -5);
export const layerSelected02 = gray20;
export const layerSelectedHover02 = gray20Hover;

// layer-03
export const layer03 = gray10;
export const layerActive03 = gray30;
export const layerHover03 = adjustLightness(layer01, -5);
export const layerSelected03 = gray20;
export const layerSelectedHover03 = gray20Hover;

// layer
export const layerDisabled = gray10;
export const layerSelectedInverse = gray100;
export const layerSelectedDisabled = gray50;

// layer-accent-01
export const layerAccent01 = gray20;
export const layerAccentActive01 = gray40;
export const layerAccentHover01 = adjustLightness(layerAccent01, -6);

// layer-accent-02
export const layerAccent02 = gray20;
export const layerAccentActive02 = gray40;
export const layerAccentHover02 = adjustLightness(layerAccent01, -6);

// layer-accent-03
export const layerAccent03 = gray20;
export const layerAccentActive03 = gray40;
export const layerAccentHover03 = adjustLightness(layerAccent01, -6);

// Field
// field-01
export const field01 = gray10;
export const fieldHover01 = adjustLightness(field01, -5);

// field-02
export const field02 = white;
export const fieldHover02 = adjustLightness(field01, -5);

// field-03
export const field03 = gray10;
export const fieldHover03 = adjustLightness(field01, -5);

// field
export const fieldDisabled = gray10;

// Border
// border-subtle-00
export const borderSubtle00 = gray20;

// border-subtle-01
export const borderSubtle01 = gray20;
export const borderSubtleSelected01 = gray30;

// border-subtle-02
export const borderSubtle02 = gray20;
export const borderSubtleSelected02 = gray30;

// border-subtle-03
export const borderSubtle03 = gray20;
export const borderSubtleSelected03 = gray30;

// border-strong
export const borderStrong01 = gray50;
export const borderStrong02 = gray50;
export const borderStrong03 = gray50;

// border-inverse
export const borderInverse = gray100;

// border-interactive
export const borderInteractive = blue60;

// border
export const borderDisabled = gray10;

// Text
export const textPrimary = gray100;
export const textSecondary = gray70;
export const textPlaceholder = gray40;
export const textHelper = gray60;
export const textError = red60;
export const textInverse = white;
export const textOnColor = white;
export const textOnColorDisabled = gray50;
export const textDisabled = gray30;

// Link
export const linkPrimary = blue60;
export const linkPrimaryHover = blue70;
export const linkSecondary = blue70;
export const linkInverse = blue40;
export const linkVisited = purple60;

// Icon
export const iconPrimary = gray100;
export const iconSecondary = gray70;
export const iconInverse = white;
export const iconOnColor = white;
export const iconOnColorDisabled = gray50;
export const iconDisabled = gray30;

// Support
export const supportError = red60;
export const supportSuccess = green50;
export const supportWarning = yellow30;
export const supportInfo = blue70;
export const supportErrorInverse = red50;
export const supportSuccessInverse = green40;
export const supportWarningInverse = yellow30;
export const supportInfoInverse = blue50;
export const supportCautionMinor = yellow30;
export const supportCautionMajor = orange40;
export const supportCautionUndefined = purple60;

// Focus
export const focus = blue60;
export const focusInset = white;
export const focusInverse = white;

// Skeleton
export const skeletonBackground = whiteHover;
export const skeletonElement = gray30;

// Misc
export const interactive = blue60;
export const highlight = blue20;
export const overlay = 'rgba(22, 22, 22, 0.5)';
export const toggleOff = gray50;

// Type
export {
  caption01,
  caption02,
  label01,
  label02,
  helperText01,
  helperText02,
  bodyShort01,
  bodyLong01,
  bodyShort02,
  bodyLong02,
  code01,
  code02,
  heading01,
  productiveHeading01,
  heading02,
  productiveHeading02,
  productiveHeading03,
  productiveHeading04,
  productiveHeading05,
  productiveHeading06,
  productiveHeading07,
  expressiveHeading01,
  expressiveHeading02,
  expressiveHeading03,
  expressiveHeading04,
  expressiveHeading05,
  expressiveHeading06,
  expressiveParagraph01,
  quotation01,
  quotation02,
  display01,
  display02,
  display03,
  display04,
} from '@carbon/type';

// Layout
// Spacing
export {
  spacing01,
  spacing02,
  spacing03,
  spacing04,
  spacing05,
  spacing06,
  spacing07,
  spacing08,
  spacing09,
  spacing10,
  spacing11,
  spacing12,
  spacing13,
  // Fluid spacing
  fluidSpacing01,
  fluidSpacing02,
  fluidSpacing03,
  fluidSpacing04,
  // Containers
  container01,
  container02,
  container03,
  container04,
  container05,
  sizeXSmall,
  sizeSmall,
  sizeMedium,
  sizeLarge,
  sizeXLarge,
  size2XLarge,
  // Icon sizes
  iconSize01,
  iconSize02,
} from '@carbon/layout';
