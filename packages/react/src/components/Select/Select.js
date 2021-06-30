/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import {
  ChevronDown,
  WarningFilled,
  WarningAltFilled,
} from '@carbon/icons-react/next';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;

const Select = React.forwardRef(function Select(
  {
    className,
    id,
    inline,
    labelText,
    disabled,
    children,
    // reserved for use with <Pagination> component
    noLabel,
    // eslint-disable-next-line no-unused-vars
    iconDescription,
    hideLabel,
    invalid,
    invalidText,
    helperText,
    light,
    size,
    warn,
    warnText,
    ...other
  },
  ref
) {
  const selectClasses = classNames({
    [`${prefix}--select`]: true,
    [`${prefix}--select--inline`]: inline,
    [`${prefix}--select--light`]: light,
    [`${prefix}--select--invalid`]: invalid,
    [`${prefix}--select--disabled`]: disabled,
    [`${prefix}--select--warning`]: warn,
    [className]: className,
  });
  const labelClasses = classNames(`${prefix}--label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
    [`${prefix}--label--disabled`]: disabled,
  });
  const inputClasses = classNames({
    [`${prefix}--select-input`]: true,
    [`${prefix}--select-input--${size}`]: size,
  });
  const errorId = `${id}-error-msg`;
  const errorText = (() => {
    if (invalid) {
      return invalidText;
    }
    if (warn) {
      return warnText;
    }
  })();
  const error =
    invalid || warn ? (
      <div className={`${prefix}--form-requirement`} id={errorId}>
        {errorText}
      </div>
    ) : null;
  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: disabled,
  });
  const helper = helperText ? (
    <div className={helperTextClasses}>{helperText}</div>
  ) : null;
  const ariaProps = {};
  if (invalid) {
    ariaProps['aria-describedby'] = errorId;
  }
  const input = (() => {
    return (
      <>
        <select
          {...other}
          {...ariaProps}
          id={id}
          className={inputClasses}
          disabled={disabled || undefined}
          aria-invalid={invalid || undefined}
          ref={ref}>
          {children}
        </select>
        <ChevronDown className={`${prefix}--select__arrow`} />
        {invalid && (
          <WarningFilled className={`${prefix}--select__invalid-icon`} />
        )}
        {!invalid && warn && (
          <WarningAltFilled
            className={`${prefix}--select__invalid-icon ${prefix}--select__invalid-icon--warning`}
          />
        )}
      </>
    );
  })();
  return (
    <div className={`${prefix}--form-item`}>
      <div className={selectClasses}>
        {!noLabel && (
          <label htmlFor={id} className={labelClasses}>
            {labelText}
          </label>
        )}
        {inline && (
          <div className={`${prefix}--select-input--inline__wrapper`}>
            <div
              className={`${prefix}--select-input__wrapper`}
              data-invalid={invalid || null}>
              {input}
            </div>
            {error}
          </div>
        )}
        {!inline && (
          <div
            className={`${prefix}--select-input__wrapper`}
            data-invalid={invalid || null}>
            {input}
          </div>
        )}
        {!inline && error ? error : helper}
      </div>
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  /**
   * Provide the contents of your Select
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the node containing the label and the select box
   */
  className: PropTypes.string,

  /**
   * Optionally provide the default value of the `<select>`
   */
  defaultValue: PropTypes.any,

  /**
   * Specify whether the control is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: PropTypes.bool,

  /**
   * Provide a description for the twistie icon that can be read by screen readers
   */
  iconDescription: deprecate(
    PropTypes.string,
    'The `iconDescription` prop for `Select` is no longer needed and has ' +
      'been deprecated. It will be moved in the next major release.'
  ),

  /**
   * Specify a custom `id` for the `<select>`
   */
  id: PropTypes.string.isRequired,

  /**
   * Specify whether you want the inline version of this control
   */
  inline: PropTypes.bool,

  /**
   * Specify if the currently value is invalid.
   */
  invalid: PropTypes.bool,

  /**
   * Message which is displayed if the value is invalid.
   */
  invalidText: PropTypes.node,

  /**
   * Provide label text to be read by screen readers when interacting with the
   * control
   */
  labelText: PropTypes.node,

  /**
   * Specify whether you want the light version of this control
   */
  light: PropTypes.bool,

  /**
   * Reserved for use with <Pagination> component. Will not render a label for the
   * select since Pagination renders one for us.
   */
  noLabel: PropTypes.bool,

  /**
   * Provide an optional `onChange` hook that is called each time the value of
   * the underlying `<input>` changes
   */
  onChange: PropTypes.func,

  /**
   * Specify the size of the Select Input. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
   * TODO V11: remove `xl` (replaced with lg)
   */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),

  /**
   * Specify whether the control is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText: PropTypes.node,
};

Select.defaultProps = {
  disabled: false,
  labelText: 'Select',
  inline: false,
  invalid: false,
  invalidText: '',
  helperText: '',
  light: false,
};

export default Select;
