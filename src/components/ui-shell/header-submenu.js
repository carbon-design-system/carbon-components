import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';
import settings from '../../globals/js/settings';
import trackBlur from '../../globals/js/mixins/track-blur';
import eventMatches from '../../globals/js/misc/event-matches';

const forEach = Array.prototype.forEach;

export default class HeaderSubmenu extends mixin(createComponent, initComponentBySearch, handles, trackBlur) {
  constructor(element, options) {
    super(element, options);
    this.manage(on(this.element, 'click', this._handleClick));
    this.manage(on(this.element, 'keydown', this._handleKeyDown));
  }
  /**
   * The map associating DOM element and HeaderSubmenu instance.
   * @member HeaderSubmenu.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * Enum for header submenu actions.
   * @readonly
   * @enum {string}
   */
  static actions = {
    CLOSE_SUBMENU: 'CLOSE_SUBMENU',
    OPEN_SUBMENU: 'OPEN_SUBMENU',
    TOGGLE_SUBMENU_WITH_FOCUS: 'TOGGLE_SUBMENU_WITH_FOCUS',
    DELEGATE_TO_FLYOUT_MENU: 'DELEGATE_TO_FLYOUT_MENU',
  };

  /**
   * @returns {actions | null}
   */
  _getAction = event => {
    const isFlyoutMenu = eventMatches(event, this.options.selectorFlyoutMenu);
    if (isFlyoutMenu) {
      return this.constructor.actions.DELEGATE_TO_FLYOUT_MENU;
    }
    switch (event.type) {
      case 'keydown':
        return {
          32: this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS, // space bar
          13: this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS, // enter
          27: this.constructor.actions.CLOSE_SUBMENU, // esc
          // possible arrow keys
        }[event.which];
      case 'click':
        return eventMatches(event, this.options.selectorItem) ? this.constructor.actions.CLOSE_SUBMENU : null;
      case 'focus':
        return this.constructor.actions.OPEN_SUBMENU;

      default:
        return null;
    }
  };

  /**
   * @param {action} action
   * @returns {boolean} new header submenu state
   */
  _getNewState = action => {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    const isExpanded = trigger.getAttribute(this.options.attribExpanded) === 'true';
    switch (action) {
      case this.constructor.actions.CLOSE_SUBMENU:
        return false;
      case this.constructor.actions.OPEN_SUBMENU:
        return true;
      case this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS:
        return !isExpanded;
      default:
        return isExpanded;
    }
  };

  /**
   * @returns {void}
   */
  _setState = ({ shouldBeExpanded, shouldFocusOnOpen }) => {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    trigger.setAttribute(this.options.attribExpanded, shouldBeExpanded);
    forEach.call(this.element.querySelectorAll(this.options.selectorItem), item => {
      item.tabIndex = shouldBeExpanded ? 0 : -1;
    });
    // focus first submenu item
    if (shouldBeExpanded && shouldFocusOnOpen) {
      this.element.querySelector(this.options.selectorItem).focus();
    }
  };

  /**
   * @returns {Element} Currently highlighted element.
   */
  getCurrentNavigation = () => {
    const focused = this.element.ownerDocument.activeElement;
    return focused.nodeType === Node.ELEMENT_NODE && focused.matches(this.options.selectorItem) ? focused : null;
  };

  /**
   * Moves the focus up/down.
   * @param {number} direction The direction of navigating.
   */
  navigate = direction => {
    const items = [...this.element.querySelectorAll(this.options.selectorItem)];
    const start = this.getCurrentNavigation() || this.element.querySelector(this.options.selectorItemSelected);
    const getNextItem = old => {
      const handleUnderflow = (index, length) => index + (index >= 0 ? 0 : length);
      const handleOverflow = (index, length) => index - (index < length ? 0 : length);

      // `items.indexOf(old)` may be -1 (Scenario of no previous focus)
      const index = Math.max(items.indexOf(old) + direction, -1);
      return items[handleUnderflow(handleOverflow(index, items.length), items.length)];
    };
    for (let current = getNextItem(start); current && current !== start; current = getNextItem(current)) {
      if (
        !current.matches(this.options.selectorItemHidden) &&
        !current.parentNode.matches(this.options.selectorItemHidden) &&
        !current.matches(this.options.selectorItemSelected)
      ) {
        current.focus();
        break;
      }
    }
  };

  /**
   * Closes the menu if this component loses focus.
   */
  handleBlur = () => {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    if (trigger) {
      trigger.setAttribute(this.options.attribExpanded, false);
    }
  };

  /**
   * @param {Event} event The event triggering this method.
   * @returns {void}
   */
  _handleClick = event => {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    if (!trigger) {
      return;
    }
    const action = this._getAction(event); // null | close
    if (action) {
      const shouldBeExpanded = this._getNewState(action);
      this._setState({ shouldBeExpanded });
    }
  };

  /**
   * Handles keydown event.
   * @param {Event} event The event triggering this method.
   */
  _handleKeyDown = event => {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    if (!trigger) {
      return;
    }
    const action = this._getAction(event);

    if (event.which === 32) {
      event.preventDefault();
    }

    switch (action) {
      case this.constructor.actions.DELEGATE_TO_FLYOUT_MENU:
        // handleFlyoutMenu
        break;
      case this.constructor.actions.OPEN_SUBMENU:
      case this.constructor.actions.CLOSE_SUBMENU: {
        const shouldBeExpanded = this._getNewState(action);
        this._setState({ shouldBeExpanded });
        break;
      }

      case this.constructor.actions.TOGGLE_SUBMENU_WITH_FOCUS: {
        const shouldBeExpanded = this._getNewState(action);
        this._setState({ shouldBeExpanded, shouldFocusOnOpen: true });
        break;
      }

      default: {
        const expanded = trigger.getAttribute(this.options.attribExpanded) === 'true';
        if (expanded) {
          const direction = {
            38: this.constructor.NAVIGATE.BACKWARD,
            40: this.constructor.NAVIGATE.FORWARD,
          }[event.which];
          switch (event.which) {
            case 38: // up arrow
            case 40: // down arrow
              this.navigate(direction);
              event.preventDefault(); // Prevents up/down keys from scrolling container
              break;
            default:
              break;
          }
        }
        break;
      }
    }
  };

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode HeaderSubmenu.create .create()}, or
   * {@linkcode HeaderSubmenu.init .init()},
   * properties in this object are overriden for the instance being create and
   * how {@linkcode HeaderSubmenu.init .init()} works.
   * @member HeaderSubmenu.options
   * @type {Object}
   * @property {string} selectorInit The data attribute to find side navs.
   */
  static get options() {
    const { prefix } = settings;
    return {
      selectorInit: '[data-header-submenu]',
      selectorTrigger: `.${prefix}--header__menu-title`,
      selectorItem: `.${prefix}--header__menu .${prefix}--header__menu-item`,
      attribExpanded: 'aria-expanded',
    };
  }

  /**
   * Enum for navigating backward/forward.
   * @readonly
   * @member HeaderSubmenu.NAVIGATE
   * @type {Object}
   * @property {number} BACKWARD Navigating backward.
   * @property {number} FORWARD Navigating forward.
   */
  static NAVIGATE = {
    BACKWARD: -1,
    FORWARD: 1,
  };
}
