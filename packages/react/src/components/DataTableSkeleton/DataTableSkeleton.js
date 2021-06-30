/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { settings } from 'carbon-components';

const { prefix } = settings;

const DataTableSkeleton = ({
  headers,
  rowCount,
  columnCount,
  zebra,
  compact,
  className,
  showHeader,
  showToolbar,
  ...rest
}) => {
  const dataTableSkeletonClasses = cx(className, {
    [`${prefix}--skeleton`]: true,
    [`${prefix}--data-table`]: true,
    [`${prefix}--data-table--zebra`]: zebra,
    [`${prefix}--data-table--compact`]: compact,
  });

  const rowRepeat = rowCount;
  const rows = Array(rowRepeat);
  const columnsArray = Array.from({ length: columnCount }, (_, index) => index);
  for (let i = 0; i < rowRepeat; i++) {
    rows[i] = (
      <tr key={i}>
        {columnsArray.map((j) => (
          <td key={j}>
            <span />
          </td>
        ))}
      </tr>
    );
  }

  return (
    <div className={`${prefix}--skeleton ${prefix}--data-table-container`}>
      {showHeader ? (
        <div className={`${prefix}--data-table-header`}>
          <div className={`${prefix}--data-table-header__title`}></div>
          <div className={`${prefix}--data-table-header__description`}></div>
        </div>
      ) : null}
      {showToolbar ? (
        <section
          aria-label="data table toolbar"
          className={`${prefix}--table-toolbar`}>
          <div className={`${prefix}--toolbar-content`}>
            <span
              className={`${prefix}--skeleton ${prefix}--btn ${prefix}--btn--sm`}></span>
          </div>
        </section>
      ) : null}
      <table className={dataTableSkeletonClasses} {...rest}>
        <thead>
          <tr>
            {columnsArray.map((i) => (
              <th key={i}>
                {headers ? (
                  <div className="bx--table-header-label">
                    {headers[i]?.header}
                  </div>
                ) : (
                  <span></span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

DataTableSkeleton.propTypes = {
  /**
   * Specify an optional className to add.
   */
  className: PropTypes.string,

  /**
   * Specify the number of columns that you want to render in the skeleton state
   */
  columnCount: PropTypes.number,

  /**
   * Optionally specify whether you want the Skeleton to be rendered as a
   * compact DataTable
   */
  compact: PropTypes.bool,

  /**
   * Optionally specify the displayed headers
   */
  headers: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      key: PropTypes.string,
    }),
  ]),

  /**
   * Specify the number of rows that you want to render in the skeleton state
   */
  rowCount: PropTypes.number,

  /**
   * Specify if the table header should be rendered as part of the skeleton.
   */
  showHeader: PropTypes.bool,

  /**
   * Specify if the table toolbar should be rendered as part of the skeleton.
   */
  showToolbar: PropTypes.bool,

  /**
   * Optionally specify whether you want the DataTable to be zebra striped
   */
  zebra: PropTypes.bool,
};

DataTableSkeleton.defaultProps = {
  rowCount: 5,
  columnCount: 5,
  zebra: false,
  compact: false,
  showHeader: true,
  showToolbar: true,
};

export default DataTableSkeleton;
