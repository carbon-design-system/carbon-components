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
import setupGetInstanceId from '../../tools/setupGetInstanceId';
import { keys, match } from '../../internal/keyboard';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();

class Toggle extends React.Component {
  static propTypes = {
    /**
     * Specify a custom className to apply to the form-item node
     */
    className: PropTypes.string,

    /**
     * Specify whether the toggle should be on by default
     */
    defaultToggled: PropTypes.bool,

    /**
     * Provide an id that unique represents the underlying `<input>`
     */
    id: PropTypes.string.isRequired,

    /**
     * Specify the label for the "off" position
     */
    labelA: PropTypes.node.isRequired,

    /**
     * Specify the label for the "on" position
     */
    labelB: PropTypes.node.isRequired,

    /**
     * Provide the text that will be read by a screen reader when visiting this
     * control
     */
    labelText: PropTypes.node,
    /**
     * Provide an optional hook that is called when the control is changed
     */
    onChange: PropTypes.func,

    /**
     * Provide an optional hook that is called when the control is toggled
     */
    onToggle: PropTypes.func,

    /**
     * Specify the size of the Toggle. Currently only supports 'sm' or 'md' (default)
     */
    size: PropTypes.oneOf(['sm', 'md']),

    /**
     * Specify whether the control is toggled
     */
    toggled: PropTypes.bool,
  };

  static defaultProps = {
    defaultToggled: false,
    labelA: 'Off',
    labelB: 'On',
    onToggle: () => {},
  };

  render() {
    const {
      className,
      defaultToggled,
      toggled,
      onChange,
      onToggle,
      id = (this.inputId =
        this.inputId || `__carbon-toggle_${getInstanceId()}`),
      labelText,
      labelA,
      labelB,
      size,
      ...other
    } = this.props;

    let input;
    const wrapperClasses = classNames(`${prefix}--form-item`, {
      [className]: className,
    });

    const toggleClasses = classNames(`${prefix}--toggle-input`, {
      [`${prefix}--toggle-input--small`]: size,
    });

    const checkedProps = {};

    if (typeof toggled !== 'undefined') {
      checkedProps.checked = toggled;
    } else {
      checkedProps.defaultChecked = defaultToggled;
    }

    return (
      <div className={wrapperClasses}>
        <input
          {...other}
          {...checkedProps}
          aria-labelledby={id}
          type="checkbox"
          id={id}
          className={toggleClasses}
          onChange={(evt) => {
            onChange && onChange(evt);
            onToggle(input.checked, id, evt);
          }}
          ref={(el) => {
            input = el;
          }}
          onKeyUp={(evt) => {
            if (match(evt, keys.Enter)) {
              input.checked = !input.checked;
              onChange && onChange(evt);
              onToggle(input.checked, id, evt);
            }
          }}
        />
        <label className={`${prefix}--toggle-input__label`} htmlFor={id}>
          {labelText}
          <span className={`${prefix}--toggle__switch`}>
            {size && (
              <svg
                className={`${prefix}--toggle__check`}
                width="6px"
                height="5px"
                viewBox="0 0 6 5">
                <path d="M2.2 2.7L5 0 6 1 2.2 5 0 2.7 1 1.5z" />
              </svg>
            )}
            <span
              className={`${prefix}--toggle__text--off`}
              aria-labelledby={id}>
              {labelA}
            </span>
            <span
              className={`${prefix}--toggle__text--on`}
              aria-labelledby={id}>
              {labelB}
            </span>
          </span>
        </label>
      </div>
    );
  }
}

export default Toggle;
