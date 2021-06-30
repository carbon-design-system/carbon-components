/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import debounce from 'lodash.debounce';
import setupGetInstanceId from '../../tools/setupGetInstanceId';
import { composeEventHandlers } from '../../tools/events';
import { keys, matches } from '../../internal/keyboard';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();
const TooltipDefinition = ({
  id,
  className,
  triggerClassName,
  children,
  direction,
  align,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  tooltipText,
  ...rest
}) => {
  const [allowTooltipVisibility, setAllowTooltipVisibility] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipId = id || `definition-tooltip-${getInstanceId()}`;
  const tooltipClassName = cx(
    `${prefix}--tooltip--definition`,
    `${prefix}--tooltip--a11y`,
    className
  );
  const tooltipTriggerClasses = cx(
    `${prefix}--tooltip__trigger`,
    `${prefix}--tooltip--a11y`,
    `${prefix}--tooltip__trigger--definition`,
    triggerClassName,
    {
      [`${prefix}--tooltip--${direction}`]: direction,
      [`${prefix}--tooltip--align-${align}`]: align,
      [`${prefix}--tooltip--hidden`]: !allowTooltipVisibility,
      [`${prefix}--tooltip--visible`]: tooltipVisible,
    }
  );

  const debounceTooltipVisible = debounce(() => setTooltipVisible(false), 100);

  const handleFocus = () => {
    debounceTooltipVisible.cancel();
    setAllowTooltipVisibility(true);
    setTooltipVisible(true);
  };

  const handleBlur = debounceTooltipVisible;

  const handleMouseEnter = () => {
    debounceTooltipVisible.cancel();
    setAllowTooltipVisibility(true);
    setTooltipVisible(true);
  };

  const handleMouseLeave = debounceTooltipVisible;

  useEffect(() => {
    const handleEscKeyDown = (event) => {
      if (matches(event, [keys.Escape])) {
        setAllowTooltipVisibility(false);
      }
    };
    document.addEventListener('keydown', handleEscKeyDown);
    return () => document.removeEventListener('keydown', handleEscKeyDown);
  }, []);

  return (
    <span
      {...rest}
      className={tooltipClassName}
      onMouseEnter={composeEventHandlers([onMouseEnter, handleMouseEnter])}
      onMouseLeave={composeEventHandlers([onMouseLeave, handleMouseLeave])}>
      <button
        type="button"
        className={tooltipTriggerClasses}
        aria-describedby={tooltipId}
        onFocus={composeEventHandlers([onFocus, handleFocus])}
        onBlur={composeEventHandlers([onBlur, handleBlur])}>
        {children}
      </button>
      <span
        className={`${prefix}--assistive-text`}
        id={tooltipId}
        role="tooltip">
        {tooltipText}
      </span>
    </span>
  );
};

TooltipDefinition.propTypes = {
  /**
   * Specify the alignment (to the trigger button) of the tooltip.
   * Can be one of: start, center, or end.
   */
  align: PropTypes.oneOf(['start', 'center', 'end']),

  /**
   * Specify the tooltip trigger text that is rendered to the UI for the user to
   * interact with in order to display the tooltip.
   */
  children: PropTypes.node.isRequired,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify the direction of the tooltip. Can be either top or bottom.
   */
  direction: PropTypes.oneOf(['top', 'bottom']),

  /**
   * Optionally specify a custom id for the tooltip. If one is not provided, we
   * generate a unique id for you.
   */
  id: PropTypes.string,

  /**
   * The event handler for the `blur` event.
   */
  onBlur: PropTypes.func,

  /**
   * The event handler for the `focus` event.
   */
  onFocus: PropTypes.func,

  /**
   * The event handler for the `mouseenter` event.
   */
  onMouseEnter: PropTypes.func,

  /**
   * The event handler for the `mouseleave` event.
   */
  onMouseLeave: PropTypes.func,

  /**
   * Provide the text that will be displayed in the tooltip when it is rendered.
   * TODO: rename this prop (will be a breaking change)
   */
  tooltipText: PropTypes.node.isRequired,

  /**
   * The CSS class name of the trigger element
   */
  triggerClassName: PropTypes.string,
};

TooltipDefinition.defaultProps = {
  direction: 'bottom',
  align: 'start',
};

export default TooltipDefinition;
