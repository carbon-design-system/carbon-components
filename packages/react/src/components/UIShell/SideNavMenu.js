/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ChevronDown } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import SideNavIcon from './SideNavIcon';
import { keys, match } from '../../internal/keyboard';

const { prefix } = settings;

export class SideNavMenu extends React.Component {
  static propTypes = {
    buttonRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        current: PropTypes.any,
      }),
    ]),

    /**
     * Provide <SideNavMenuItem>'s inside of the `SideNavMenu`
     */
    children: PropTypes.node,

    /**
     * Provide an optional class to be applied to the containing node
     */
    className: PropTypes.string,

    /**
     * Specify whether the menu should default to expanded. By default, it will
     * be closed.
     */
    defaultExpanded: PropTypes.bool,

    /**
     * Specify whether the `SideNavMenu` is "active". `SideNavMenu` should be
     * considered active if one of its menu items are a link for the current
     * page.
     */
    isActive: PropTypes.bool,

    /**
     * Property to indicate if the side nav container is open (or not). Use to
     * keep local state and styling in step with the SideNav expansion state.
     */
    isSideNavExpanded: PropTypes.bool,

    /**
     * Specify if this is a large variation of the SideNavMenu
     */
    large: PropTypes.bool,

    /**
     * Pass in a custom icon to render next to the `SideNavMenu` title
     */
    renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    /**
     * Provide the text for the overall menu name
     */
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    defaultExpanded: false,
    isActive: false,
    large: false,
  };

  static getDerivedStateFromProps = (props, state) => {
    let derivedState = null;

    if (props.isSideNavExpanded === false && state.isExpanded === true) {
      derivedState = {
        isExpanded: props.isSideNavExpanded,
        wasPreviouslyExpanded: true,
      };
    } else if (
      props.isSideNavExpanded === true &&
      state.wasPreviouslyExpanded === true
    ) {
      derivedState = {
        isExpanded: props.isSideNavExpanded,
        wasPreviouslyExpanded: false,
      };
    }

    return derivedState;
  };

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: props.defaultExpanded || false,
      wasPreviouslyExpanded: props.defaultExpanded || false,
    };
  }

  handleToggleExpand = () => {
    this.setState((state) => ({ isExpanded: !state.isExpanded }));
  };

  handleKeyDown = (event) => {
    if (match(event, keys.Escape)) {
      this.setState(() => ({ isExpanded: false }));
    }
  };

  render() {
    const {
      buttonRef,
      className: customClassName,
      children,
      renderIcon: IconElement,
      isActive,
      title,
      large,
    } = this.props;
    const { isExpanded } = this.state;

    let hasActiveChild;
    if (children) {
      // if we have children, either a single or multiple, find if it is active
      hasActiveChild = Array.isArray(children)
        ? children.some((child) => {
            if (
              child.props &&
              (child.props.isActive === true || child.props['aria-current'])
            ) {
              return true;
            }
            return false;
          })
        : children.props &&
          (children.props.isActive === true || children.props['aria-current']);
    }

    const className = cx({
      [`${prefix}--side-nav__item`]: true,
      [`${prefix}--side-nav__item--active`]:
        isActive || (hasActiveChild && !isExpanded),
      [`${prefix}--side-nav__item--icon`]: IconElement,
      [`${prefix}--side-nav__item--large`]: large,
      [customClassName]: !!customClassName,
    });
    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li className={className} onKeyDown={this.handleKeyDown}>
        <button
          aria-expanded={isExpanded}
          className={`${prefix}--side-nav__submenu`}
          onClick={this.handleToggleExpand}
          ref={buttonRef}
          type="button">
          {IconElement && (
            <SideNavIcon>
              <IconElement />
            </SideNavIcon>
          )}
          <span className={`${prefix}--side-nav__submenu-title`}>{title}</span>
          <SideNavIcon className={`${prefix}--side-nav__submenu-chevron`} small>
            <ChevronDown size={20} />
          </SideNavIcon>
        </button>
        <ul className={`${prefix}--side-nav__menu`}>{children}</ul>
      </li>
    );
  }
}

const SideNavMenuForwardRef = React.forwardRef((props, ref) => {
  return <SideNavMenu {...props} buttonRef={ref} />;
});

SideNavMenuForwardRef.displayName = 'SideNavMenu';
export default SideNavMenuForwardRef;
