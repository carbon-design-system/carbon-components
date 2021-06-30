/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Search } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import ClickListener from '../../internal/ClickListener';
import { warning } from '../../internal/warning';

const { prefix } = settings;

let didWarnAboutDeprecation = false;

export default class ToolbarSearch extends Component {
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
     * The ID of the `<input>`.
     */
    id: PropTypes.string,

    /**
     * The ID of the `<label>`.
     */
    labelId: PropTypes.string,

    /**
     * The text in the `<label>`.
     */
    labelText: PropTypes.node,

    /**
     * The placeholder text of the `<input>`.
     */
    placeHolderText: PropTypes.string,

    /**
     * Optional prop to specify the role of the ToolbarSearch
     */
    role: PropTypes.string,

    /**
     * `true` to use the small version of the UI.
     */
    small: PropTypes.bool,

    /**
     * The `type` of the `<input>`.
     */
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'search',
    id: 'search__input',
    labelText: '',
    placeHolderText: '',
    role: 'search',
    labelId: 'search__label',
  };

  constructor(props) {
    super(props);
    if (__DEV__) {
      warning(
        didWarnAboutDeprecation,
        'The ToolbarSearch component has been deprecated and will be removed in the next major release of `carbon-components-react`'
      );
      didWarnAboutDeprecation = true;
    }
  }

  state = {
    expanded: false,
  };

  expandSearch = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
    this.input.focus();
  };

  handleClickOutside = () => {
    this.setState({
      expanded: false,
    });
  };

  render() {
    const {
      className,
      type,
      id,
      placeHolderText,
      labelText,
      role,
      labelId,
      ...other
    } = this.props;

    const searchClasses = classNames({
      [`${prefix}--search ${prefix}--search--sm ${prefix}--toolbar-search`]: true,
      [`${prefix}--toolbar-search--active`]: this.state.expanded,
      [className]: className,
    });

    return (
      <ClickListener onClickOutside={this.handleClickOutside}>
        <div className={searchClasses} role={role}>
          <label htmlFor={id} className={`${prefix}--label`} id={labelId}>
            {labelText}
          </label>
          <input
            {...other}
            type={type}
            className={`${prefix}--search-input`}
            id={id}
            aria-labelledby={labelId}
            placeholder={placeHolderText}
            ref={(input) => {
              this.input = input;
            }}
          />
          <button
            type="button"
            className={`${prefix}--toolbar-search__btn`}
            title={labelText}
            onClick={this.expandSearch}>
            <Search
              className={`${prefix}--search-magnifier`}
              aria-label={labelText}
            />
          </button>
        </div>
      </ClickListener>
    );
  }
}
