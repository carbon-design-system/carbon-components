/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { settings } from 'carbon-components';
import {
  ArrowUp as Arrow,
  ArrowsVertical as Arrows,
} from '@carbon/icons-react/next';
import { sortStates } from './state/sorting';
import { useId } from '../../internal/useId';

const { prefix } = settings;

const translationKeys = {
  buttonDescription: 'carbon.table.header.icon.description',
};

const translateWithId = (
  key,
  { header, sortDirection, isSortHeader, sortStates }
) => {
  if (key === translationKeys.buttonDescription) {
    if (isSortHeader) {
      // When transitioning, we know that the sequence of states is as follows:
      // NONE -> ASC -> DESC -> NONE
      if (sortDirection === sortStates.NONE) {
        return `Click to sort rows by ${header} header in ascending order`;
      }
      if (sortDirection === sortStates.ASC) {
        return `Click to sort rows by ${header} header in descending order`;
      }

      return `Click to unsort rows by ${header} header`;
    }
    return `Click to sort rows by ${header} header in ascending order`;
  }

  return '';
};

const sortDirections = {
  [sortStates.NONE]: 'none',
  [sortStates.ASC]: 'ascending',
  [sortStates.DESC]: 'descending',
};

const TableHeader = React.forwardRef(function TableHeader(
  {
    className: headerClassName,
    children,
    colSpan,
    isSortable,
    isSortHeader,
    onClick,
    scope,
    sortDirection,
    translateWithId: t,
    ...rest
  },
  ref
) {
  const uniqueId = useId('table-sort');

  if (!isSortable) {
    return (
      <th
        {...rest}
        className={headerClassName}
        scope={scope}
        colSpan={colSpan}
        ref={ref}>
        {children ? (
          <div className={`${prefix}--table-header-label`}>{children}</div>
        ) : null}
      </th>
    );
  }

  const className = cx(headerClassName, {
    [`${prefix}--table-sort`]: true,
    [`${prefix}--table-sort--active`]:
      isSortHeader && sortDirection !== sortStates.NONE,
    [`${prefix}--table-sort--ascending`]:
      isSortHeader && sortDirection === sortStates.DESC,
  });
  const ariaSort = !isSortHeader ? 'none' : sortDirections[sortDirection];
  const sortDescription = t('carbon.table.header.icon.description', {
    header: children,
    sortDirection,
    isSortHeader,
    sortStates,
  });

  return (
    <th
      aria-sort={ariaSort}
      className={headerClassName}
      colSpan={colSpan}
      ref={ref}
      scope={scope}>
      <div style={{ display: 'none' }} id={uniqueId}>
        {sortDescription}
      </div>
      <button
        type="button"
        aria-describedby={uniqueId}
        className={className}
        onClick={onClick}
        {...rest}>
        <span className={`${prefix}--table-sort__flex`}>
          <div className={`${prefix}--table-header-label`}>{children}</div>
          <Arrow size={20} className={`${prefix}--table-sort__icon`} />
          <Arrows
            size={20}
            className={`${prefix}--table-sort__icon-unsorted`}
          />
        </span>
      </button>
    </th>
  );
});

TableHeader.propTypes = {
  /**
   * Pass in children that will be embedded in the table header label
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify `colSpan` as a non-negative integer value to indicate how
   * many columns the TableHeader cell extends in a table
   */
  colSpan: PropTypes.number,

  /**
   * Specify whether this header is the header by which a table is being sorted
   * by
   */
  isSortHeader: PropTypes.bool,

  /**
   * Specify whether this header is one through which a user can sort the table
   */
  isSortable: PropTypes.bool,

  /**
   * Hook that is invoked when the header is clicked
   */
  onClick: PropTypes.func,

  /**
   * Specify the scope of this table header. You can find more info about this
   * attribute at the following URL:
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope
   */
  scope: PropTypes.string.isRequired,

  /**
   * Specify which direction we are currently sorting by, should be one of DESC,
   * NONE, or ASC.
   */
  sortDirection: PropTypes.oneOf(Object.values(sortStates)),

  /**
   * Supply a method to translate internal strings with your i18n tool of
   * choice. Translation keys are avabile on the `translationKeys` field for
   * this component.
   */
  translateWithId: PropTypes.func,
};

TableHeader.defaultProps = {
  isSortable: false,
  scope: 'col',
  translateWithId,
};

TableHeader.translationKeys = Object.values(translationKeys);

TableHeader.displayName = 'TableHeader';

export default TableHeader;
