/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { useId } from '../../internal/useId';

const { prefix } = settings;

function ProgressBar({
  className,
  hideLabel,
  label,
  max = 100,
  value,
  helperText,
}) {
  const id = useId('progress-bar');
  const helperId = useId('progress-bar-helper');

  const indeterminate = value === null || value === undefined;

  let cappedValue = value;
  if (cappedValue > max) {
    cappedValue = max;
  }
  if (cappedValue < 0) {
    cappedValue = 0;
  }

  const percentage = cappedValue / max;

  const wrapperClasses = classNames(
    `${prefix}--progress-bar`,
    {
      [`${prefix}--progress-bar--indeterminate`]: indeterminate,
    },
    className
  );

  const labelClasses = classNames(`${prefix}--progress-bar__label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
  });

  return (
    <div className={wrapperClasses}>
      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>
      <div
        className={`${prefix}--progress-bar__track`}
        id={id}
        role="progressbar"
        aria-valuemin={!indeterminate ? 0 : null}
        aria-valuemax={!indeterminate ? max : null}
        aria-valuenow={!indeterminate ? cappedValue : null}
        aria-describedby={helperText ? helperId : null}>
        <div
          className={`${prefix}--progress-bar__bar`}
          style={{ transform: `scaleX(${percentage})` }}
        />
      </div>
      {helperText && (
        <div id={helperId} className={`${prefix}--progress-bar__helper-text`}>
          {helperText}
        </div>
      )}
    </div>
  );
}

ProgressBar.propTypes = {
  /**
   * Additional CSS class names.
   */
  className: PropTypes.string,

  /**
   * The current progress as a textual representation.
   */
  helperText: PropTypes.string,

  /**
   * Whether the label should be visually hidden.
   */
  hideLabel: PropTypes.bool,

  /**
   * A label describing the progress bar.
   */
  label: PropTypes.string.isRequired,

  /**
   * The maximum value.
   */
  max: PropTypes.number,

  /**
   * The current value.
   */
  value: PropTypes.number,
};

export default ProgressBar;
