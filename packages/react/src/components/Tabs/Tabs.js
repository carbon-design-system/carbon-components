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
import { ChevronLeft, ChevronRight } from '@carbon/icons-react/next';
import debounce from 'lodash.debounce';
import { keys, match, matches } from '../../internal/keyboard';
import TabContent from '../TabContent';

const { prefix } = settings;

export default class Tabs extends React.Component {
  static propTypes = {
    /**
     * Pass in a collection of <Tab> children to be rendered depending on the
     * currently selected tab
     */
    children: PropTypes.node,

    /**
     * Provide a className that is applied to the root <div> component for the
     * <Tabs>
     */
    className: PropTypes.string,

    /**
     * Specify whether the Tab content is hidden
     */
    hidden: PropTypes.bool,

    /**
     * Provide the props that describe the left overflow button
     */
    leftOverflowButtonProps: PropTypes.object,

    /**
     * Specify whether or not to use the light component variant
     */
    light: PropTypes.bool,

    /**
     * Optionally provide an `onClick` handler that is invoked when a <Tab> is
     * clicked
     */
    onClick: PropTypes.func,

    /**
     * Optionally provide an `onKeyDown` handler that is invoked when keyed
     * navigation is triggered
     */
    onKeyDown: PropTypes.func,

    /**
     * Provide an optional handler that is called whenever the selection
     * changes. This method is called with the index of the tab that was
     * selected
     */
    onSelectionChange: PropTypes.func,

    /**
     * Provide the props that describe the right overflow button
     */
    rightOverflowButtonProps: PropTypes.object,

    /**
     * Choose whether or not to automatically scroll to newly selected tabs
     * on component rerender
     */
    scrollIntoView: PropTypes.bool,

    /**
     * Optionally provide an index for the currently selected <Tab>
     */
    selected: PropTypes.number,

    /**
     * Choose whether or not to automatically change selection on focus
     */
    selectionMode: PropTypes.oneOf(['automatic', 'manual']),

    /**
     * Provide a className that is applied to the <TabContent> components
     */
    tabContentClassName: PropTypes.string,

    /**
     * Provide the type of Tab
     */
    type: PropTypes.oneOf(['default', 'container']),
  };

  static defaultProps = {
    type: 'default',
    scrollIntoView: true,
    selected: 0,
    selectionMode: 'automatic',
  };

  state = {
    horizontalOverflow: false,
  };

  tablist = React.createRef();
  leftOverflowNavButton = React.createRef();
  rightOverflowNavButton = React.createRef();
  // width of the overflow buttons
  OVERFLOW_BUTTON_OFFSET = 40;

  static getDerivedStateFromProps({ selected }, state) {
    const { prevSelected } = state;
    return prevSelected === selected
      ? null
      : {
          selected,
          prevSelected: selected,
        };
  }

  /**
   * `scroll` event handler to save tablist clientWidth, scrollWidth, and
   * scrollLeft
   */
  handleScroll = () => {
    if (!this.tablist?.current) {
      return;
    }
    const {
      clientWidth: tablistClientWidth,
      scrollLeft: tablistScrollLeft,
      scrollWidth: tablistScrollWidth,
    } = this.tablist.current;
    this.setState({
      tablistClientWidth,
      horizontalOverflow: tablistScrollWidth > tablistClientWidth,
      tablistScrollWidth,
      tablistScrollLeft,
    });
  };

  /**
   * The debounced version of the `resize` event handler.
   * @type {Function}
   * @private
   */
  _debouncedHandleWindowResize = null;

  _handleWindowResize = this.handleScroll;

