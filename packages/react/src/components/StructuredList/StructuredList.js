/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import setupGetInstanceId from '../../tools/setupGetInstanceId';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();

export function StructuredListWrapper(props) {
  const {
    children,
    selection,
    className,
    ariaLabel,
    isCondensed,
    isFlush,
    border: _border,
    ...other
  } = props;
  const classes = classNames(`${prefix}--structured-list`, className, {
    [`${prefix}--structured-list--selection`]: selection,
    [`${prefix}--structured-list--condensed`]: isCondensed,
    [`${prefix}--structured-list--flush`]: isFlush,
  });

  return (
    <div role="table" className={classes} {...other} aria-label={ariaLabel}>
      {children}
    </div>
  );
}

StructuredListWrapper.propTypes = {
  /**
   * Specify a label to be read by screen readers on the container node
   */
  ariaLabel: PropTypes.string,

  /**
   * Specify whether a border should be added to your StructuredListWrapper
   */
  border: deprecate(
    PropTypes.bool,
    `\nThe prop \`border\` will be removed in the next major version of Carbon.`
  ),

  /**
   * Provide the contents of your StructuredListWrapper
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify if structured list is condensed, default is false
   */
  isCondensed: PropTypes.bool,

  /**
   * Specify if structured list is flush, default is false
   */
  isFlush: PropTypes.bool,

  /**
   * Specify whether your StructuredListWrapper should have selections
   */
  selection: PropTypes.bool,
};

StructuredListWrapper.defaultProps = {
  selection: false,
  ariaLabel: 'Structured list section',
  isCondensed: false,
  isFlush: false,
};

export function StructuredListHead(props) {
  const { children, className, ...other } = props;
  const classes = classNames(`${prefix}--structured-list-thead`, className);

  return (
    <div role="rowgroup" className={classes} {...other}>
      {children}
    </div>
  );
}

StructuredListHead.propTypes = {
  /**
   * Provide the contents of your StructuredListHead
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the node
   */
  className: PropTypes.string,
};

export function StructuredListBody(props) {
  const { children, className, ...other } = props;
  const classes = classNames(`${prefix}--structured-list-tbody`, className);

  return (
    <div className={classes} role="rowgroup" {...other}>
      {children}
    </div>
  );
}

StructuredListBody.propTypes = {
  /**
   * Provide the contents of your StructuredListBody
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  head: PropTypes.bool,

  /**
   * Provide a handler that is invoked on the key down event for the control
   */
  onKeyDown: PropTypes.func,
};

StructuredListBody.defaultProps = {
  onKeyDown: () => {},
};

export function StructuredListRow(props) {
  const {
    onKeyDown,
    tabIndex,
    children,
    className,
    head,
    label,
    ...other
  } = props;
  const classes = classNames(`${prefix}--structured-list-row`, className, {
    [`${prefix}--structured-list-row--header-row`]: head,
  });

  return label ? (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label
      {...other}
      tabIndex={tabIndex}
      className={classes}
      onKeyDown={onKeyDown}>
      {children}
    </label>
  ) : (
    <div role="row" {...other} className={classes}>
      {children}
    </div>
  );
}

StructuredListRow.propTypes = {
  /**
   * Provide the contents of your StructuredListRow
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify whether your StructuredListRow should be used as a header row
   */
  head: PropTypes.bool,

  /**
   * Specify whether a `<label>` should be used
   */
  label: PropTypes.bool,

  /**
   * Provide a handler that is invoked on the key down event for the control,
   * if `<label>` is in use
   */
  onKeyDown: PropTypes.func,

  /**
   * Specify the tab index of the container node, if `<label>` is in use
   */
  tabIndex: PropTypes.number,
};

StructuredListRow.defaultProps = {
  head: false,
  label: false,
  tabIndex: 0,
  onKeyDown: () => {},
};

export function StructuredListInput(props) {
  const { className, value, name, title, id, ...other } = props;
  const classes = classNames(`${prefix}--structured-list-input`, className);
  const instanceId = id || getInstanceId();

  return (
    <input
      {...other}
      type="radio"
      tabIndex={-1}
      id={instanceId}
      className={classes}
      value={value}
      name={name}
      title={title}
    />
  );
}

StructuredListInput.propTypes = {
  /**
   * Specify an optional className to be applied to the input
   */
  className: PropTypes.string,

  /**
   * Specify whether the underlying input should be checked by default
   */
  defaultChecked: PropTypes.bool,

  /**
   * Specify a custom `id` for the input
   */
  id: PropTypes.string,

  /**
   * Provide a `name` for the input
   */
  name: PropTypes.string,

  /**
   * Provide an optional hook that is called each time the input is updated
   */
  onChange: PropTypes.func,

  /**
   * Provide a `title` for the input
   */
  title: PropTypes.string,

  /**
   * Specify the value of the input
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

StructuredListInput.defaultProps = {
  onChange: () => {},
  value: 'value',
  title: 'title',
};

export function StructuredListCell(props) {
  const { children, className, head, noWrap, ...other } = props;
  const classes = classNames(className, {
    [`${prefix}--structured-list-th`]: head,
    [`${prefix}--structured-list-td`]: !head,
    [`${prefix}--structured-list-content--nowrap`]: noWrap,
  });

  return (
    <div className={classes} role={head ? 'columnheader' : 'cell'} {...other}>
      {children}
    </div>
  );
}

StructuredListCell.propTypes = {
  /**
   * Provide the contents of your StructuredListCell
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify whether your StructuredListCell should be used as a header cell
   */
  head: PropTypes.bool,

  /**
   * Specify whether your StructuredListCell should have text wrapping
   */
  noWrap: PropTypes.bool,
};

StructuredListCell.defaultProps = {
  head: false,
  noWrap: false,
};
