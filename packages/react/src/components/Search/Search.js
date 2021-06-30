/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Search as SearchIcon, Close } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import { composeEventHandlers } from '../../tools/events';
import { keys, match } from '../../internal/keyboard';
import deprecate from '../../prop-types/deprecate';
import { FeatureFlagContext } from '../FeatureFlags';

const { prefix } = settings;

export default class Search extends Component {
  static propTypes = {
    /**
     * Specify an optional className to be applied to the container node
     */
    className: PropTypes.string,

    /**
     * Specify a label to be read by screen readers on the "close" button
     */
    closeButtonLabelText: PropTypes.string,

    /**
     * Optionally provide the default value of the `<input>`
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Specify whether the `<input>` should be disabled
     */
    disabled: PropTypes.bool,

    /**
     * Specify a custom `id` for the input
     */
    id: PropTypes.string,

    /**
     * Provide the label text for the Search icon
     */
    labelText: PropTypes.node.isRequired,

    /**
     * Specify light version or default version of this control
     */
    light: PropTypes.bool,

    /**
     * Optional callback called when the search value changes.
     */
    onChange: PropTypes.func,

    /**
     * Provide a handler that is invoked on the key down event for the input
     */
    onKeyDown: PropTypes.func,

    /**
     * Deprecated in favor of `placeholder`
     */
    placeHolderText: deprecate(
      PropTypes.string,
      `\nThe prop \`placeHolderText\` for Search has been deprecated in favor of \`placeholder\`. Please use \`placeholder\` instead.`
    ),

    /**
     * Provide an optional placeholder text for the Search.
     * Note: if the label and placeholder differ,
     * VoiceOver on Mac will read both
     */
    placeholder: PropTypes.string,

    /**
     * Rendered icon for the Search.
     * Can be a React component class
     */
    renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    /**
     * Specify the search size
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),

    /**
     * Specify whether the Search should be a small variant
     */

    /**
     * Specify whether the load was successful
     */
    small: deprecate(
      PropTypes.bool,
      `\nThe prop \`small\` for Search has been deprecated in favor of \`size\`. Please use \`size="sm"\` instead.`
    ),

    /**
     * Optional prop to specify the type of the `<input>`
     */
    type: PropTypes.string,

    /**
     * Specify the value of the `<input>`
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static contextType = FeatureFlagContext;

  static defaultProps = {
    type: 'text',
    placeholder: '',
    closeButtonLabelText: 'Clear search input',
    onChange: () => {},
  };

  state = {
    hasContent: this.props.value || this.props.defaultValue || false,
    prevValue: this.props.value,
  };

  static getDerivedStateFromProps({ value }, state) {
    const { prevValue } = state;
    return prevValue === value
      ? null
      : {
          hasContent: !!value,
          prevValue: value,
        };
  }

  clearInput = (evt) => {
    if (!this.props.value) {
      this.input.value = '';
      this.props.onChange(evt);
    } else {
      const clearedEvt = Object.assign({}, evt.target, {
        target: {
          value: '',
        },
      });
      this.props.onChange(clearedEvt);
    }

    this.setState({ hasContent: false }, () => this.input.focus());
  };

  handleChange = (evt) => {
    this.setState({
      hasContent: evt.target.value !== '',
    });
  };

  handleKeyDown = (evt) => {
    if (match(evt, keys.Escape)) {
      this.clearInput(evt);
    }
  };

  render() {
    const {
      className,
      type,
      id = (this._inputId =
        this._inputId ||
        `search__input__id_${Math.random().toString(36).substr(2)}`),
      placeHolderText,
      placeholder,
      labelText,
      closeButtonLabelText,
      small,
      size = !small ? 'xl' : 'sm',
      light,
      disabled,
      onChange,
      onKeyDown,
      renderIcon,
      ...other
    } = this.props;

    const { hasContent } = this.state;

    const scope = this.context;
    let enabled;

    if (scope.enabled) {
      enabled = scope.enabled('enable-v11-release');
    }

    const searchClasses = classNames({
      [`${prefix}--search`]: true,
      [`${prefix}--search--sm`]: size === 'sm',
      // V11: change to md
      [`${prefix}--search--lg`]: enabled ? size === 'md' : size === 'lg',
      // V11: change to lg
      [`${prefix}--search--xl`]: enabled ? size === 'lg' : size === 'xl',
      [`${prefix}--search--light`]: light,
      [`${prefix}--search--disabled`]: disabled,
      [className]: className,
    });

    const clearClasses = classNames({
      [`${prefix}--search-close`]: true,
      [`${prefix}--search-close--hidden`]: !hasContent,
    });

    const searchId = `${id}-search`;
    const searchIcon = renderIcon ? (
      renderIcon
    ) : (
      <SearchIcon className={`${prefix}--search-magnifier-icon`} />
    );

    return (
      <div role="search" aria-labelledby={searchId} className={searchClasses}>
        <div
          className={`${prefix}--search-magnifier`}
          ref={(magnifier) => {
            this.magnifier = magnifier;
          }}>
          {searchIcon}
        </div>
        <label id={searchId} htmlFor={id} className={`${prefix}--label`}>
          {labelText}
        </label>
        <input
          role="searchbox"
          autoComplete="off"
          {...other}
          type={type}
          disabled={disabled}
          className={`${prefix}--search-input`}
          id={id}
          placeholder={placeHolderText || placeholder}
          onChange={composeEventHandlers([onChange, this.handleChange])}
          onKeyDown={composeEventHandlers([onKeyDown, this.handleKeyDown])}
          ref={(input) => {
            this.input = input;
          }}
        />
        <button
          className={clearClasses}
          disabled={disabled}
          onClick={this.clearInput}
          type="button"
          aria-label={closeButtonLabelText}>
          <Close />
        </button>
      </div>
    );
  }
}
