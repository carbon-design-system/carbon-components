import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import { View16, ViewOff16, WarningFilled16 } from '@carbon/icons-react';
import { textInputProps } from './util';

const { prefix } = settings;

const ControlledPasswordInput = React.forwardRef(
  function ControlledPasswordInput(
    {
      alt,
      labelText,
      className,
      id,
      placeholder,
      onChange,
      onClick,
      hideLabel,
      invalid,
      invalidText,
      helperText,
      light,
      type = 'password',
      togglePasswordVisibility,
      hidePasswordText = 'Hide',
      showPasswordText = 'Show',
      ...other
    },
    ref
  ) {
    const errorId = id + '-error-msg';
    const textInputClasses = classNames(
      `${prefix}--text-input`,
      `${prefix}--password-input`,
      className,
      {
        [`${prefix}--text-input--light`]: light,
        [`${prefix}--text-input--invalid`]: invalid,
      }
    );
    const sharedTextInputProps = {
      id,
      onChange: evt => {
        if (!other.disabled) {
          onChange(evt);
        }
      },
      onClick: evt => {
        if (!other.disabled) {
          onClick(evt);
        }
      },
      placeholder,
      type,
      ref,
      className: textInputClasses,
      ...other,
    };
    const labelClasses = classNames(`${prefix}--label`, {
      [`${prefix}--visually-hidden`]: hideLabel,
      [`${prefix}--label--disabled`]: other.disabled,
    });
    const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
      [`${prefix}--form__helper-text--disabled`]: other.disabled,
    });
    const label = labelText ? (
      <label htmlFor={id} className={labelClasses}>
        {labelText}
      </label>
    ) : null;
    const error = invalid ? (
      <div className={`${prefix}--form-requirement`} id={errorId}>
        {invalidText}
      </div>
    ) : null;
    const passwordIsVisible = type === 'text';
    const passwordVisibilityIcon = passwordIsVisible ? (
      <ViewOff16 className={`${prefix}--icon-visibility-off`} />
    ) : (
      <View16 className={`${prefix}--icon-visibility-on`} />
    );
    const input = (
      <>
        <input
          {...textInputProps({ invalid, sharedTextInputProps, errorId })}
          data-toggle-password-visibility={type === 'password'}
        />
        <button
          className={`${prefix}--text-input--password__visibility`}
          aria-label={
            alt ||
            `${
              passwordIsVisible ? hidePasswordText : showPasswordText
            } password`
          }
          onClick={togglePasswordVisibility}>
          {passwordVisibilityIcon}
        </button>
      </>
    );
    const helper = helperText ? (
      <div className={helperTextClasses}>{helperText}</div>
    ) : null;

    return (
      <div
        className={`${prefix}--form-item ${prefix}--text-input-wrapper ${prefix}--password-input-wrapper`}>
        {label}
        {helper}
        <div
          className={`${prefix}--text-input__field-wrapper`}
          data-invalid={invalid || null}>
          {invalid && (
            <WarningFilled16
              className={`${prefix}--text-input__invalid-icon`}
            />
          )}
          {input}
        </div>
        {error}
      </div>
    );
  }
);

ControlledPasswordInput.propTypes = {
  /**
   * Provide custom alt text for the password visibility toggle button
   */
  alt: PropTypes.string,

  /**
   * Provide a custom className that is applied directly to the underlying
   * <input> node
   */
  className: PropTypes.string,

  /**
   * Optionally provide the default value of the <input>
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide a unique identifier for the input field
   */
  id: PropTypes.string.isRequired,

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Optionally provide an `onChange` handler that is called whenever <input>
   * is updated
   */
  onChange: PropTypes.func,

  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * <input> is clicked
   */
  onClick: PropTypes.func,

  /**
   * Specify the placeholder attribute for the <input>
   */
  placeholder: PropTypes.string,

  /**
   * Provide the current value of the <input>
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether or not the underlying label is visually hidden
   */
  hideLabel: PropTypes.bool,

  /**
   * Specify whether the control is currently invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText: PropTypes.string,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify light version or default version of this control
   */
  light: PropTypes.bool,
};

ControlledPasswordInput.defaultProps = {
  alt: '',
  className: '${prefix}--text__input',
  disabled: false,
  onChange: () => {},
  onClick: () => {},
  invalid: false,
  invalidText: '',
  helperText: '',
  light: false,
};

export default ControlledPasswordInput;
