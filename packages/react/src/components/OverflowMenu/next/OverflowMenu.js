/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { OverflowMenuVertical } from '@carbon/icons-react/next';
import Menu from '../../Menu';

const { prefix } = settings;

function OverflowMenu({
  children,
  renderIcon: IconElement = OverflowMenuVertical,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState([
    [0, 0],
    [0, 0],
  ]);
  const triggerRef = useRef(null);

  function openMenu() {
    if (triggerRef.current) {
      const {
        left,
        top,
        right,
        bottom,
      } = triggerRef.current.getBoundingClientRect();
      setPosition([
        [left, right],
        [top, bottom],
      ]);
    }

    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function handleClick() {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  const triggerClasses = classNames(`${prefix}--overflow-menu`, {
    [`${prefix}--overflow-menu--open`]: open,
  });

  return (
    <>
      <button
        {...rest}
        type="button"
        aria-haspopup
        aria-expanded={open}
        className={triggerClasses}
        onClick={handleClick}
        ref={triggerRef}>
        <IconElement />
      </button>
      <Menu open={open} onClose={closeMenu} x={position[0]} y={position[1]}>
        {children}
      </Menu>
    </>
  );
}

OverflowMenu.propTypes = {
  /**
   * Specify the children of the OverflowMenu
   */
  children: PropTypes.node,

  /**
   * Function called to override icon rendering.
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default OverflowMenu;
