/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import throttle from 'lodash.throttle';

import * as keys from '../../internal/keyboard/keys';
import { matches } from '../../internal/keyboard/match';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;

const defaultFormatLabel = (value, label) => {
  return typeof label === 'function' ? label(value) : `${value}${label}`;
};

/**
 * Minimum time between processed "drag" events.
 */
const EVENT_THROTTLE = 16; // ms

/**
 * Event types that trigger "drags".
 */
const DRAG_EVENT_TYPES = new Set(['mousemove', 'touchmove']);

/**
 * Event types that trigger a "drag" to stop.
 */
const DRAG_STOP_EVENT_TYPES = new Set(['mouseup', 'touchend', 'touchcancel']);

export default class Slider extends PureComponent {
  static propTypes = {
    /**
     * The `ariaLabel` for the `<input>`.
     */
    ariaLabelInput: PropTypes.string,

    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class name for the slider.
     */
    className: PropTypes.string,

    /**
     * `true` to disable this slider.
     */
    disabled: PropTypes.bool,

    /**
     * The callback to format the label associated with the minimum/maximum value.
     */
    formatLabel: PropTypes.func,

    /**
     * `true` to hide the number input box.
     */
    hideTextInput: PropTypes.bool,

    /**
     * The ID of the `<input>`.
     */
    id: PropTypes.string,

    /**
     * The `type` attribute of the `<input>`.
     */
    inputType: PropTypes.string,

    /**
     * `true` to specify if the control is invalid.
     */
    invalid: PropTypes.bool,

    /**
     * The label for the slider.
     */
    labelText: PropTypes.node,

    /**
     * `true` to use the light version.
     */
    light: PropTypes.bool,

    /**
     * The maximum value.
     */
    max: PropTypes.number.isRequired,

    /**
     * The label associated with the maximum value.
     */
    maxLabel: PropTypes.string,

    /**
     * The minimum value.
     */
    min: PropTypes.number.isRequired,

    /**
     * The label associated with the minimum value.
     */
    minLabel: PropTypes.string,

    /**
     * The `name` attribute of the `<input>`.
     */
    name: PropTypes.string,

    /**
     * The callback to get notified of change in value.
     */
    onChange: PropTypes.func,

    /**
     * The callback to get notified of value on handle release.
     */
    onRelease: PropTypes.func,

    /**
     * `true` to specify if the control is required.
     */
    required: PropTypes.bool,

    /**
     * A value determining how much the value should increase/decrease by moving the thumb by mouse.
     */
    step: PropTypes.number,

    /**
     * A value determining how much the value should increase/decrease by Shift+arrow keys,
     * which will be `(max - min) / stepMuliplier`.
     */
    stepMuliplier: deprecate(
      PropTypes.number,
      ' The `stepMuliplier` prop has been deprecated in favor of `stepMultiplier`. It will be removed in the next major release.'
    ),

    /**
     * A value determining how much the value should increase/decrease by Shift+arrow keys,
     * which will be `(max - min) / stepMultiplier`.
     */
    stepMultiplier: PropTypes.number,

    /**
     * The value.
     */
    value: PropTypes.number.isRequired,
  };

  static defaultProps = {
    hideTextInput: false,
    step: 1,
    stepMultiplier: 4,
    disabled: false,
    minLabel: '',
    maxLabel: '',
    inputType: 'number',
    ariaLabelInput: 'Slider number input',
    light: false,
  };

  state = {
    value: this.props.value,
    left: 0,
    needsOnRelease: false,
  };

  /**
   * Sets up initial slider position and value in response to component mount.
   */
  componentDidMount() {
    if (this.element) {
      const { value, left } = this.calcValue({
        useRawValue: true,
      });
      this.setState({ value, left });
    }
  }

