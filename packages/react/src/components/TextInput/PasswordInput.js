import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import { View16, ViewOff16 } from '@carbon/icons-react';
import { useNormalizedInputProps } from '../../internal/useNormalizedInputProps';
import { textInputProps } from './util';
import { FormContext } from '../FluidForm';

const { prefix } = settings;

const PasswordInput = React.forwardRef(function PasswordInput(
  {
    labelText,
    className,
    disabled,
    id,
    placeholder,
    onChange,
    onClick,
    hideLabel,
    inline,
    invalid,
    invalidText,
    helperText,
    light,
    tooltipPosition = 'bottom',
    tooltipAlignment = 'center',
    type = 'password',
    hidePasswordLabel = 'Hide password',
    showPasswordLabel = 'Show password',
    size,
    onTogglePasswordVisibility,
    warn,
    warnText,
    ...other
  },
  ref
) {
  const [inputType, setInputType] = useState(type);

  const normalizedProps = useNormalizedInputProps({
    id,
    invalid,
    invalidText,
    warn,
    warnText,
  });

  const handleTogglePasswordVisibility = (event) => {
    setInputType(inputType === 'password' ? 'text' : 'password');
    onTogglePasswordVisibility && onTogglePasswordVisibility(event);
  };
  const textInputClasses = classNames(
    `${prefix}--text-input`,
    `${prefix}--password-input`,
    className,
    {
      [`${prefix}--text-input--light`]: light,
      [`${prefix}--text-input--invalid`]: normalizedProps.invalid,
      [`${prefix}--text-input--warning`]: normalizedProps.warn,
      [`${prefix}--text-input--${size}`]: size,
    }
  );
  const sharedTextInputProps = {
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
    type: inputType,
    className: textInputClasses,
    ref,
    ...other,
  };
  const inputWrapperClasses = classNames(
    `${prefix}--form-item`,
    `${prefix}--text-input-wrapper`,
    `${prefix}--password-input-wrapper`,
    {
      [`${prefix}--text-input-wrapper--light`]: light,
      [`${prefix}--text-input-wrapper--inline`]: inline,
    }
  );
  const labelClasses = classNames(`${prefix}--label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--label--inline`]: inline,
    [`${prefix}--label--inline--${size}`]: inline && !!size,
  });
  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: disabled,
    [`${prefix}--form__helper-text--inline`]: inline,
  });
  const fieldOuterWrapperClasses = classNames(
    `${prefix}--text-input__field-outer-wrapper`,
    {
      [`${prefix}--text-input__field-outer-wrapper--inline`]: inline,
    }
  );
  const fieldWrapperClasses = classNames(
    `${prefix}--text-input__field-wrapper`,
    {
      [`${prefix}--text-input__field-wrapper--warning`]: normalizedProps.warn,
    }
  );
  const iconClasses = classNames({
    [`${prefix}--text-input__invalid-icon`]:
      normalizedProps.invalid || normalizedProps.warn,
    [`${prefix}--text-input__invalid-icon--warning`]: normalizedProps.warn,
  });

  const label = labelText ? (
    <label htmlFor={id} className={labelClasses}>
      {labelText}
    </label>
  ) : null;
  const helper = helperText ? (
    <div className={helperTextClasses}>{helperText}</div>
  ) : null;

  const passwordIsVisible = inputType === 'text';
  const passwordVisibilityIcon = passwordIsVisible ? (
    <ViewOff16 className={`${prefix}--icon-visibility-off`} />
  ) : (
    <View16 className={`${prefix}--icon-visibility-on`} />
  );
  const passwordVisibilityToggleClasses = classNames(
    `${prefix}--text-input--password__visibility__toggle`,
    `${prefix}--btn`,
    `${prefix}--btn--icon-only`,
    `${prefix}--tooltip__trigger`,
    `${prefix}--tooltip--a11y`,
    {
      [`${prefix}--btn--disabled`]: disabled,
      [`${prefix}--tooltip--${tooltipPosition}`]: tooltipPosition,
      [`${prefix}--tooltip--align-${tooltipAlignment}`]: tooltipAlignment,
    }
  );
  const input = (
    <>
      <input
        {...textInputProps({
          sharedTextInputProps,
          invalid: normalizedProps.invalid,
          invalidId: normalizedProps.invalidId,
          warn: normalizedProps.warn,
          warnId: normalizedProps.warnId,
        })}
        disabled={disabled}
        data-toggle-password-visibility={inputType === 'password'}
      />
      <button
        type="button"
        className={passwordVisibilityToggleClasses}
        disabled={disabled}
        onClick={handleTogglePasswordVisibility}>
        {!disabled && (
          <span className={`${prefix}--assistive-text`}>
            {passwordIsVisible ? hidePasswordLabel : showPasswordLabel}
          </span>
        )}
        {passwordVisibilityIcon}
      </button>
    </>
  );

  const { isFluid } = useContext(FormContext);

  useEffect(() => {
    setInputType(type);
  }, [type]);

  return (
    <div className={inputWrapperClasses}>
      {!inline ? (
        label
      ) : (
        <div className={`${prefix}--text-input__label-helper-wrapper`}>
          {label}
          {!isFluid && helper}
        </div>
      )}
      <div className={fieldOuterWrapperClasses}>
        <div
          className={fieldWrapperClasses}
          data-invalid={normalizedProps.invalid || null}>
          {normalizedProps.icon && (
            <normalizedProps.icon className={iconClasses} />
          )}
          {input}
          {isFluid && !inline && normalizedProps.validation}
        </div>
        {!isFluid && !inline && (normalizedProps.validation || helper)}
      </div>
    </div>
  );
});

