/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

export default class TextInput extends mixin(
  createComponent,
  initComponentBySearch,
  handles
) {
  /**
   * Text Input.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element - The element functioning as a text field.
   */
  constructor(element, options) {
    super(element, options);
    this.manage(
      on(this.element, 'click', (event) => {
        const toggleVisibilityButton = eventMatches(
          event,
          this.options.selectorPasswordVisibilityButton
        );
        if (toggleVisibilityButton) {
          this._toggle({ element, button: toggleVisibilityButton });
        }
      })
    );
  }

  /**
   *
   * @param {object} obj - Object containing selectors and visibility status
   * @param {HTMLElement} obj.iconVisibilityOn - The element functioning as
   * the SVG icon for visibility on
   * @param {HTMLElement} obj.iconVisibilityOff - The element functioning as
   * the SVG icon for visibility off
   * @param {boolean} obj.passwordIsVisible - The visibility of the password in the
   * input field
   * @param {boolean} obj.selectorPasswordVisibilityTooltip
   */
  _setIconVisibility = ({
    iconVisibilityOn,
    iconVisibilityOff,
    passwordIsVisible,
    selectorPasswordVisibilityTooltip,
  }) => {
    if (passwordIsVisible) {
      iconVisibilityOn.setAttribute('hidden', true);
      iconVisibilityOff.removeAttribute('hidden');
      selectorPasswordVisibilityTooltip.textContent = 'Hide password';
      return;
    }
    iconVisibilityOn.removeAttribute('hidden');
    iconVisibilityOff.setAttribute('hidden', true);
    selectorPasswordVisibilityTooltip.textContent = 'Show password';
  };

  /**
   * Toggles the visibility of the password in the input field and changes the
   * SVG icon indicating password visibility
   * @param {object} obj - The elements that can change in the component
   * @param {HTMLElement} obj.element - The element functioning as a text field
   * @param {HTMLElement} obj.button - The button toggling password visibility
   */
  _toggle = ({ element, button }) => {
    // toggle action must come before querying the classList
    element.classList.toggle(this.options.passwordIsVisible);
    const passwordIsVisible = element.classList.contains(
      this.options.passwordIsVisible
    );
    const iconVisibilityOn = button.querySelector(
      this.options.svgIconVisibilityOn
    );
    const iconVisibilityOff = button.querySelector(
      this.options.svgIconVisibilityOff
    );
    const input = element.querySelector(this.options.selectorPasswordField);
    const selectorPasswordVisibilityTooltip = element.querySelector(
      this.options.selectorPasswordVisibilityTooltip
    );
    this._setIconVisibility({
      iconVisibilityOn,
      iconVisibilityOff,
      passwordIsVisible,
      selectorPasswordVisibilityTooltip,
    });
    input.type = passwordIsVisible ? 'text' : 'password';
  };

  /**
   * The component options.
   *
   * If `options` is specified in the constructor,
   * {@linkcode TextInput.create .create()},
   * or {@linkcode TextInput.init .init()},
   * properties in this object are overriden for the instance being
   * created and how {@linkcode TextInput.init .init()} works.
   * @property {string} selectorInit The CSS selector to find text input UIs.
   */
  static get options() {
    const { prefix } = settings;
    return {
      selectorInit: '[data-text-input]',
      selectorPasswordField: `.${prefix}--text-input[data-toggle-password-visibility]`,
      selectorPasswordVisibilityButton: `.${prefix}--text-input--password__visibility__toggle`,
      selectorPasswordVisibilityTooltip: `.${prefix}--text-input--password__visibility__toggle > .${prefix}--assistive-text`,
      passwordIsVisible: `${prefix}--text-input--password-visible`,
      svgIconVisibilityOn: `svg.${prefix}--icon--visibility-on`,
      svgIconVisibilityOff: `svg.${prefix}--icon--visibility-off`,
    };
  }

  /**
   * The map associating DOM element and text input UI instance.
   * @type {WeakMap}
   */
  static components /* #__PURE_CLASS_PROPERTY__ */ = new WeakMap();
}
