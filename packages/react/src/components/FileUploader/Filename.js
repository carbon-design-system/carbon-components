/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Close,
  WarningFilled,
  CheckmarkFilled,
} from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import PropTypes from 'prop-types';
import React from 'react';
import Loading from '../Loading';

const { prefix } = settings;

function Filename({ iconDescription, status, invalid, ...rest }) {
  switch (status) {
    case 'uploading':
      return (
        <Loading description={iconDescription} small withOverlay={false} />
      );
    case 'edit':
      return (
        <>
          {invalid && <WarningFilled className={`${prefix}--file-invalid`} />}
          <button
            aria-label={iconDescription}
            className={`${prefix}--file-close`}
            type="button"
            {...rest}>
            <Close />
          </button>
        </>
      );
    case 'complete':
      return (
        <CheckmarkFilled
          aria-label={iconDescription}
          className={`${prefix}--file-complete`}
          {...rest}>
          {iconDescription && <title>{iconDescription}</title>}
        </CheckmarkFilled>
      );
    default:
      return null;
  }
}

Filename.propTypes = {
  /**
   * Provide a description of the SVG icon to denote file upload status
   */
  iconDescription: PropTypes.string,

  /**
   * Specify if the file is invalid
   */
  invalid: PropTypes.bool,

  /**
   * Status of the file upload
   */
  status: PropTypes.oneOf(['edit', 'complete', 'uploading']),

  /**
   * Provide a custom tabIndex value for the <Filename>
   */
  tabIndex: PropTypes.string,
};

Filename.defaultProps = {
  iconDescription: 'Uploading file',
  status: 'uploading',
  tabIndex: '0',
};

export default Filename;
