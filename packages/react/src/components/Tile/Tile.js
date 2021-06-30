/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import Link from '../Link';
import {
  Checkbox16,
  CheckboxCheckedFilled16,
  ChevronDown16,
} from '@carbon/icons-react';
import { keys, matches } from '../../internal/keyboard';
import deprecate from '../../prop-types/deprecate';
import { composeEventHandlers } from '../../tools/events';

const { prefix } = settings;

export class Tile extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * `true` to use the light version. For use on $ui-01 backgrounds only.
     * Don't use this to make tile background color same as container background color.
     */
    light: PropTypes.bool,
  };

  static defaultProps = {
    light: false,
  };

  render() {
    const { children, className, light, ...other } = this.props;
    const tileClasses = classNames(
      `${prefix}--tile`,
      {
        [`${prefix}--tile--light`]: light,
      },
      className
    );
    return (
      <div className={tileClasses} {...other}>
        {children}
      </div>
    );
  }
}

export class ClickableTile extends Component {
  state = {};

  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * Specify the function to run when the ClickableTile is clicked
     */
    handleClick: PropTypes.func,

    /**
     * Specify the function to run when the ClickableTile is interacted with via a keyboard
     */
    handleKeyDown: PropTypes.func,

    /**
     * The href for the link.
     */
    href: PropTypes.string,

    /**
     * `true` to use the light version. For use on $ui-01 backgrounds only.
     * Don't use this to make tile background color same as container background color.
     */
    light: PropTypes.bool,

    /**
     * The rel property for the link.
     */
    rel: PropTypes.string,
  };

  static defaultProps = {
    clicked: false,
    handleClick: () => {},
    handleKeyDown: () => {},
    light: false,
  };

  handleClick = (evt) => {
    evt.persist();
    this.setState(
      {
        clicked: !this.state.clicked,
      },
      () => {
        this.props.handleClick(evt);
      }
    );
  };

  handleKeyDown = (evt) => {
    evt.persist();
    if (matches(evt, [keys.Enter, keys.Space])) {
      this.setState(
        {
          clicked: !this.state.clicked,
        },
        () => {
          this.props.handleKeyDown(evt);
        }
      );
    } else {
      this.props.handleKeyDown(evt);
    }
  };

  // eslint-disable-next-line react/prop-types
  static getDerivedStateFromProps({ clicked }, state) {
    const { prevClicked } = state;
    return prevClicked === clicked
      ? null
      : {
          clicked,
          prevClicked: clicked,
        };
  }

  render() {
    const {
      children,
      href,
      className,
      handleClick, // eslint-disable-line
      handleKeyDown, // eslint-disable-line
      clicked, // eslint-disable-line
      light,
      ...other
    } = this.props;

    const classes = classNames(
      `${prefix}--tile`,
      `${prefix}--tile--clickable`,
      {
        [`${prefix}--tile--is-clicked`]: this.state.clicked,
        [`${prefix}--tile--light`]: light,
      },
      className
    );

    return (
      <Link
        href={href}
        className={classes}
        {...other}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}>
        {children}
      </Link>
    );
  }
}

