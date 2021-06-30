/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { settings } from 'carbon-components';
import { Copy as CopyIcon } from '@carbon/icons-react/next';
import Copy from '../Copy';

const { prefix } = settings;

export default function CopyButton({ iconDescription, className, ...other }) {
  return (
    <Copy
      className={classnames(className, `${prefix}--copy-btn`)}
      aria-label={iconDescription}
      title={iconDescription}
      {...other}>
      <CopyIcon className={`${prefix}--snippet__icon`} />
    </Copy>
  );
}

CopyButton.propTypes = {
  /**
   * Specify an optional className to be applied to the underlying `<button>`
   */
  className: PropTypes.string,

  /**
   * Specify the string that is displayed when the button is clicked and the
   * content is copied
   */
  feedback: PropTypes.string,

  /**
   * Specify the time it takes for the feedback message to timeout
   */
  feedbackTimeout: PropTypes.number,

  /**
   * Provide a description for the icon representing the copy action that can
   * be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify an optional `onClick` handler that is called when the underlying
   * `<button>` is clicked
   */
  onClick: PropTypes.func,
};

CopyButton.defaultProps = {
  iconDescription: 'Copy to clipboard',
  feedback: 'Copied!',
  feedbackTimeout: 2000,
  onClick: () => {},
};