  componentDidMount() {
    if (!this._debouncedHandleWindowResize) {
      this._debouncedHandleWindowResize = debounce(
        this._handleWindowResize,
        200
      );
    }

    this._handleWindowResize();
    window.addEventListener('resize', this._debouncedHandleWindowResize);

    // scroll selected tab into view on mount
    const {
      clientWidth: tablistClientWidth,
      scrollLeft: tablistScrollLeft,
      scrollWidth: tablistScrollWidth,
    } = this.tablist?.current || {};
    const tab = this.getTabAt(this.state.selected);
    const horizontalOverflow = tablistScrollWidth > tablistClientWidth;

    if (horizontalOverflow) {
      const leftOverflowNavButtonHidden =
        tab?.tabAnchor?.getBoundingClientRect().right <
        tab?.tabAnchor?.offsetParent.getBoundingClientRect().right;
      const rightOverflowNavButtonHidden =
        tablistScrollLeft + tablistClientWidth === tablistScrollWidth;
      this.props.scrollIntoView &&
        tab?.tabAnchor?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      // account for overflow buttons in scroll position on mount
      if (!leftOverflowNavButtonHidden && !rightOverflowNavButtonHidden) {
        this.tablist.current.scrollLeft += this.OVERFLOW_BUTTON_OFFSET * 2;
      }
    }
  }

  componentWillUnmount() {
    if (this._debouncedHandleWindowResize) {
      this._debouncedHandleWindowResize.cancel();
    }
    window.removeEventListener('resize', this._debouncedHandleWindowResize);
  }

