/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { useNormalizedInputProps } from '../../internal/useNormalizedInputProps';
import PasswordInput from './PasswordInput';
import ControlledPasswordInput from './ControlledPasswordInput';
import { textInputProps } from './util';
import { FormContext } from '../FluidForm';

const { prefix } = settings;
const TextInput = React.forwardRef(function TextInput(
  {
    labelText,
    className = `${prefix}--text__input`,
    id,
    placeholder,
    type,
    onChange,
    onClick,
    hideLabel,
    disabled,
    invalid,
    invalidText,
    warn,
    warnText,
    helperText,
    light,
    size,
    inline,
    readOnly,
    ...other
  },
  ref
) {
  const normalizedProps = useNormalizedInputProps({
    id,
    readOnly,
    disabled,
    invalid,
    invalidText,
    warn,
    warnText,
  });

  const textInputClasses = classNames(`${prefix}--text-input`, className, {
    [`${prefix}--text-input--light`]: light,
    [`${prefix}--text-input--invalid`]: normalizedProps.invalid,
    [`${prefix}--text-input--warning`]: normalizedProps.warn,
    [`${prefix}--text-input--${size}`]: size,
  });
  const sharedTextInputProps = {
    id,
    onChange: (evt) => {
      if (!normalizedProps.disabled) {
        onChange(evt);
      }
    },
    onClick: (evt) => {
      if (!normalizedProps.disabled) {
        onClick(evt);
      }
    },
    placeholder,
    type,
    ref,
    className: textInputClasses,
    title: placeholder,
    disabled: normalizedProps.disabled,
    readOnly,
    ...other,
  };
  const inputWrapperClasses = classNames(
    `${prefix}--form-item`,
    `${prefix}--text-input-wrapper`,
    {
      [`${prefix}--text-input-wrapper--readonly`]: readOnly,
      [`${prefix}--text-input-wrapper--light`]: light,
      [`${prefix}--text-input-wrapper--inline`]: inline,
    }
  );
  const labelClasses = classNames(`${prefix}--label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
    [`${prefix}--label--disabled`]: normalizedProps.disabled,
    [`${prefix}--label--inline`]: inline,
    [`${prefix}--label--inline--${size}`]: inline && !!size,
  });
  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: normalizedProps.disabled,
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
    [`${prefix}--text-input__readonly-icon`]: readOnly,
  });

  const label = labelText ? (
    <label htmlFor={id} className={labelClasses}>
      {labelText}
    </label>
  ) : null;
  const helper = helperText ? (
    <div className={helperTextClasses}>{helperText}</div>
  ) : null;

  const input = (
    <input
      {...textInputProps({
        sharedTextInputProps,
        invalid: normalizedProps.invalid,
        invalidId: normalizedProps.invalidId,
        warn: normalizedProps.warn,
        warnId: normalizedProps.warnId,
      })}
    />
  );

  const { isFluid } = useContext(FormContext);

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
          {isFluid && <hr className={`${prefix}--text-input__divider`} />}
          {isFluid && !inline && normalizedProps.validation}
        </div>
        {!isFluid && !inline && (normalizedProps.validation || helper)}
      </div>
    </div>
  );
});

TextInput.PasswordInput = PasswordInput;
TextInput.ControlledPasswordInput = ControlledPasswordInput;
TextInput.propTypes = {
  /**
   * Specify an optional className to be applied to the `<input>` node
   */
  className: PropTypes.string,

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the `<input>` should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify whether you want the underlying label to be visually hidden
   */
  hideLabel: PropTypes.bool,

  /**
   * Specify a custom `id` for the `<input>`
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
   * `true` to use the light version.
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
   * Specify the placeholder attribute for the `<input>`
   */
  placeholder: PropTypes.string,

  /**
   * Whether the input should be read-only
   */
  readOnly: PropTypes.bool,

  /**
   * Specify the size of the Text Input. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
   * TODO V11: remove `xl` (replaced with lg)
   */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),

  /**
   * Specify the type of the `<input>`
   */
  type: PropTypes.string,

  /**
   * Specify the value of the `<input>`
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

TextInput.defaultProps = {
  disabled: false,
  type: 'text',
  onChange: () => {},
  onClick: () => {},
  invalid: false,
  invalidText: '',
  warn: false,
  warnText: '',
  helperText: '',
  light: false,
  inline: false,
};

export default TextInput;
