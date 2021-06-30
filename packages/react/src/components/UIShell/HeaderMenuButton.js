/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Close, Menu } from '@carbon/icons-react/next';

import { settings } from 'carbon-components';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { AriaLabelPropType } from '../../prop-types/AriaPropTypes';

const { prefix } = settings;

const HeaderMenuButton = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className: customClassName,
  renderMenuIcon,
  renderCloseIcon,
  onClick,
  isActive,
  isCollapsible,
  ...rest
}) => {
  const className = cx({
    [customClassName]: !!customClassName,
    [`${prefix}--header__action`]: true,
    [`${prefix}--header__menu-trigger`]: true,
    [`${prefix}--header__action--active`]: isActive,
    [`${prefix}--header__menu-toggle`]: true,
    [`${prefix}--header__menu-toggle__hidden`]: !isCollapsible,
  });
  const accessibilityLabel = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  };
  const menuIcon = renderMenuIcon ? renderMenuIcon : <Menu size={20} />;
  const closeIcon = renderCloseIcon ? renderCloseIcon : <Close size={20} />;

  return (
    <button
      {...rest}
      {...accessibilityLabel}
      className={className}
      title={ariaLabel}
      type="button"
      onClick={onClick}>
      {isActive ? closeIcon : menuIcon}
    </button>
  );
};

HeaderMenuButton.propTypes = {
  /**
   * Required props for accessibility label on the underlying menu button
   */
  ...AriaLabelPropType,

  /**
   * Optionally provide a custom class name that is applied to the underlying
   * button
   */
  className: PropTypes.string,

  isActive: PropTypes.bool,

  /**
   * Optionally provide an onClick handler that is called when the underlying
   * button fires it's onclick event
   */
  onClick: PropTypes.func,
};

export default HeaderMenuButton;
