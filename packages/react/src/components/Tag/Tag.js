/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { Close } from '@carbon/icons-react/next';
import setupGetInstanceId from '../../tools/setupGetInstanceId';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();
const TYPES = {
  red: 'Red',
  magenta: 'Magenta',
  purple: 'Purple',
  blue: 'Blue',
  cyan: 'Cyan',
  teal: 'Teal',
  green: 'Green',
  gray: 'Gray',
  'cool-gray': 'Cool-Gray',
  'warm-gray': 'Warm-Gray',
  'high-contrast': 'High-Contrast',
};

const Tag = ({
  children,
  className,
  id,
  type,
  filter,
  renderIcon: CustomIconElement,
  title,
  disabled,
  onClose,
  size,
  ...other
}) => {
  const tagId = id || `tag-${getInstanceId()}`;
  const tagClasses = classNames(`${prefix}--tag`, className, {
    [`${prefix}--tag--disabled`]: disabled,
    [`${prefix}--tag--filter`]: filter,
    [`${prefix}--tag--${size}`]: size,
    [`${prefix}--tag--${type}`]: type,
    [`${prefix}--tag--interactive`]: other.onClick && !filter,
  });
  const handleClose = (event) => {
    if (onClose) {
      event.stopPropagation();
      onClose(event);
    }
  };

  if (filter) {
    return (
      <div
        className={tagClasses}
        aria-label={
          title !== undefined
            ? `${title} ${children}`
            : `Clear filter ${children}`
        }
        id={tagId}
        {...other}>
        <span
          className={`${prefix}--tag__label`}
          title={typeof children === 'string' ? children : null}>
          {children !== null && children !== undefined ? children : TYPES[type]}
        </span>
        <button
          type="button"
          className={`${prefix}--tag__close-icon`}
          onClick={handleClose}
          disabled={disabled}
          aria-labelledby={tagId}
          title={title}>
          <Close />
        </button>
      </div>
    );
  }

  const ComponentTag = other.onClick ? 'button' : 'div';

  return (
    <ComponentTag
      disabled={ComponentTag === 'button' ? disabled : null}
      className={tagClasses}
      id={tagId}
      {...other}>
      {CustomIconElement ? (
        <div className={`${prefix}--tag__custom-icon`}>
          <CustomIconElement />
        </div>
      ) : (
        ''
      )}
      <span title={typeof children === 'string' ? children : null}>
        {children !== null && children !== undefined ? children : TYPES[type]}
      </span>
    </ComponentTag>
  );
};

Tag.propTypes = {
  /**
   * Provide content to be rendered inside of a <Tag>
   */
  children: PropTypes.node,

  /**
   * Provide a custom className that is applied to the containing <span>
   */
  className: PropTypes.string,

  /**
   * Specify if the <Tag> is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Determine if <Tag> is a filter/chip
   */
  filter: PropTypes.bool,

  /**
   * Specify the id for the tag.
   */
  id: PropTypes.string,

  /**
   * Click handler for filter tag close button.
   */
  onClose: PropTypes.func,

  /**
   * Optional prop to render a custom icon.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Specify the size of the Tag. Currently supports either `sm` or
   * 'md' (default) sizes.
   */
  size: PropTypes.oneOf(['sm', 'md']),

  /**
   * Text to show on clear filters
   */
  title: PropTypes.string,

  /**
   * Specify the type of the <Tag>
   */
  type: PropTypes.oneOf(Object.keys(TYPES)),
};

export const types = Object.keys(TYPES);
export default Tag;