  /**
   * Handles firing of `onChange` and `onRelease` callbacks to parent in
   * response to state changes.
   *
   * @param {*} prevProps prevProps
   * @param {*} prevState The previous Slider state, used to see if callbacks
   * should be called.
   */
  componentDidUpdate(prevProps, prevState) {
    // Fire onChange event handler if present, if there's a usable value, and
    // if the value is different from the last one
    if (
      this.state.value !== '' &&
      prevState.value !== this.state.value &&
      typeof this.props.onChange === 'function'
    ) {
      // TODO: pass event object as first param (breaking change/feat for v11)
      this.props.onChange({ value: this.state.value });
    }

    // Fire onRelease event handler if present and if needed
    if (
      this.state.needsOnRelease &&
      typeof this.props.onRelease === 'function'
    ) {
      // TODO: pass event object as first param (breaking change/feat for v11)
      this.props.onRelease({ value: this.state.value });
      // Reset the flag
      this.setState({ needsOnRelease: false });
    }

    // If value from props does not change, do nothing here.
    // Otherwise, do prop -> state sync without "value capping".
    if (
      prevProps.value === this.props.value &&
      prevProps.max === this.props.max &&
      prevProps.min === this.props.min
    ) {
      return;
    }
    this.setState(
      this.calcValue({
        value: this.props.value,
        useRawValue: true,
      })
    );
  }

