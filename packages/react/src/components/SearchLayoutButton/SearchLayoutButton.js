/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ListBulleted, Grid } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { warning } from '../../internal/warning';

const { prefix } = settings;

let didWarnAboutDeprecation = false;

/**
 * The layout button for `<Search>`.
 */
class SearchLayoutButton extends Component {
  state = { format: 'list' };

  static propTypes = {
    /**
     * The layout.
     */
    format: PropTypes.oneOf(['list', 'grid']),

    /**
     * The description for the "grid" icon.
     */
    iconDescriptionGrid: PropTypes.string,

    /**
     * The description for the "list" icon.
     */
    iconDescriptionList: PropTypes.string,

    /**
     * The a11y label text.
     */
    labelText: PropTypes.string,

    /**
     * The callback called when layout switches.
     */
    onChangeFormat: PropTypes.func,
  };

  static defaultProps = {
    labelText: 'Filter',
    iconDescriptionList: 'list',
    iconDescriptionGrid: 'grid',
  };

  static getDerivedStateFromProps({ format }, state) {
    const { prevFormat } = state;

    return prevFormat === format
      ? null
      : {
          format: format || 'list',
          prevFormat: format,
        };
  }

  constructor(props) {
    super(props);
    if (__DEV__) {
      warning(
        didWarnAboutDeprecation,
        'The SearchLayoutButton component has been deprecated and will be removed in the next major release of `carbon-components-react`'
      );
      didWarnAboutDeprecation = true;
    }
  }

  /**
   * Toggles the button state upon user-initiated event.
   */
  toggleLayout = () => {
    const format = this.state.format === 'list' ? 'grid' : 'list';
    this.setState({ format }, () => {
      const { onChangeFormat } = this.props;
      if (typeof onChangeFormat === 'function') {
        onChangeFormat({ format });
      }
    });
  };

  render() {
    const { labelText, iconDescriptionList, iconDescriptionGrid } = this.props;
    const SearchLayoutButtonIcon = () => {
      if (this.state.format === 'list') {
        return (
          <ListBulleted
            className={`${prefix}--search-view`}
            aria-label={iconDescriptionList}
          />
        );
      }
      return (
        <Grid
          className={`${prefix}--search-view`}
          aria-label={iconDescriptionGrid}
        />
      );
    };
    return (
      <button
        className={`${prefix}--search-button`}
        type="button"
        onClick={this.toggleLayout}
        aria-label={labelText}
        title={labelText}>
        <div className={`${prefix}--search__toggle-layout__container`}>
          <SearchLayoutButtonIcon />
        </div>
      </button>
    );
  }
}

export default SearchLayoutButton;
