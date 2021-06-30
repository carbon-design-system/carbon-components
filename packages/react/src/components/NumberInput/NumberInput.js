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
  Add,
  Subtract,
  WarningFilled,
  WarningAltFilled,
} from '@carbon/icons-react/next';
import mergeRefs from '../../tools/mergeRefs';
import requiredIfValueExists from '../../prop-types/requiredIfValueExists';
import { useControlledStateWithValue } from '../../internal/FeatureFlags';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;

export const translationIds = {
  'increment.number': 'increment.number',
  'decrement.number': 'decrement.number',
};

const defaultTranslations = {
  [translationIds['increment.number']]: 'Increment number',
  [translationIds['decrement.number']]: 'Decrement number',
};

const capMin = (min, value) =>
  isNaN(min) || (!min && min !== 0) || isNaN(value) || (!value && value !== 0)
    ? value
    : Math.max(min, value);
const capMax = (max, value) =>
  isNaN(max) || (!max && max !== 0) || isNaN(value) || (!value && value !== 0)
    ? value
    : Math.min(max, value);

class NumberInput extends Component {
  static propTypes = {
    /**
     * `true` to allow empty string.
     */
    allowEmpty: PropTypes.bool,

    /**
     * Provide a description that would be used to best describe the use case of the NumberInput component
     */
    ariaLabel: PropTypes.string,

    /**
     * Specify an optional className to be applied to the wrapper node
     */
    className: PropTypes.string,

    /**
     * Optional starting value for uncontrolled state
     */
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * Specify if the control should be disabled, or not
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
     * Specify whether you want the steppers to be hidden
     */
    hideSteppers: PropTypes.bool,

    /**
     * Provide a description for up/down icons that can be read by screen readers
     */
    iconDescription: PropTypes.string.isRequired,

    /**
     * Specify a custom `id` for the input
     */
    id: PropTypes.string.isRequired,

    /**
     * Specify if the currently value is invalid.
     */
    invalid: PropTypes.bool,

    /**
     * Message which is displayed if the value is invalid.
     */
    invalidText: PropTypes.node,

    /**
     * `true` to use the mobile variant.
     */
    isMobile: deprecate(
      PropTypes.bool,
      `The \`isMobile\` prop no longer needed as the default NumberInput styles are now identical to the mobile variant styles. This prop will be removed in the next major version of \`carbon-components-react\``
    ),

    /**
     * Generic `label` that will be used as the textual representation of what
     * this field is for
     */
    label: PropTypes.node,

    /**
     * `true` to use the light version.
     */
    light: PropTypes.bool,

    /**
     * The maximum value.
     */
    max: PropTypes.number,

    /**
     * The minimum value.
     */
    min: PropTypes.number,

    /**
     * The new value is available in 'imaginaryTarget.value'
     * i.e. to get the value: evt.imaginaryTarget.value
     *
     * * _With_ `useControlledStateWithValue` feature flag, the signature of the event handler will be altered to provide additional context in the second parameter: `onChange(event, { value, direction })` where:
     *   * `event` is the (React) raw event
     *   * `value` is the new value
     *   * `direction` tells you the button you hit is up button or down button
     * * _Without_ this feature flag the event handler has `onChange(event, direction)` signature.
     */
    onChange: !useControlledStateWithValue
      ? PropTypes.func
      : requiredIfValueExists(PropTypes.func),

    /**
     * Provide an optional function to be called when the up/down button is clicked
     */
    onClick: PropTypes.func,

    /**
     * Specify if the component should be read-only
     */
    readOnly: PropTypes.bool,

    /**
     * Specify the size of the Number Input. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
     * TODO V11: remove `xl` (replaced with lg)
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),

    /**
     * Specify how much the valus should increase/decrease upon clicking on up/down button
     */
    step: PropTypes.number,

    /**
     * Provide custom text for the component for each translation id
     */
    translateWithId: PropTypes.func.isRequired,

    /**
     * Specify the value of the input
     */
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

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
    disabled: false,
    hideLabel: false,
    iconDescription: 'choose a number',
    step: 1,
    invalid: false,
    invalidText: 'Provide invalidText',
    warn: false,
    warnText: '',
    ariaLabel: 'Numeric input field with increment and decrement buttons',
    helperText: '',
    light: false,
    allowEmpty: false,
    translateWithId: (id) => defaultTranslations[id],
  };

