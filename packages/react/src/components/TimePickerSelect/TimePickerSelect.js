/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { ChevronDown } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;

export default class TimePickerSelect extends Component {
  static propTypes = {
    /**
     * Provide the contents of your TimePickerSelect
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
     * Specify whether the label should be hidden, or not
     */
    hideLabel: deprecate(
      PropTypes.bool,
      'The `hideLabel` prop for `TimePickerSelect` is no longer needed and has ' +
        'been deprecated. It will be removed in the next major release.'
    ),

    /**
     * Provide a description for the twistie icon that can be read by screen readers
     */
    iconDescription: PropTypes.string.isRequired,

    /**
     * Specify a custom `id` for the `<select>`
     */
    id: PropTypes.string.isRequired,

    /**
     * Specify whether you want the inline version of this control
     */
    inline: PropTypes.bool,

    /**
     * Provide label text to be read by screen readers when interacting with the
     * control
     */
    labelText: PropTypes.node.isRequired,
  };

  static defaultProps = {
    disabled: false,
    inline: true,
    iconDescription: 'open list of options',
  };

  render() {
    const {
      id,
      disabled,
      children,
      iconDescription,
      className,
      hideLabel = true,
      labelText,
      inline, // eslint-disable-line
      ...other
    } = this.props;

    const selectClasses = classNames({
      [`${prefix}--select`]: true,
      [`${prefix}--time-picker__select`]: true,
      [className]: className,
    });

    const labelClasses = classNames(`${prefix}--label`, {
      // TODO: set to always be `true` after `hideLabel` is deprecated
      [`${prefix}--visually-hidden`]: hideLabel,
    });

    const label = labelText ? (
      <label htmlFor={id} className={labelClasses}>
        {labelText}
      </label>
    ) : null;

    return (
      <div className={selectClasses}>
        {label}
        <select
          {...other}
          id={id}
          className={`${prefix}--select-input`}
          disabled={disabled}>
          {children}
        </select>
        <ChevronDown
          className={`${prefix}--select__arrow`}
          aria-label={iconDescription}>
          {iconDescription && <title>{iconDescription}</title>}
        </ChevronDown>
      </div>
    );
  }
}