  /**
   * Synonymous to ECMA2017+ `Math.clamp`.
   *
   * @param {number} val
   * @param {number} min
   * @param {number} max
   *
   * @returns `val` if `max>=val>=min`; `min` if `val<min`; `max` if `val>max`.
   */
  clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }

  /**
   * Sets up "drag" event handlers and calls `this.onDrag` in case dragging
   * started on somewhere other than the thumb without a corresponding "move"
   * event.
   *
   * @param {Event} evt The event.
   */
  onDragStart = (evt) => {
    // Do nothing if component is disabled
    if (this.props.disabled) {
      return;
    }

    // Register drag stop handlers
    DRAG_STOP_EVENT_TYPES.forEach((element) => {
      this.element.ownerDocument.addEventListener(element, this.onDragStop);
    });

    // Register drag handlers
    DRAG_EVENT_TYPES.forEach((element) => {
      this.element.ownerDocument.addEventListener(element, this.onDrag);
    });

    // Perform first recalculation since we probably didn't click exactly in the
    // middle of the thumb
    this.onDrag(evt);
  };

  /**
   * Unregisters "drag" and "drag stop" event handlers and calls sets the flag
   * inidicating that the `onRelease` callback should be called.
   */
  onDragStop = () => {
    // Do nothing if component is disabled
    if (this.props.disabled) {
      return;
    }

    // Remove drag stop handlers
    DRAG_STOP_EVENT_TYPES.forEach((element) => {
      this.element.ownerDocument.removeEventListener(element, this.onDragStop);
    });

    // Remove drag handlers
    DRAG_EVENT_TYPES.forEach((element) => {
      this.element.ownerDocument.removeEventListener(element, this.onDrag);
    });

    // Set needsOnRelease flag so event fires on next update
    this.setState({ needsOnRelease: true });
  };

  /**
   * Handles a "drag" event by recalculating the value/thumb and setting state
   * accordingly.
   *
   * @param {Event} evt The event.
   */
  _onDrag = (evt) => {
    // Do nothing if component is disabled or we have no event
    if (this.props.disabled || !evt) {
      return;
    }

    let clientX;
    if ('clientX' in evt) {
      clientX = evt.clientX;
    } else if (
      'touches' in evt &&
      0 in evt.touches &&
      'clientX' in evt.touches[0]
    ) {
      clientX = evt.touches[0].clientX;
    } else {
      // Do nothing if we have no valid clientX
      return;
    }

    const { value, left } = this.calcValue({ clientX });
    this.setState({ value, left });
  };

  /**
   * Throttles calls to `this._onDrag` by limiting events to being processed at
   * most once every `EVENT_THROTTLE` milliseconds.
   */
  onDrag = throttle(this._onDrag, EVENT_THROTTLE, {
    leading: true,
    trailing: false,
  });

  /**
   * Handles a `keydown` event by recalculating the value/thumb and setting
   * state accordingly.
   *
   * @param {Event} evt The event.
   */
  onKeyDown = (evt) => {
    // Do nothing if component is disabled or we don't have a valid event
    if (this.props.disabled || !('which' in evt)) {
      return;
    }

    const which = Number.parseInt(evt.which);
    let delta = 0;
    if (matches(which, [keys.ArrowDown, keys.ArrowLeft])) {
      delta = -this.props.step;
    } else if (matches(which, [keys.ArrowUp, keys.ArrowRight])) {
      delta = this.props.step;
    } else {
      // Ignore keys we don't want to handle
      return;
    }

    // If shift was held, account for the stepMultiplier
    if (evt.shiftKey) {
      const stepMultiplier =
        this.props.stepMultiplier || this.props.stepMuliplier;
      delta *= stepMultiplier;
    }

    Math.floor(this.state.value / this.props.step) * this.props.step;
    const { value, left } = this.calcValue({
      // Ensures custom value from `<input>` won't cause skipping next stepping point with right arrow key,
      // e.g. Typing 51 in `<input>`, moving focus onto the thumb and the hitting right arrow key should yield 52 instead of 54
      value:
        (delta > 0
          ? Math.floor(this.state.value / this.props.step) * this.props.step
          : this.state.value) + delta,
    });
    this.setState({ value, left });
  };

  /**
   * Provides the two-way binding for the input field of the Slider. It also
   * Handles a change to the input field by recalculating the value/thumb and
   * setting state accordingly.
   *
   * @param {Event} evt The event.
   */
  onChange = (evt) => {
    // Do nothing if component is disabled
    if (this.props.disabled) {
      return;
    }

    // Do nothing if we have no valid event, target, or value
    if (!evt || !('target' in evt) || typeof evt.target.value !== 'string') {
      return;
    }

    let targetValue = Number.parseFloat(evt.target.value);

    // Avoid calling calcValue for invalid numbers, but still update the state
    if (isNaN(targetValue)) {
      this.setState({ value: evt.target.value });
    } else {
      // Recalculate the state's value and update the Slider
      // if it is a valid number
      if (evt.target.checkValidity() === false) {
        return;
      }

      const { value, left } = this.calcValue({
        value: targetValue,
        useRawValue: true,
      });
      this.setState({ value, left, needsOnRelease: true });
    }
  };

  /**
   * Calculates a new Slider `value` and `left` (thumb offset) given a `clientX`,
   * `value`, or neither of those.
   * - If `clientX` is specified, it will be used in
   *   conjunction with the Slider's bounding rectangle to calculate the new
   *   values.
   * - If `clientX` is not specified and `value` is, it will be used to
   *   calculate new values as though it were the current value of the Slider.
   * - If neither `clientX` nor `value` are specified, `this.props.value` will
   *   be used to calculate the new values as though it were the current value
   *   of the Slider.
   *
   * @param {object} params
   * @param {number} [params.clientX] Optional clientX value expected to be from
   *   an event fired by one of the Slider's `DRAG_EVENT_TYPES` events.
   * @param {number} [params.value] Optional value use during calculations if
   *   clientX is not provided.
   * @param {boolean} [params.useRawValue=false] `true` to use the given value as-is.
   */
  calcValue = ({ clientX = null, value = null, useRawValue = false }) => {
    const range = this.props.max - this.props.min;
    const boundingRect = this.element.getBoundingClientRect();
    const totalSteps = range / this.props.step;
    let width = boundingRect.right - boundingRect.left;

    // Enforce a minimum width of at least 1 for calculations
    if (width <= 0) {
      width = 1;
    }

    // If a clientX is specified, use it to calculate the leftPercent. If not,
    // use the provided value or state's value to calculate it instead.
    let leftPercent;
    if (clientX != null) {
      const leftOffset = clientX - boundingRect.left;
      leftPercent = leftOffset / width;
    } else {
      if (value == null) {
        value = this.state.value;
      }
      // prevent NaN calculation if the range is 0
      leftPercent = range === 0 ? 0 : (value - this.props.min) / range;
    }

    if (useRawValue) {
      // Adjusts only for min/max of thumb position
      return {
        value,
        left: Math.min(1, Math.max(0, leftPercent)) * 100,
      };
    }

    let steppedValue = Math.round(leftPercent * totalSteps) * this.props.step;
    let steppedPercent = this.clamp(steppedValue / range, 0, 1);

    steppedValue = this.clamp(
      steppedValue + this.props.min,
      this.props.min,
      this.props.max
    );

    return { value: steppedValue, left: steppedPercent * 100 };
  };

  render() {
    const {
      ariaLabelInput,
      className,
      hideTextInput,
      id = (this.inputId =
        this.inputId ||
        `__carbon-slider_${Math.random().toString(36).substr(2)}`),
      min,
      minLabel,
      max,
      maxLabel,
      formatLabel = defaultFormatLabel,
      labelText,
      step,
      stepMuliplier, // eslint-disable-line no-unused-vars
      stepMultiplier, // eslint-disable-line no-unused-vars
      inputType,
      required,
      disabled,
      name,
      light,
      invalid,
      ...other
    } = this.props;

    delete other.onRelease;

    const { value, left } = this.state;

    const labelId = `${id}-label`;
    const labelClasses = classNames(`${prefix}--label`, {
      [`${prefix}--label--disabled`]: disabled,
    });

    const sliderClasses = classNames(
      `${prefix}--slider`,
      { [`${prefix}--slider--disabled`]: disabled },
      className
    );

    const inputClasses = classNames(
      `${prefix}--text-input`,
      `${prefix}--slider-text-input`,
      {
        [`${prefix}--text-input--light`]: light,
        [`${prefix}--text-input--invalid`]: this.props.invalid,
      }
    );

    const filledTrackStyle = {
      transform: `translate(0%, -50%) scaleX(${left / 100})`,
    };
    const thumbStyle = {
      left: `${left}%`,
    };
    const hiddenInputStyle = {
      display: 'none',
    };

    return (
      <div className={`${prefix}--form-item`}>
        <label htmlFor={id} className={labelClasses} id={labelId}>
          {labelText}
        </label>
        <div className={`${prefix}--slider-container`}>
          <span className={`${prefix}--slider__range-label`}>
            {formatLabel(min, minLabel)}
          </span>
          <div
            className={sliderClasses}
            ref={(node) => {
              this.element = node;
            }}
            onMouseDown={this.onDragStart}
            onTouchStart={this.onDragStart}
            onKeyDown={this.onKeyDown}
            role="presentation"
            tabIndex={-1}
            data-invalid={invalid || null}
            {...other}>
            <div
              className={`${prefix}--slider__thumb`}
              role="slider"
              id={id}
              tabIndex={0}
              aria-labelledby={labelId}
              aria-valuemax={max}
              aria-valuemin={min}
              aria-valuenow={value}
              style={thumbStyle}
            />
            <div
              className={`${prefix}--slider__track`}
              ref={(node) => {
                this.track = node;
              }}
            />
            <div
              className={`${prefix}--slider__filled-track`}
              style={filledTrackStyle}
            />
          </div>
          <span className={`${prefix}--slider__range-label`}>
            {formatLabel(max, maxLabel)}
          </span>
          <input
            type={hideTextInput ? 'hidden' : inputType}
            style={hideTextInput ? hiddenInputStyle : null}
            id={`${id}-input-for-slider`}
            name={name}
            className={inputClasses}
            value={value}
            aria-label={ariaLabelInput}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            onChange={this.onChange}
            data-invalid={invalid || null}
            aria-invalid={invalid || null}
          />
        </div>
      </div>
    );
  }
}
