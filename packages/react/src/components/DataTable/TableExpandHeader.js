/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import requiredIfGivenPropIsTruthy from '../../prop-types/requiredIfGivenPropIsTruthy';
import React from 'react';
import { ChevronRight } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';

const { prefix } = settings;

const TableExpandHeader = ({
  ariaLabel,
  className: headerClassName,
  enableExpando,
  isExpanded,
  onExpand,
  expandIconDescription,
  children,
  ...rest
}) => {
  const className = cx(`${prefix}--table-expand`, headerClassName);
  const previousValue = isExpanded ? 'collapsed' : undefined;

  return (
    <th
      scope="col"
      className={className}
      data-previous-value={previousValue}
      {...rest}>
      {!enableExpando ? null : (
        <button
          type="button"
          className={`${prefix}--table-expand__button`}
          onClick={onExpand}
          title={expandIconDescription}
          aria-label={ariaLabel}>
          <ChevronRight
            className={`${prefix}--table-expand__svg`}
            aria-label={expandIconDescription}
          />
        </button>
      )}
      {children}
    </th>
  );
};

TableExpandHeader.propTypes = {
  /**
   * Specify the string read by a voice reader when the expand trigger is
   * focused
   */
  ariaLabel: requiredIfGivenPropIsTruthy('enableExpando', PropTypes.string),
  children: PropTypes.node,

  className: PropTypes.string,

  /**
   * Specify whether an expand all button should be displayed
   */
  enableExpando: PropTypes.bool,

  /**
   * The description of the chevron right icon, to be put in its SVG `<title>` element.
   */
  expandIconDescription: PropTypes.string,

  /**
   * Specify whether this row is expanded or not. This helps coordinate data
   * attributes so that `TableExpandRow` and `TableExapndedRow` work together
   */
  isExpanded: requiredIfGivenPropIsTruthy('enableExpando', PropTypes.bool),

  /**
   * Hook for when a listener initiates a request to expand the given row
   */
  onExpand: requiredIfGivenPropIsTruthy('enableExpando', PropTypes.func),
};

export default TableExpandHeader;