  componentDidUpdate(_, prevState) {
    // compare current tablist properties to current state
    const {
      clientWidth: tablistClientWidth,
      scrollLeft: tablistScrollLeft,
      scrollWidth: tablistScrollWidth,
    } = this.tablist.current;
    const {
      tablistClientWidth: currentStateClientWidth,
      tablistScrollLeft: currentStateScrollLeft,
      tablistScrollWidth: currentStateScrollWidth,
      selected,
    } = this.state;

    if (
      tablistClientWidth !== currentStateClientWidth ||
      tablistScrollLeft !== currentStateScrollLeft ||
      tablistScrollWidth !== currentStateScrollWidth
    ) {
      this.setState({
        horizontalOverflow: tablistScrollWidth > tablistClientWidth,
        tablistClientWidth,
        tablistScrollLeft,
        tablistScrollWidth,
      });
    }

    if (this.props.scrollIntoView && prevState.selected !== selected) {
      this.getTabAt(selected)?.tabAnchor?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  getEnabledTabs = () =>
    React.Children.toArray(this.props.children).reduce(
      (enabledTabs, tab, index) =>
        !tab.props.disabled ? enabledTabs.concat(index) : enabledTabs,
      []
    );

  getNextIndex = (index, direction) => {
    const enabledTabs = this.getEnabledTabs();
    const nextIndex = Math.max(
      enabledTabs.indexOf(index) + direction,
      // For `tab` not found in `enabledTabs`
      -1
    );
    const nextIndexLooped =
      nextIndex >= 0 && nextIndex < enabledTabs.length
        ? nextIndex
        : nextIndex - Math.sign(nextIndex) * enabledTabs.length;
    return enabledTabs[nextIndexLooped];
  };

  getDirection = (evt) => {
    if (match(evt, keys.ArrowLeft)) {
      return -1;
    }
    if (match(evt, keys.ArrowRight)) {
      return 1;
    }
    return 0;
  };

  getTabAt = (index, useFresh) =>
    (!useFresh && this[`tab${index}`]) ||
    React.Children.toArray(this.props.children)[index];

  scrollTabIntoView = (event, { index }) => {
    const tab = this.getTabAt(index);
    if (
      matches(event, [keys.ArrowLeft, keys.ArrowRight]) ||
      event.type === 'click'
    ) {
      const currentScrollLeft = this.state.tablistScrollLeft;
      tab?.tabAnchor?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      tab?.tabAnchor?.focus();
      const newScrollLeft = this.tablist.current.scrollLeft;
      if (newScrollLeft > currentScrollLeft) {
        this.tablist.current.scrollLeft += this.OVERFLOW_BUTTON_OFFSET;
      }
    }
  };

  selectTabAt = (event, { index, onSelectionChange }) => {
    this.scrollTabIntoView(event, { index });
    if (this.state.selected !== index) {
      this.setState({
        selected: index,
      });
      if (typeof onSelectionChange === 'function') {
        onSelectionChange(index);
      }
    }
  };

  handleTabKeyDown = (onSelectionChange) => {
    return (index, evt) => {
      if (matches(evt, [keys.Enter, keys.Space])) {
        this.selectTabAt(evt, { index, onSelectionChange });
      }

      const nextIndex = (() => {
        if (matches(evt, [keys.ArrowLeft, keys.ArrowRight])) {
          return this.getNextIndex(index, this.getDirection(evt));
        }
        if (match(evt, keys.Home)) {
          return 0;
        }
        if (match(evt, keys.End)) {
          return this.getEnabledTabs().pop();
        }
      })();
      const tab = this.getTabAt(nextIndex);

      if (
        matches(evt, [keys.ArrowLeft, keys.ArrowRight, keys.Home, keys.End])
      ) {
        evt.preventDefault();
        if (this.props.selectionMode !== 'manual') {
          this.selectTabAt(evt, { index: nextIndex, onSelectionChange });
        } else {
          this.scrollTabIntoView(evt, { index: nextIndex });
        }
        tab?.tabAnchor?.focus();
      }
    };
  };

  getTabs = () => React.Children.map(this.props.children, (tab) => tab);

  // following functions (handle*) are Props on Tab.js, see Tab.js for parameters
  handleTabClick = (onSelectionChange) => (index, evt) => {
    evt.preventDefault();
    this.selectTabAt(evt, { index, onSelectionChange });
  };

  setTabAt = (index, tabRef) => {
    this[`tab${index}`] = tabRef;
  };

  overflowNavInterval = null;

  handleOverflowNavClick = (_, { direction, multiplier = 10 }) => {
    // account for overflow button appearing and causing tablist width change
    const { clientWidth, scrollLeft, scrollWidth } = this.tablist?.current;
    if (direction === 1 && !scrollLeft) {
      this.tablist.current.scrollLeft += this.OVERFLOW_BUTTON_OFFSET;
    }

    this.tablist.current.scrollLeft += direction * multiplier;

    const leftEdgeReached =
      direction === -1 && scrollLeft < this.OVERFLOW_BUTTON_OFFSET;
    const rightEdgeReached =
      direction === 1 &&
      scrollLeft + clientWidth >= scrollWidth - this.OVERFLOW_BUTTON_OFFSET;
    if (leftEdgeReached || rightEdgeReached) {
      if (leftEdgeReached) {
        this.rightOverflowNavButton?.current?.focus();
      }
      if (rightEdgeReached) {
        this.leftOverflowNavButton?.current?.focus();
      }
    }
  };

  handleOverflowNavMouseDown = (event, { direction }) => {
    // disregard mouse buttons aside from LMB
    if (event.buttons !== 1) {
      return;
    }
    this.overflowNavInterval = setInterval(() => {
      const { clientWidth, scrollLeft, scrollWidth } = this.tablist?.current;

      // clear interval if scroll reaches left or right edge
      const leftEdgeReached =
        direction === -1 && scrollLeft < this.OVERFLOW_BUTTON_OFFSET;
      const rightEdgeReached =
        direction === 1 &&
        scrollLeft + clientWidth >= scrollWidth - this.OVERFLOW_BUTTON_OFFSET;
      if (leftEdgeReached || rightEdgeReached) {
        clearInterval(this.overflowNavInterval);
      }

      // account for overflow button appearing and causing tablist width change
      this.handleOverflowNavClick(event, { direction });
    });
  };

  handleOverflowNavMouseUp = () => {
    clearInterval(this.overflowNavInterval);
  };

  render() {
    const {
      className,
      type,
      light,
      onSelectionChange,
      scrollIntoView, // eslint-disable-line no-unused-vars
      selectionMode, // eslint-disable-line no-unused-vars
      tabContentClassName,
      leftOverflowButtonProps,
      rightOverflowButtonProps,
      ...other
    } = this.props;

    /**
     * The tab panel acts like a tab panel when the screen is wider, but acts
     * like a select list when the screen is narrow.  In the wide case we want
     * to allow the user to use the tab key to set the focus in the tab panel
     * and then use the left and right arrow keys to navigate the tabs.  In the
     * narrow case we want to use the tab key to select different options in
     * the list.
     *
     * We set the tab index based on the different states so the browser will treat
     * the whole tab panel as a single focus component when it looks like a tab
     * panel and separate components when it looks like a select list.
     */
    const tabsWithProps = this.getTabs().map((tab, index) => {
      const tabIndex = index === this.state.selected ? 0 : -1;
      const newTab = React.cloneElement(tab, {
        index,
        selected: index === this.state.selected,
        handleTabClick: this.handleTabClick(onSelectionChange),
        tabIndex,
        ref: (e) => {
          this.setTabAt(index, e);
        },
        handleTabKeyDown: this.handleTabKeyDown(onSelectionChange),
      });

      return newTab;
    });

    const tabContentWithProps = React.Children.map(tabsWithProps, (tab) => {
      const {
        id: tabId,
        children,
        selected,
        renderContent: Content = TabContent,
      } = tab.props;

      return (
        <Content
          id={tabId && `${tabId}__panel`}
          className={tabContentClassName}
          hidden={!selected}
          selected={selected}
          aria-labelledby={tabId}>
          {children}
        </Content>
      );
    });

    const leftOverflowNavButtonHidden =
      !this.state.horizontalOverflow || !this.state.tablistScrollLeft;
    const rightOverflowNavButtonHidden =
      !this.state.horizontalOverflow ||
      this.state.tablistScrollLeft + this.state.tablistClientWidth ===
        this.state.tablistScrollWidth;
    const classes = {
      // TODO: remove scrollable from classnames in next major release and uncomment classnames that don't contain scrollable
      tabs: classNames(
        className,
        // `${prefix}--tabs`,
        `${prefix}--tabs--scrollable`,
        {
          // [`${prefix}--tabs--container`]: type === 'container',
          [`${prefix}--tabs--scrollable--container`]: type === 'container',
          // [`${prefix}--tabs--light`]: light,
          [`${prefix}--tabs--scrollable--light`]: light,
        }
      ),
      // TODO: remove scrollable from classnames in next major release and uncomment classnames that don't contain scrollable
      tablist: classNames(
        // `${prefix}--tabs__nav`,
        `${prefix}--tabs--scrollable__nav`
      ),
      leftOverflowButtonClasses: classNames({
        [`${prefix}--tab--overflow-nav-button`]: this.state.horizontalOverflow,
        [`${prefix}--tab--overflow-nav-button--hidden`]: leftOverflowNavButtonHidden,
      }),
      rightOverflowButtonClasses: classNames({
        [`${prefix}--tab--overflow-nav-button`]: this.state.horizontalOverflow,
        [`${prefix}--tab--overflow-nav-button--hidden`]: rightOverflowNavButtonHidden,
      }),
    };

    return (
      <>
        <div {...other} className={classes.tabs} onScroll={this.handleScroll}>
          <button
            aria-hidden="true"
            aria-label="Scroll left"
            className={classes.leftOverflowButtonClasses}
            onClick={(_) => this.handleOverflowNavClick(_, { direction: -1 })}
            onMouseDown={(event) =>
              this.handleOverflowNavMouseDown(event, { direction: -1 })
            }
            onMouseUp={this.handleOverflowNavMouseUp}
            ref={this.leftOverflowNavButton}
            tabIndex="-1"
            type="button"
            {...leftOverflowButtonProps}>
            <ChevronLeft />
          </button>
          {!leftOverflowNavButtonHidden && (
            <div className={`${prefix}--tabs__overflow-indicator--left`} />
          )}
          <ul
            role="tablist"
            tabIndex={-1}
            className={classes.tablist}
            ref={this.tablist}>
            {tabsWithProps}
          </ul>
          {!rightOverflowNavButtonHidden && (
            <div className={`${prefix}--tabs__overflow-indicator--right`} />
          )}
          <button
            aria-hidden="true"
            aria-label="Scroll right"
            className={classes.rightOverflowButtonClasses}
            onClick={(_) => this.handleOverflowNavClick(_, { direction: 1 })}
            onMouseDown={(event) =>
              this.handleOverflowNavMouseDown(event, { direction: 1 })
            }
            onMouseUp={this.handleOverflowNavMouseUp}
            ref={this.rightOverflowNavButton}
            tabIndex="-1"
            type="button"
            {...rightOverflowButtonProps}>
            <ChevronRight />
          </button>
        </div>
        {tabContentWithProps}
      </>
    );
  }
}
