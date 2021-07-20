/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { warning } from '../../internal/warning';
import uid from '../../tools/uniqueId';
import { Text } from '../Text';

const { prefix } = settings;

class RadioButton extends React.Component {
  static propTypes = {
    /**
     * Specify whether the <RadioButton> is currently checked
     */
    checked: PropTypes.bool,

    /**
     * Provide an optional className to be applied to the containing node
     */
    className: PropTypes.string,

    /**
     * Specify whether the <RadioButton> should be checked by default
     */
    defaultChecked: PropTypes.bool,

    /**
     * Specify whether the control is disabled
     */
    disabled: PropTypes.bool,

    /**
     * Specify whether the label should be hidden, or not
     */
    hideLabel: PropTypes.bool,

    /**
     * Provide a unique id for the underlying `<input>` node
     */
    id: PropTypes.string,

    /**
     * Provide where label text should be placed
     * NOTE: `top`/`bottom` are deprecated
     */
    labelPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

    /**
     * Provide label text to be read by screen readers when interacting with the
     * control
     */
    labelText: PropTypes.node.isRequired,

    /**
     * Provide a name for the underlying `<input>` node
     */
    name: PropTypes.string,

    /**
     * Provide an optional `onChange` hook that is called each time the value of
     * the underlying `<input>` changes
     */
    onChange: PropTypes.func,

    /**
     * Provide a handler that is invoked when a user clicks on the control
     */
    onClick: PropTypes.func,

    /**
     * Specify the value of the <RadioButton>
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  static defaultProps = {
    labelText: '',
    labelPosition: 'right',
    onChange: () => {},
    value: '',
  };

  uid = this.props.id || uid();

  handleChange = (evt) => {
    this.props.onChange(this.props.value, this.props.name, evt);
  };

  render() {
    const {
      className,
      labelText,
      labelPosition,
      // eslint-disable-next-line react/prop-types
      innerRef: ref,
      hideLabel,
      ...other
    } = this.props;
    if (__DEV__) {
      warning(
        labelPosition !== 'top' && labelPosition !== 'bottom',
        '`top`/`bottom` values for `labelPosition` property in the `RadioButton` component is deprecated ' +
          'and being removed in the next release of `carbon-components-react`.'
      );
    }
    const innerLabelClasses = classNames({
      [`${prefix}--visually-hidden`]: hideLabel,
    });
    const wrapperClasses = classNames(
      className,
      `${prefix}--radio-button-wrapper`,
      {
        [`${prefix}--radio-button-wrapper--label-${labelPosition}`]:
          labelPosition !== 'right',
      }
    );
    return (
      <div className={wrapperClasses}>
        <input
          {...other}
          type="radio"
          className={`${prefix}--radio-button`}
          onChange={this.handleChange}
          id={this.uid}
          ref={ref}
        />
        <label htmlFor={this.uid} className={`${prefix}--radio-button__label`}>
          <span className={`${prefix}--radio-button__appearance`} />
          {labelText && <Text className={innerLabelClasses}>{labelText}</Text>}
        </label>
      </div>
    );
  }
}

export { RadioButton };
export default (() => {
  const forwardRef = (props, ref) => <RadioButton {...props} innerRef={ref} />;
  forwardRef.displayName = 'RadioButton';
  return React.forwardRef(forwardRef);
})();
