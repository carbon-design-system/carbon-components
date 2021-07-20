/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { warning } from '../../internal/warning';
import { settings } from 'carbon-components';
import { Text } from '../Text';

const { prefix } = settings;

export default class RadioButtonGroup extends React.Component {
  static propTypes = {
    /**
     * Provide a collection of <RadioButton> components to render in the group
     */
    children: PropTypes.node,

    /**
     * Provide an optional className to be applied to the container node
     */
    className: PropTypes.string,

    /**
     * Specify the <RadioButton> to be selected by default
     */
    defaultSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Specify whether the group is disabled
     */
    disabled: PropTypes.bool,

    /**
     * Provide where label text should be placed
     */
    labelPosition: PropTypes.oneOf(['left', 'right']),

    /**
     * Provide a legend to the RadioButtonGroup input that you are
     * exposing to the user
     */
    legendText: PropTypes.node,

    /**
     * Specify the name of the underlying `<input>` nodes
     */
    name: PropTypes.string.isRequired,

    /**
     * Provide an optional `onChange` hook that is called whenever the value of
     * the group changes
     */
    onChange: PropTypes.func,

    /**
     * Provide where radio buttons should be placed
     */
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),

    /**
     * Specify the value that is currently selected in the group
     */
    valueSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    orientation: 'horizontal',
    labelPosition: 'right',
    onChange: /* istanbul ignore next */ () => {},
  };

  static getDerivedStateFromProps({ valueSelected, defaultSelected }, state) {
    const { prevValueSelected } = state;
    return prevValueSelected === valueSelected
      ? null
      : {
          selected:
            typeof valueSelected !== 'undefined'
              ? valueSelected
              : defaultSelected,
          prevValueSelected: valueSelected,
        };
  }

  state = {
    selected:
      typeof this.props.valueSelected !== 'undefined'
        ? this.props.valueSelected
        : this.props.defaultSelected,
  };

  getRadioButtons = () => {
    const children = React.Children.map(this.props.children, (radioButton) => {
      const { value } = radioButton.props;
      /* istanbul ignore if */
      if (typeof radioButton.props.checked !== 'undefined') {
        warning(
          false,
          `Instead of using the checked property on the RadioButton, set
            the defaultSelected property or valueSelected property on the RadioButtonGroup.`
        );
      }

      return React.cloneElement(radioButton, {
        name: this.props.name,
        key: value,
        value: value,
        onChange: this.handleChange,
        checked: value === this.state.selected,
      });
    });

    return children;
  };

  handleChange = (newSelection, value, evt) => {
    if (newSelection !== this.state.selected) {
      this.setState({ selected: newSelection });
      this.props.onChange(newSelection, this.props.name, evt);
    }
  };

  render() {
    const {
      disabled,
      className,
      orientation,
      labelPosition,
      legendText,
    } = this.props;

    const wrapperClasses = classNames(
      `${prefix}--radio-button-group`,
      className,
      {
        [`${prefix}--radio-button-group--${orientation}`]:
          orientation === 'vertical',
        [`${prefix}--radio-button-group--label-${labelPosition}`]: labelPosition,
      }
    );

    return (
      <div className={`${prefix}--form-item`}>
        <fieldset className={wrapperClasses} disabled={disabled}>
          {legendText && (
            <Text as="legend" className={`${prefix}--label`}>
              {legendText}
            </Text>
          )}
          {this.getRadioButtons()}
        </fieldset>
      </div>
    );
  }
}
