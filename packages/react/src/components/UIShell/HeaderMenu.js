/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ChevronDown } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { keys, matches } from '../../internal/keyboard';
import { AriaLabelPropType } from '../../prop-types/AriaPropTypes';

const { prefix } = settings;

const defaultRenderMenuContent = () => (
  <ChevronDown className={`${prefix}--header__menu-arrow`} />
);

/**
 * `HeaderMenu` is used to render submenu's in the `Header`. Most often children
 * will be a `HeaderMenuItem`. It handles certain keyboard events to help
 * with managing focus. It also passes along refs to each child so that it can
 * help manage focus state of its children.
 */
class HeaderMenu extends React.Component {
  static propTypes = {
    /**
     * Required props for the accessibility label of the menu
     */
    ...AriaLabelPropType,

    /**
     * Provide a custom ref handler for the menu button
     */
    focusRef: PropTypes.func,

    /**
     * Provide a label for the link text
     */
    menuLinkName: PropTypes.string.isRequired,

    /**
     * Optional component to render instead of string
     */
    renderMenuContent: PropTypes.func,

    /**
     * Optionally provide a tabIndex for the underlying menu button
     */
    tabIndex: PropTypes.number,
  };

  static defaultProps = {
    renderMenuContent: defaultRenderMenuContent,
  };

  _subMenus = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // Used to manage the expansion state of the menu
      expanded: false,
      // Refers to the menuitem that is currently focused
      // Note: children should have `role="menuitem"` on node consuming ref
      selectedIndex: null,
    };
    this.items = [];
  }

  /**
   * Toggle the expanded state of the menu on click.
   */
  handleOnClick = (e) => {
    const { current: subMenusNode } = this._subMenus;
    if (!subMenusNode || !subMenusNode.contains(e.target)) {
      e.preventDefault();
    }

    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  };

  /**
   * Keyboard event handler for the entire menu.
   */
  handleOnKeyDown = (event) => {
    // Handle enter or space key for toggling the expanded state of the menu.
    if (matches(event, [keys.Enter, keys.Space])) {
      event.stopPropagation();
      event.preventDefault();

      this.setState((prevState) => ({
        expanded: !prevState.expanded,
      }));

      return;
    }
  };

  /**
   * Handle our blur event from our underlying menuitems. Will mostly be used
   * for toggling the expansion status of our menu in response to a user
   * clicking off of the menu or menubar.
   */
  handleOnBlur = (event) => {
    // Rough guess for a blur event that is triggered outside of our menu or
    // menubar context
    const itemTriggeredBlur = this.items.find(
      (element) => element === event.relatedTarget
    );
    if (
      event.relatedTarget &&
      ((event.relatedTarget.getAttribute('href') &&
        event.relatedTarget.getAttribute('href') !== '#') ||
        itemTriggeredBlur)
    ) {
      return;
    }

    this.setState({ expanded: false, selectedIndex: null });
  };

  /**
   * ref handler for our menu button. If we are supplied a `focusRef` prop, we also
   * forward along the node.
   *
   * This is useful when this component is a child in a
   * menu or menubar as it will allow the parent to explicitly focus the menu
   * button node when that child should receive focus.
   */
  handleMenuButtonRef = (node) => {
    if (this.props.focusRef) {
      this.props.focusRef(node);
    }
    this.menuButtonRef = node;
  };

  /**
   * Handles individual menuitem refs. We assign them to a class instance
   * property so that we can properly manage focus of our children.
   */
  handleItemRef = (index) => (node) => {
    this.items[index] = node;
  };

  handleMenuClose = (event) => {
    // Handle ESC keydown for closing the expanded menu.
    if (matches(event, [keys.Escape]) && this.state.expanded) {
      event.stopPropagation();
      event.preventDefault();

      this.setState(() => ({
        expanded: false,
        selectedIndex: null,
      }));

      // Return focus to menu button when the user hits ESC.
      this.menuButtonRef.focus();
      return;
    }
  };

  render() {
    const {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className: customClassName,
      children,
      renderMenuContent: MenuContent,
      menuLinkName,
    } = this.props;
    const accessibilityLabel = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    };
    const className = cx(`${prefix}--header__submenu`, customClassName);
    // Notes on eslint comments and based on the examples in:
    // https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html#
    // - The focus is handled by the <a> menuitem, onMouseOver is for mouse
    // users
    // - aria-haspopup can definitely have the value "menu"
    // - aria-expanded is on their example node with role="menuitem"
    // - href can be set to javascript:void(0), ideally this will be a button
    return (
      <li // eslint-disable-line jsx-a11y/mouse-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        className={className}
        onKeyDown={this.handleMenuClose}
        onClick={this.handleOnClick}
        onBlur={this.handleOnBlur}>
        <a // eslint-disable-line jsx-a11y/role-supports-aria-props,jsx-a11y/anchor-is-valid
          aria-haspopup="menu" // eslint-disable-line jsx-a11y/aria-proptypes
          aria-expanded={this.state.expanded}
          className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
          href="#"
          onKeyDown={this.handleOnKeyDown}
          ref={this.handleMenuButtonRef}
          tabIndex={0}
          {...accessibilityLabel}>
          {menuLinkName}
          <MenuContent />
        </a>
        <ul
          {...accessibilityLabel}
          ref={this._subMenus}
          className={`${prefix}--header__menu`}>
          {React.Children.map(children, this._renderMenuItem)}
        </ul>
      </li>
    );
  }

  /**
   * We capture the `ref` for each child inside of `this.items` to properly
   * manage focus. In addition to this focus management, all items receive a
   * `tabIndex: -1` so the user won't hit a large number of items in their tab
   * sequence when they might not want to go through all the items.
   */
  _renderMenuItem = (item, index) => {
    if (React.isValidElement(item)) {
      return React.cloneElement(item, {
        ref: this.handleItemRef(index),
      });
    }
  };
}

const HeaderMenuForwardRef = React.forwardRef((props, ref) => {
  return <HeaderMenu {...props} focusRef={ref} />;
});

HeaderMenuForwardRef.displayName = 'HeaderMenu';
export default HeaderMenuForwardRef;