export function SelectableTile(props) {
  const {
    children,
    id,
    tabIndex = 0,
    value,
    name,
    title,
    // eslint-disable-next-line no-unused-vars
    iconDescription,
    className,
    handleClick,
    handleKeyDown,
    onClick = () => {},
    onChange = () => {},
    onKeyDown = () => {},
    light,
    disabled,
    selected,
    ...other
  } = props;

  // TODO: replace with onClick when handleClick prop is deprecated
  const clickHandler = handleClick || onClick;

  // TODO: replace with onClick when handleClick prop is deprecated
  const keyDownHandler = handleKeyDown || onKeyDown;

  const [isSelected, setIsSelected] = useState(selected);
  const input = useRef(null);
  const classes = classNames(
    `${prefix}--tile`,
    `${prefix}--tile--selectable`,
    {
      [`${prefix}--tile--is-selected`]: isSelected,
      [`${prefix}--tile--light`]: light,
      [`${prefix}--tile--disabled`]: disabled,
    },
    className
  );
  const inputClasses = classNames(`${prefix}--tile-input`, {
    [`${prefix}--tile-input--checked`]: isSelected,
  });

  // TODO: rename to handleClick when handleClick prop is deprecated
  function handleOnClick(evt) {
    evt.preventDefault();
    evt.persist();
    setIsSelected(!isSelected);
    clickHandler(evt);
    onChange(evt);
  }

  // TODO: rename to handleKeyDown when handleKeyDown prop is deprecated
  function handleOnKeyDown(evt) {
    evt.persist();
    if (matches(evt, [keys.Enter, keys.Space])) {
      evt.preventDefault();
      setIsSelected(!isSelected);
      onChange(evt);
    }
    keyDownHandler(evt);
  }

  function handleChange(event) {
    setIsSelected(event.target.checked);
    onChange(event);
  }

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <>
      <input
        ref={input}
        tabIndex={-1}
        id={id}
        className={inputClasses}
        value={value}
        onChange={!disabled ? handleChange : null}
        type="checkbox"
        disabled={disabled}
        name={name}
        title={title}
        checked={isSelected}
      />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <label
        htmlFor={id}
        className={classes}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={!disabled ? tabIndex : null}
        {...other}
        onClick={!disabled ? handleOnClick : null}
        onKeyDown={!disabled ? handleOnKeyDown : null}>
        <span
          className={`${prefix}--tile__checkmark ${prefix}--tile__checkmark--persistent`}>
          {isSelected ? <CheckboxCheckedFilled16 /> : <Checkbox16 />}
        </span>
        <span className={`${prefix}--tile-content`}>{children}</span>
      </label>
    </>
  );
}
SelectableTile.defaultProps = {
  value: 'value',
  title: 'title',
  selected: false,
  tabIndex: 0,
  light: false,
};
SelectableTile.propTypes = {
  /**
   * The child nodes.
   */
  children: PropTypes.node,

  /**
   * The CSS class names.
   */
  className: PropTypes.string,

  /**
   * Specify whether the SelectableTile should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify the function to run when the SelectableTile is clicked
   */
  handleClick: deprecate(
    PropTypes.func,
    'The `handleClick` prop for `SelectableTile` has been deprecated in favor of `onClick`. It will be removed in the next major release.'
  ),

  /**
   * Specify the function to run when the SelectableTile is interacted with via a keyboard
   */
  handleKeyDown: deprecate(
    PropTypes.func,
    'The `handleKeyDown` prop for `SelectableTile` has been deprecated in favor of `onKeyDown`. It will be removed in the next major release.'
  ),

  /**
   * The description of the checkmark icon.
   */
  iconDescription: deprecate(
    PropTypes.string,
    'The `iconDescription` prop for `SelectableTile` is no longer needed and has ' +
      'been deprecated. It will be removed in the next major release.'
  ),

  /**
   * The ID of the `<input>`.
   */
  id: PropTypes.string,

  /**
   * `true` to use the light version. For use on $ui-01 backgrounds only.
   * Don't use this to make tile background color same as container background color.
   */
  light: PropTypes.bool,

  /**
   * The `name` of the `<input>`.
   */
  name: PropTypes.string,

  /**
   * The empty handler of the `<input>`.
   */
  onChange: PropTypes.func,

  /**
   * Specify the function to run when the SelectableTile is clicked
   */
  onClick: PropTypes.func,

  /**
   * Specify the function to run when the SelectableTile is interacted with via a keyboard
   */
  onKeyDown: PropTypes.func,

  /**
   * `true` to select this tile.
   */
  selected: PropTypes.bool,

  /**
   * Specify the tab index of the wrapper element
   */
  tabIndex: PropTypes.number,

  /**
   * The `title` of the `<input>`.
   */
  title: PropTypes.string,

  /**
   * The value of the `<input>`.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export class ExpandableTile extends Component {
  state = {};

  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * `true` if the tile is expanded.
     */
    expanded: PropTypes.bool,

    /**
     * Specify the function to run when the ExpandableTile is clicked
     */
    handleClick: PropTypes.func,

    /**
     * An ID that can be provided to aria-labelledby
     */
    id: PropTypes.string,

    /**
     * `true` to use the light version. For use on $ui-01 backgrounds only.
     * Don't use this to make tile background color same as container background color.
     */
    light: PropTypes.bool,

    /**
     * optional handler to decide whether to ignore a click. returns false if click should be ignored
     */
    onBeforeClick: PropTypes.func,

    /**
     * optional handler to trigger a function the Tile is clicked
     */
    onClick: PropTypes.func,

    /**
     * optional handler to trigger a function when a key is pressed
     */
    onKeyUp: PropTypes.func,

    /**
     * The `tabindex` attribute.
     */
    tabIndex: PropTypes.number,

    /**
     * The description of the "collapsed" icon that can be read by screen readers.
     */
    tileCollapsedIconText: PropTypes.string,

    /**
     * When "collapsed", a label to appear next to the chevron (e.g., "View more").
     */
    tileCollapsedLabel: PropTypes.string,

    /**
     * The description of the "expanded" icon that can be read by screen readers.
     */
    tileExpandedIconText: PropTypes.string,

    /**
     * When "expanded", a label to appear next to the chevron (e.g., "View less").
     */
    tileExpandedLabel: PropTypes.string,
  };

  static defaultProps = {
    tabIndex: 0,
    expanded: false,
    tileMaxHeight: 0,
    tilePadding: 0,
    onBeforeClick: () => true,
    handleClick: () => {},
    tileCollapsedIconText: 'Interact to expand Tile',
    tileExpandedIconText: 'Interact to collapse Tile',
    light: false,
  };

  static getDerivedStateFromProps(
    // eslint-disable-next-line react/prop-types
    { expanded, tileMaxHeight, tilePadding },
    state
  ) {
    const {
      prevExpanded,
      prevTileMaxHeight,
      prevTilePadding,
      expanded: currentExpanded,
      tileMaxHeight: currentTileMaxHeight,
      tilePadding: currentTilePadding,
    } = state;
    const expandedChanged = prevExpanded !== expanded;
    const tileMaxHeightChanged = prevTileMaxHeight !== tileMaxHeight;
    const tilePaddingChanged = prevTilePadding !== tilePadding;
    return !expandedChanged && !tileMaxHeightChanged && !tilePaddingChanged
      ? null
      : {
          expanded: !expandedChanged ? currentExpanded : expanded,
          tileMaxHeight: !tileMaxHeightChanged
            ? currentTileMaxHeight
            : tileMaxHeight,
          tilePadding: !tilePaddingChanged ? currentTilePadding : tilePadding,
          prevExpanded: expanded,
          prevTileMaxHeight: tileMaxHeight,
          prevTilePadding: tilePadding,
        };
  }

  componentDidMount = () => {
    if (this.tile) {
      const getStyle = window.getComputedStyle(this.tile, null);

      if (this.aboveTheFold) {
        this.setState({
          tileMaxHeight: this.aboveTheFold.getBoundingClientRect().height,
          tilePadding:
            parseInt(getStyle.getPropertyValue('padding-top'), 10) +
            parseInt(getStyle.getPropertyValue('padding-bottom'), 10),
        });
      }
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.expanded !== this.props.expanded) {
      this.setMaxHeight();
    }
  };

  setMaxHeight = () => {
    if (this.state.expanded ? this.tileContent : this.aboveTheFold) {
      this.setState({
        tileMaxHeight: this.state.expanded
          ? this.tileContent.getBoundingClientRect().height
          : this.aboveTheFold.getBoundingClientRect().height,
      });
    }
  };

  handleClick = (evt) => {
    if (!this.props.onBeforeClick(evt) || evt.target.tagName === 'INPUT') {
      return;
    }
    evt.persist();
    this.setState(
      {
        expanded: !this.state.expanded,
      },
      () => {
        this.setMaxHeight();
        this.props.handleClick(evt);
      }
    );
  };

  handleKeyUp = (evt) => {
    if (evt.target !== this.tile) {
      if (matches(evt, [keys.Enter, keys.Space])) {
        evt.preventDefault();
      }
    }
  };

  getChildren = () => {
    return React.Children.toArray(this.props.children);
  };

  render() {
    const {
      tabIndex,
      className,
      expanded, // eslint-disable-line
      tileMaxHeight, // eslint-disable-line
      tilePadding, // eslint-disable-line
      handleClick, // eslint-disable-line
      onClick,
      onKeyUp,
      tileCollapsedIconText,
      tileExpandedIconText,
      tileCollapsedLabel,
      tileExpandedLabel,
      onBeforeClick, // eslint-disable-line
      light,
      ...other
    } = this.props;

    const { expanded: isExpanded } = this.state;

    const classes = classNames(
      `${prefix}--tile`,
      `${prefix}--tile--expandable`,
      {
        [`${prefix}--tile--is-expanded`]: isExpanded,
        [`${prefix}--tile--light`]: light,
      },
      className
    );

    const tileStyle = {
      maxHeight: isExpanded
        ? null
        : this.state.tileMaxHeight + this.state.tilePadding,
    };

    const childrenAsArray = this.getChildren();

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <button
        type="button"
        ref={(tile) => {
          this.tile = tile;
        }}
        style={tileStyle}
        className={classes}
        aria-expanded={isExpanded}
        title={isExpanded ? tileExpandedIconText : tileCollapsedIconText}
        {...other}
        onKeyUp={composeEventHandlers([onKeyUp, this.handleKeyUp])}
        onClick={composeEventHandlers([onClick, this.handleClick])}
        tabIndex={tabIndex}>
        <div
          ref={(tileContent) => {
            this.tileContent = tileContent;
          }}>
          <div
            ref={(aboveTheFold) => {
              this.aboveTheFold = aboveTheFold;
            }}
            className={`${prefix}--tile-content`}>
            {childrenAsArray[0]}
          </div>
          <div className={`${prefix}--tile__chevron`}>
            <span>{isExpanded ? tileExpandedLabel : tileCollapsedLabel}</span>
            <ChevronDown16 />
          </div>
          <div className={`${prefix}--tile-content`}>{childrenAsArray[1]}</div>
        </div>
      </button>
    );
  }
}

export class TileAboveTheFoldContent extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <span className={`${prefix}--tile-content__above-the-fold`}>
        {children}
      </span>
    );
  }
}

export class TileBelowTheFoldContent extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <span className={`${prefix}--tile-content__below-the-fold`}>
        {children}
      </span>
    );
  }
}