PasswordInput.propTypes = {
  /**
   * Provide a custom className that is applied directly to the underlying
   * `<input>` node
   */
  className: PropTypes.string,

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify whether or not the underlying label is visually hidden
   */
  hideLabel: PropTypes.bool,

  /**
   * "Hide password" tooltip text on password visibility toggle
   */
  hidePasswordLabel: PropTypes.string,

  /**
   * Provide a unique identifier for the input field
   */
  id: PropTypes.string.isRequired,

  /**
   * `true` to use the inline version.
   */
  inline: PropTypes.bool,

  /**
   * Specify whether the control is currently invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText: PropTypes.node,

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Specify light version or default version of this control
   */
  light: PropTypes.bool,

  /**
   * Optionally provide an `onChange` handler that is called whenever `<input>`
   * is updated
   */
  onChange: PropTypes.func,

  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * `<input>` is clicked
   */
  onClick: PropTypes.func,

  /**
   * Callback function that is called whenever the toggle password visibility
   * button is clicked
   */
  onTogglePasswordVisibility: PropTypes.func,

  /**
   * Specify the placeholder attribute for the `<input>`
   */
  placeholder: PropTypes.string,

  /**
   * "Show password" tooltip text on password visibility toggle
   */
  showPasswordLabel: PropTypes.string,

  /**
   * Specify the size of the Text Input. Currently supports either `small` or `large` as an option. If omitted, defaults to standard size
   */
  size: PropTypes.string,

  /**
   * Specify the alignment of the tooltip to the icon-only button.
   * Can be one of: start, center, or end.
   */
  tooltipAlignment: PropTypes.oneOf(['start', 'center', 'end']),

  /**
   * Specify the direction of the tooltip for icon-only buttons.
   * Can be either top, right, bottom, or left.
   */
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

  /**
   * The input type, either password or text
   */
  type: PropTypes.oneOf(['password', 'text']),

  /**
   * Provide the current value of the `<input>`
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText: PropTypes.node,
};

PasswordInput.defaultProps = {
  className: '${prefix}--text__input',
  disabled: false,
  onChange: () => {},
  onClick: () => {},
  invalid: false,
  invalidText: '',
  helperText: '',
  light: false,
  size: '',
};

export default PasswordInput;