  static getDerivedStateFromProps({ min, max, value }, state) {
    const { prevValue } = state;

    if (useControlledStateWithValue && value === '' && prevValue !== '') {
      return {
        value: '',
        prevValue: '',
      };
    }

    // If `useControlledStateWithValue` feature flag is on, do nothing here.
    // Otherwise, do prop -> state sync with "value capping".
    return useControlledStateWithValue || prevValue === value
      ? null
      : {
          value: capMax(max, capMin(min, value)),
          prevValue: value,
        };
  }

  /**
   * The DOM node reference to the `<input>`.
   * @type {HTMLInputElement}
   */
  _inputRef = null;

  constructor(props) {
    super(props);
    this.isControlled = props.value !== undefined;
    if (useControlledStateWithValue && this.isControlled) {
      // Skips the logic of setting initial state if this component is controlled
      this.state = {};
      return;
    }
    let value =
      useControlledStateWithValue || typeof props.defaultValue !== 'undefined'
        ? props.defaultValue
        : props.value;
    value = value === undefined ? 0 : value;
    if (props.min || props.min === 0) {
      value = Math.max(props.min, value);
    }
    this.state = { value };
  }

  handleChange = (evt) => {
    const { disabled, onChange } = this.props;
    if (!disabled) {
      evt.persist();
      evt.imaginaryTarget = this._inputRef;
      const prevValue = this.state.value;
      const value = evt.target.value;
      const direction = prevValue < value ? 'up' : 'down';
      this.setState(
        {
          value,
        },
        () => {
          if (useControlledStateWithValue) {
            onChange(evt, { value, direction });
          } else if (onChange) {
            onChange(evt, { value, direction });
          }
        }
      );
    }
  };

  handleArrowClick = (evt, direction) => {
    let value =
      typeof this.state.value === 'string'
        ? Number(this.state.value)
        : this.state.value;
    const { disabled, min, max, step, onChange, onClick } = this.props;
    const conditional =
      direction === 'down'
        ? (min !== undefined && value > min) || min === undefined
        : (max !== undefined && value < max) || max === undefined;

    if (!disabled && conditional) {
      value = direction === 'down' ? value - step : value + step;
      value = capMax(max, capMin(min, value));
      evt.persist();
      evt.imaginaryTarget = this._inputRef;
      this.setState(
        {
          value,
        },
        () => {
          //TO-DO v11: update these events to return the same things --> evt, {value, direction}
          if (useControlledStateWithValue) {
            onClick && onClick(evt, { value, direction });
            onChange && onChange(evt, { value, direction });
          } else {
            // value added as a 3rd argument rather than in same obj so it doesn't break in v10
            onClick && onClick(evt, direction, value);
            onChange && onChange(evt, direction, value);
          }
        }
      );
    }
  };

  /**
   * Preserves the DOM node ref of `<input>`.
   * @param {HTMLInputElement} ref The DOM node ref of `<input>`.
   */
  _handleInputRef = (ref) => {
    this._inputRef = ref;
  };

