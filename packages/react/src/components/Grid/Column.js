/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useFeatureFlag } from '../FeatureFlags';

const { prefix } = settings;

function Column({
  as: BaseComponent = 'div',
  children,
  className: containerClassName,
  sm,
  md,
  lg,
  xlg,
  max,
  ...rest
}) {
  const hasCSSGrid = useFeatureFlag('enable-css-grid');
  const columnClassName = hasCSSGrid
    ? getClassNameForBreakpoints([sm, md, lg, xlg, max])
    : getClassNameForFlexGridBreakpoints([sm, md, lg, xlg, max]);

  const className = cx(containerClassName, columnClassName, {
    [`${prefix}--col`]: columnClassName.length === 0,
  });

  return (
    <BaseComponent className={className} {...rest}>
      {children}
    </BaseComponent>
  );
}

const spanPropType = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.shape({
    span: PropTypes.number,
    offset: PropTypes.number,
  }),
]);

Column.propTypes = {
  /**
   * Provide a custom element to render instead of the default <div>
   */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

  /**
   * Pass in content that will be rendered within the `Column`
   */
  children: PropTypes.node,

  /**
   * Specify a custom className to be applied to the `Column`
   */
  className: PropTypes.string,

  /**
   * Specify column span for the `lg` breakpoint (Default breakpoint up to 1312px)
   * This breakpoint supports 16 columns by default.
   *
   * @see https://www.carbondesignsystem.com/guidelines/layout#breakpoints
   */
  lg: spanPropType,

  /**
   * Specify column span for the `max` breakpoint. This breakpoint supports 16
   * columns by default.
   *
   * @see https://www.carbondesignsystem.com/guidelines/layout#breakpoints
   */
  max: spanPropType,

  /**
   * Specify column span for the `md` breakpoint (Default breakpoint up to 1056px)
   * This breakpoint supports 8 columns by default.
   *
   * @see https://www.carbondesignsystem.com/guidelines/layout#breakpoints
   */
  md: spanPropType,

  /**
   * Specify column span for the `sm` breakpoint (Default breakpoint up to 672px)
   * This breakpoint supports 4 columns by default.
   *
   * @see https://www.carbondesignsystem.com/guidelines/layout#breakpoints
   */
  sm: spanPropType,

  /**
   * Specify column span for the `xlg` breakpoint (Default breakpoint up to
   * 1584px) This breakpoint supports 16 columns by default.
   *
   * @see https://www.carbondesignsystem.com/guidelines/layout#breakpoints
   */
  xlg: spanPropType,
};

const breakpointNames = ['sm', 'md', 'lg', 'xlg', 'max'];

/**
 * @typedef {object} Breakpoint
 * @property {boolean|number} [span]
 * @property {number} [offset]
 */

/**
 * Build the appropriate className for the given set of breakpoints.
 * @param {Array<boolean|number|Breakpoint>} breakpoints
 * @returns {string}
 */
function getClassNameForBreakpoints(breakpoints) {
  const classNames = [];

  for (let i = 0; i < breakpoints.length; i++) {
    const breakpoint = breakpoints[i];
    if (breakpoint === undefined || breakpoint === null) {
      continue;
    }

    const name = breakpointNames[i];

    // If our breakpoint is a boolean, the user has specified that the column
    // should be "auto" at this size
    if (breakpoint === true) {
      classNames.push(`${prefix}--${name}:col-span-auto`);
      continue;
    }

    // If our breakpoint is a number, the user has specified the number of
    // columns they'd like this column to span
    if (typeof breakpoint === 'number') {
      classNames.push(`${prefix}--${name}:col-span-${breakpoint}`);
      continue;
    }

    const { span, offset } = breakpoint;

    if (typeof offset === 'number' && offset > 0) {
      classNames.push(`${prefix}--${name}:col-start-${offset + 1}`);
    }

    if (typeof span === 'number') {
      if (typeof offset === 'number' && offset > 0) {
        classNames.push(`${prefix}--${name}:col-end-${offset + span + 1}`);
      } else {
        classNames.push(`${prefix}--${name}:col-span-${span}`);
      }
    }

    if (span === true) {
      classNames.push(`${prefix}--${name}:col-span-auto`);
    }
  }

  return classNames.join(' ');
}

/**
 * Build the appropriate className for the given set of breakpoints.
 * @param {Array<boolean|number|Breakpoint>} breakpoints
 * @returns {string}
 */
function getClassNameForFlexGridBreakpoints(breakpoints) {
  const classNames = [];

  for (let i = 0; i < breakpoints.length; i++) {
    const breakpoint = breakpoints[i];
    if (breakpoint === undefined || breakpoint === null) {
      continue;
    }

    const name = breakpointNames[i];

    // If our breakpoint is a boolean, the user has specified that the column
    // should be "auto" at this size
    if (breakpoint === true) {
      classNames.push(`${prefix}--col-${name}`);
      continue;
    }

    // If our breakpoint is a number, the user has specified the number of
    // columns they'd like this column to span
    if (typeof breakpoint === 'number') {
      classNames.push(`${prefix}--col-${name}-${breakpoint}`);
      continue;
    }

    const { span, offset } = breakpoint;
    if (typeof span === 'number') {
      classNames.push(`${prefix}--col-${name}-${span}`);
    }

    if (span === true) {
      classNames.push(`${prefix}--col-${name}`);
    }

    if (typeof offset === 'number') {
      classNames.push(`${prefix}--offset-${name}-${offset}`);
    }
  }

  return classNames.join(' ');
}

export default Column;
