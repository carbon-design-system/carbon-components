/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import {
  Calendar,
  WarningFilled,
  WarningAltFilled,
} from '@carbon/icons-react/next';

const { prefix } = settings;

export default class DatePickerInput extends Component {
  static propTypes = {
    /**
     * The type of the date picker:
     *
     * * `simple` - Without calendar dropdown.
     * * `single` - With calendar dropdown and single date.
     * * `range` - With calendar dropdown and a date range.
     */
    datePickerType: PropTypes.oneOf(['simple', 'single', 'range']),

    /**
     * Specify whether or not the input should be disabled
     */
    disabled: PropTypes.bool,

    /**
     * Specify if the label should be hidden
     */
    hideLabel: PropTypes.bool,

    /**
     * The description of the calendar icon.
     */
    iconDescription: PropTypes.string,

    /**
     * Specify an id that uniquely identifies the `<input>`
     */
    id: PropTypes.string.isRequired,

    /**
     * Specify whether or not the input should be invalid
     */
    invalid: PropTypes.bool,

    /**
     * Specify the text to be rendered when the input is invalid
     */
    invalidText: PropTypes.node,

    /**
     * Provide the text that will be read by a screen reader when visiting this
     * control
     */
    labelText: PropTypes.node.isRequired,

    /**
     * Specify an `onChange` handler that is called whenever a change in the
     * input field has occurred
     */
    onChange: PropTypes.func,

    /**
     * Provide a function to be called when the input field is clicked
     */
    onClick: PropTypes.func,

    /**
     * Provide a function to be called when the input field is clicked
     */
    openCalendar: PropTypes.func,

    /**
     * Provide a regular expression that the input value must match
     */
    pattern: (props, propName, componentName) => {
      if (props[propName] === undefined) {
        return;
      }
      try {
        new RegExp(props[propName]);
      } catch (e) {
        return new Error(
          `Invalid value of prop '${propName}' supplied to '${componentName}', it should be a valid regular expression`
        );
      }
    },

    /**
     * Specify the placeholder text
     */
    placeholder: PropTypes.string,

    /**
     * Specify the size of the Date Picker Input. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
     * TODO V11: remove `xl` (replaced with lg)
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),

    /**
     * Specify the type of the `<input>`
     */
    type: PropTypes.string,
    /**
     * Specify whether the control is currently in warning state
     */
    warn: PropTypes.bool,
    /**
     * Provide the text that is displayed when the control is in warning state
     */
    warnText: PropTypes.node,
  };

  static defaultProps = {
    pattern: '\\d{1,2}\\/\\d{1,2}\\/\\d{4}',
    type: 'text',
    disabled: false,
    invalid: false,
    onClick: () => {},
    onChange: () => {},
  };

  render() {
    const {
      id,
      labelText,
      disabled,
      invalid,
      invalidText,
      hideLabel,
      onChange,
      onClick,
      placeholder,
      type,
      datePickerType,
      pattern,
      iconDescription,
      openCalendar,
      size,
      warn,
      warnText,
      ...other
    } = this.props;

    const datePickerInputProps = {
      id,
      onChange: (evt) => {
        if (!disabled) {
          onChange(evt);
        }
      },
      onClick: (evt) => {
        if (!disabled) {
          onClick(evt);
        }
      },
      placeholder,
      type,
      pattern,
    };

    const wrapperClasses = classNames(`${prefix}--date-picker-input__wrapper`, {
      [`${prefix}--date-picker-input__wrapper--invalid`]: invalid,
      [`${prefix}--date-picker-input__wrapper--warn`]: warn,
    });

    const labelClasses = classNames(`${prefix}--label`, {
      [`${prefix}--visually-hidden`]: hideLabel,
      [`${prefix}--label--disabled`]: disabled,
    });

    const inputClasses = classNames(`${prefix}--date-picker__input`, {
      [`${prefix}--date-picker__input--${size}`]: size,
      [`${prefix}--date-picker__input--invalid`]: invalid,
    });

    const datePickerIcon = (() => {
      if (datePickerType === 'simple' && !invalid && !warn) {
        return;
      }

      if (invalid) {
        return (
          <WarningFilled
            className={`${prefix}--date-picker__icon ${prefix}--date-picker__icon--invalid`}
          />
        );
      }

      if (!invalid && warn) {
        return (
          <WarningAltFilled
            className={`${prefix}--date-picker__icon ${prefix}--date-picker__icon--warn`}
          />
        );
      }

      return (
        <Calendar
          className={`${prefix}--date-picker__icon`}
          aria-label={iconDescription}
          onClick={openCalendar}
          role="img">
          {iconDescription && <title>{iconDescription}</title>}
        </Calendar>
      );
    })();

    const label = labelText ? (
      <label htmlFor={id} className={labelClasses}>
        {labelText}
      </label>
    ) : null;

    let error = null;
    if (invalid) {
      error = (
        <div className={`${prefix}--form-requirement`}>{invalidText}</div>
      );
    } else if (warn) {
      error = <div className={`${prefix}--form-requirement`}>{warnText}</div>;
    }

    const containerClasses = classNames(`${prefix}--date-picker-container`, {
      [`${prefix}--date-picker--nolabel`]: !label,
    });

    const input = invalid ? (
      <input
        {...other}
        {...datePickerInputProps}
        disabled={disabled}
        ref={(input) => {
          this.input = input;
        }}
        data-invalid
        className={inputClasses}
      />
    ) : (
      <input
        ref={(input) => {
          this.input = input;
        }}
        {...other}
        {...datePickerInputProps}
        disabled={disabled}
        className={inputClasses}
      />
    );

    return (
      <div className={containerClasses}>
        {label}
        <div className={wrapperClasses}>
          {input}
          {datePickerIcon}
        </div>
        {error}
      </div>
    );
  }
}
