/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  WarningFilled16,
  WarningAltFilled16,
  EditOff16,
} from '@carbon/icons-react';
import { settings } from 'carbon-components';

const { prefix } = settings;

/**
 * @typedef {object} InputProps
 * @property {string} id - The input's id
 * @property {boolean} readOnly - Whether the input should be readonly
 * @property {boolean} disabled - Whether the input should be disabled
 * @property {boolean} invalid - Whether the input should be marked as invalid
 * @property {string} invalidText - The validation message displayed in case the input is considered invalid
 * @property {boolean} warn - Whether the input should be in warning state
 * @property {string} warnText - The validation message displayed in case the input is in warning state
 */

/**
 * @typedef {object} NormalizedInputProps
 * @property {boolean} disabled - Whether the input is disabled
 * @property {boolean} invalid - Whether the input is invalid (takes precedence over warn)
 * @property {string} invalidId - The invalid message's id
 * @property {boolean} warn - Whether the input is in warning state
 * @property {string} warnId - The warning message's id
 * @property {React.ReactNode | null} validation – React node rendering the appropriate validation message (if any)
 * @property {React.ReactNode | null} icon – React node rendering the appropriate accompanying icon (if any)
 */

/**
 * Returns an object containing non-colliding props and additional, generated ones.
 * This hook ensures that only either "invalid" or "warn" is true but never both at
 * the same time. Regardless whether "invalid" or "warn", the appropriate validation
 * message is passed as "validation". If the input should be accompanied by an icon
 * (to visually represent a readonly, invalid or warning state), the appropriate icon
 * is passed as "icon".
 * It also ensure that neither "invalid", nor "warn", nor "disabled" are enabled when
 * "readonly" is passed as "readonly" takes precedence over these variants.
 *
 * @param {InputProps} props - The props passed to the component
 * @returns {NormalizedInputProps}
 */
export function useNormalizedInputProps({
  id,
  readOnly,
  disabled,
  invalid,
  invalidText,
  warn,
  warnText,
}) {
  const normalizedProps = {
    disabled: !readOnly && disabled,
    invalid: !readOnly && invalid,
    invalidId: `${id}-error-msg`,
    warn: !readOnly && !invalid && warn,
    warnId: `${id}-warn-msg`,
    validation: null,
    icon: null,
  };

  if (readOnly) {
    normalizedProps.icon = EditOff16;
  } else {
    if (normalizedProps.invalid) {
      normalizedProps.icon = WarningFilled16;
      normalizedProps.validation = (
        <div
          className={`${prefix}--form-requirement`}
          id={normalizedProps.invalidId}>
          {invalidText}
        </div>
      );
    } else if (normalizedProps.warn) {
      normalizedProps.icon = WarningAltFilled16;
      normalizedProps.validation = (
        <div
          className={`${prefix}--form-requirement`}
          id={normalizedProps.warnId}>
          {warnText}
        </div>
      );
    }
  }

  return normalizedProps;
}
