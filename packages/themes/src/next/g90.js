/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  // Blue
  blue40,
  blue60,
  blue70,

  // Gray
  gray10,
  gray30,
  gray40,
  gray50,
  gray50Hover,
  gray60,
  gray60Hover,
  gray70,
  gray70Hover,
  gray80,
  gray90,
  gray100,

  // Support
  blue30,
  blue50,
  green40,
  green50,
  yellow30,
  orange40,
  red30,
  red40,
  red60,
  purple40,
  purple50,

  // Constants
  white,
} from '@carbon/colors';
import { adjustLightness } from '../tools';

// Background
export const background = gray90;
export const backgroundInverse = gray10;
export const backgroundBrand = blue60;
export const backgroundActive = gray80;
export const backgroundHover = adjustLightness(background, 5);
export const backgroundInverseHover = adjustLightness(backgroundInverse, -5);
export const backgroundSelected = gray80;
export const backgroundSelectedHover = adjustLightness(backgroundSelected, 6);

// Layer
// layer-01
export const layer01 = gray80;
export const layerActive01 = gray60;
export const layerHover01 = adjustLightness(layer01, 6);
export const layerSelected01 = gray70;
export const layerSelectedHover01 = gray70Hover;

// layer-02
export const layer02 = gray70;
export const layerActive02 = gray50;
export const layerHover02 = gray70Hover;
export const layerSelected02 = gray60;
export const layerSelectedHover02 = gray60Hover;

// layer-03
export const layer03 = gray60;
export const layerActive03 = gray80;
export const layerHover03 = gray60Hover;
export const layerSelected03 = gray50;
export const layerSelectedHover03 = gray50Hover;

// layer
export const layerDisabled = gray80;
export const layerSelectedInverse = gray10;
export const layerSelectedDisabled = gray40;

// layer-accent-01
export const layerAccent01 = gray70;
export const layerAccentActive01 = gray50;
export const layerAccentHover01 = adjustLightness(layerAccent01, 7);

// layer-accent-02
export const layerAccent02 = gray60;
export const layerAccentActive02 = gray80;
export const layerAccentHover02 = adjustLightness(layerAccent01, -7);

// layer-accent-03
export const layerAccent03 = gray50;
export const layerAccentActive03 = gray70;
export const layerAccentHover03 = gray50Hover;

// Field
// field-01
export const field01 = gray80;
export const fieldHover01 = adjustLightness(field01, 6);

// field-02
export const field02 = gray70;
export const fieldHover02 = gray70Hover;

// field-03
export const field03 = gray60;
export const fieldHover03 = gray60Hover;

// field
export const fieldDisabled = gray80;

// Border
// border-subtle-00
export const borderSubtle00 = gray70;

// border-subtle-01
export const borderSubtle01 = gray70;
export const borderSubtleSelected01 = gray60;

// border-subtle-02
export const borderSubtle02 = gray60;
export const borderSubtleSelected02 = gray50;

// border-subtle-03
export const borderSubtle03 = gray50;
export const borderSubtleSelected03 = gray40;

// border-strong
export const borderStrong01 = gray50;
export const borderStrong02 = gray40;
export const borderStrong03 = gray30;

// border-inverse
export const borderInverse = gray10;

// border-interactive
export const borderInteractive = blue50;

// border
export const borderDisabled = gray80;

// Text
export const textPrimary = gray10;
export const textSecondary = gray30;
export const textPlaceholder = gray60;
export const textHelper = gray50;
export const textError = red30;
export const textInverse = gray100;
export const textOnColor = white;
export const textOnColorDisabled = gray40;
export const textDisabled = gray60;

// Link
export const linkPrimary = blue40;
export const linkPrimaryHover = blue30;
export const linkSecondary = blue30;
export const linkInverse = blue60;
export const linkVisited = purple40;

// Icon
export const iconPrimary = gray10;
export const iconSecondary = gray30;
export const iconInverse = gray100;
export const iconOnColor = white;
export const iconOnColorDisabled = gray40;
export const iconDisabled = gray60;

// Support
export const supportError = red40;
export const supportSuccess = green40;
export const supportWarning = yellow30;
export const supportInfo = blue50;
export const supportErrorInverse = red60;
export const supportSuccessInverse = green50;
export const supportWarningInverse = yellow30;
export const supportInfoInverse = blue60;
export const supportCautionMinor = yellow30;
export const supportCautionMajor = orange40;
export const supportCautionUndefined = purple50;

// Focus
export const focus = white;
export const focusInset = gray100;
export const focusInverse = blue60;

// Skeleton
export const skeletonBackground = adjustLightness(background, 5);
export const skeletonElement = gray70;

// Misc
export const interactive = blue50;
export const highlight = blue70;
export const overlay = 'rgba(22, 22, 22, 0.7)';
export const toggleOff = gray50;

export {
  // Type
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
  // Layout
  // Spacing
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
} from './white';