  render() {
    const {
      className,
      disabled,
      iconDescription, // eslint-disable-line
      id,
      hideLabel,
      hideSteppers,
      label,
      max,
      min,
      step,
      value,
      readOnly,
      invalid,
      invalidText,
      warn,
      warnText,
      helperText,
      ariaLabel,
      light,
      allowEmpty,
      // eslint-disable-next-line react/prop-types
      innerRef: ref,
      translateWithId: t,
      isMobile,
      size,
      defaultValue, // eslint-disable-line
      ...other
    } = this.props;

    const numberInputClasses = classNames(
      `${prefix}--number ${prefix}--number--helpertext`,
      className,
      {
        [`${prefix}--number--readonly`]: readOnly,
        [`${prefix}--number--light`]: light,
        [`${prefix}--number--nolabel`]: hideLabel,
        [`${prefix}--number--nosteppers`]: hideSteppers,
        [`${prefix}--number--mobile`]: isMobile,
        [`${prefix}--number--${size}`]: size,
      }
    );

    const props = {
      disabled,
      id,
      max,
      min,
      step,
      onChange: this.handleChange,
      value:
        useControlledStateWithValue && this.isControlled
          ? value
          : this.state.value,
      readOnly,
      'aria-label': label ? null : ariaLabel,
    };

    const buttonProps = {
      disabled,
    };

    const inputWrapperProps = {};
    let errorId = null;
    let error = null;

    let isInputInvalid;

    // If the user supplied `invalid` through props, we'll defer to the passed in value
    if (invalid) {
      isInputInvalid = true;
    } else {
      // Otherwise, if we don't allow an empty value then we check to see
      // if the value is empty, or if it is out of range
      if (!allowEmpty && this.state.value === '') {
        isInputInvalid = true;
      } else {
        if (
          this.state.value !== '' &&
          (this.state.value > max || this.state.value < min)
        ) {
          isInputInvalid = true;
        }
      }
    }

    if (isInputInvalid) {
      inputWrapperProps['data-invalid'] = true;
      errorId = `${id}-error-id`;
      error = (
        <div className={`${prefix}--form-requirement`} id={errorId}>
          {invalidText}
        </div>
      );
    } else if (warn) {
      errorId = `${id}-error-id`;
      error = (
        <div className={`${prefix}--form-requirement`} id={errorId}>
          {warnText}
        </div>
      );
    }

    const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
      [`${prefix}--form__helper-text--disabled`]: disabled,
    });

    const helper = helperText ? (
      <div className={helperTextClasses}>{helperText}</div>
    ) : null;

    const labelClasses = classNames(`${prefix}--label`, {
      [`${prefix}--label--disabled`]: disabled,
      [`${prefix}--visually-hidden`]: hideLabel,
    });

    const labelText = label ? (
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
    ) : null;

    const [incrementNumLabel, decrementNumLabel] = [
      t('increment.number'),
      t('decrement.number'),
    ];

    const wrapperClasses = classNames(`${prefix}--number__input-wrapper`, {
      [`${prefix}--number__input-wrapper--warning`]: !isInputInvalid && warn,
    });

    return (
      <div className={`${prefix}--form-item`}>
        <div className={numberInputClasses} {...inputWrapperProps}>
          {(() => {
            return (
              <>
                {labelText}
                <div className={wrapperClasses}>
                  <input
                    data-invalid={isInputInvalid}
                    aria-invalid={isInputInvalid}
                    aria-describedby={errorId}
                    type="number"
                    pattern="[0-9]*"
                    {...other}
                    {...props}
                    ref={mergeRefs(ref, this._handleInputRef)}
                  />
                  {isInputInvalid && (
                    <WarningFilled className={`${prefix}--number__invalid`} />
                  )}
                  {!isInputInvalid && warn && (
                    <WarningAltFilled
                      className={`${prefix}--number__invalid ${prefix}--number__invalid--warning`}
                    />
                  )}
                  {!hideSteppers && (
                    <div className={`${prefix}--number__controls`}>
                      <button
                        type="button"
                        className={`${prefix}--number__control-btn down-icon`}
                        {...buttonProps}
                        onClick={(evt) => this.handleArrowClick(evt, 'down')}
                        title={decrementNumLabel || iconDescription}
                        aria-label={decrementNumLabel || iconDescription}
                        tabIndex="-1">
                        <Subtract className="down-icon" />
                      </button>
                      <div className={`${prefix}--number__rule-divider`}></div>
                      <button
                        type="button"
                        className={`${prefix}--number__control-btn up-icon`}
                        {...buttonProps}
                        onClick={(evt) => this.handleArrowClick(evt, 'up')}
                        title={incrementNumLabel || iconDescription}
                        aria-label={incrementNumLabel || iconDescription}
                        tabIndex="-1">
                        <Add className="up-icon" />
                      </button>
                      <div className={`${prefix}--number__rule-divider`}></div>
                    </div>
                  )}
                </div>
                {error ? null : helper}
              </>
            );
          })()}
          {error}
        </div>
      </div>
    );
  }
}

export { NumberInput };
export default (() => {
  const forwardRef = (props, ref) => <NumberInput {...props} innerRef={ref} />;
  forwardRef.displayName = 'NumberInput';
  return React.forwardRef(forwardRef);
})();
