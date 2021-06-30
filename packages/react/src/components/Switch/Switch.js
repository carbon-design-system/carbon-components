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

const { prefix } = settings;

const Switch = React.forwardRef(function Switch(props, tabRef) {
  const {
    className,
    disabled,
    index,
    name,
    onClick,
    onKeyDown,
    selected,
    text,
    ...other
  } = props;

  const handleClick = (e) => {
    e.preventDefault();
    onClick({ index, name, text });
  };

  const handleKeyDown = (event) => {
    const key = event.key || event.which;

    onKeyDown({ index, name, text, key });
  };

  const classes = classNames(className, `${prefix}--content-switcher-btn`, {
    [`${prefix}--content-switcher--selected`]: selected,
  });

  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className: classes,
    disabled,
  };

  return (
    <button
      type="button"
      ref={tabRef}
      role="tab"
      tabIndex={selected ? '0' : '-1'}
      aria-selected={selected}
      {...other}
      {...commonProps}>
      <span className={`${prefix}--content-switcher__label`} title={text}>
        {text}
      </span>
    </button>
  );
});

Switch.displayName = 'Switch';

Switch.propTypes = {
  /**
   * Specify an optional className to be added to your Switch
   */
  className: PropTypes.string,

  /**
   * Specify whether or not the Switch should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * The index of your Switch in your ContentSwitcher that is used for event handlers.
   * Reserved for usage in ContentSwitcher
   */
  index: PropTypes.number,

  /**
   * Provide the name of your Switch that is used for event handlers
   */
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * A handler that is invoked when a user clicks on the control.
   * Reserved for usage in ContentSwitcher
   */
  onClick: PropTypes.func,

  /**
   * A handler that is invoked on the key down event for the control.
   * Reserved for usage in ContentSwitcher
   */
  onKeyDown: PropTypes.func,

  /**
   * Whether your Switch is selected. Reserved for usage in ContentSwitcher
   */
  selected: PropTypes.bool,

  /**
   * Provide the contents of your Switch
   */
  text: PropTypes.string.isRequired,
};

Switch.defaultProps = {
  selected: false,
  text: 'Provide text',
  onClick: () => {},
  onKeyDown: () => {},
};

export default Switch;
