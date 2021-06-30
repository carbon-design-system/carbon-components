/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Filter } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import PropTypes from 'prop-types';
import React from 'react';
import { warning } from '../../internal/warning';

const { prefix } = settings;

let didWarnAboutDeprecation = false;

/**
 * The filter button for `<Search>`.
 */
const SearchFilterButton = ({ labelText, iconDescription, ...other }) => {
  if (__DEV__) {
    warning(
      didWarnAboutDeprecation,
      'The SearchFilterButton component has been deprecated and will be removed in the next major release of `carbon-components-react`'
    );
    didWarnAboutDeprecation = true;
  }
  return (
    <button
      className={`${prefix}--search-button`}
      type="button"
      aria-label={labelText}
      title={labelText}
      {...other}>
      <Filter
        className={`${prefix}--search-filter`}
        aria-label={iconDescription}
      />
    </button>
  );
};

SearchFilterButton.propTypes = {
  /**
   * The icon description.
   */
  iconDescription: PropTypes.string,

  /**
   * The a11y label text.
   */
  labelText: PropTypes.string,
};

SearchFilterButton.defaultProps = {
  labelText: 'Search',
  iconDescription: 'filter',
};

export default SearchFilterButton;
