/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { ButtonKinds } from '../../prop-types/types';
import deprecate from '../../prop-types/deprecate';
import { composeEventHandlers } from '../../tools/events';
import { keys, matches } from '../../internal/keyboard';
import { useId } from '../../internal/useId';
import toggleClass from '../../tools/toggleClass';
import { useFeatureFlag } from '../FeatureFlags';

const { prefix } = settings;
const Button = React.forwardRef(function Button(
  {
    children,
    as,
    className,
    disabled,
    small,
    size,
    kind,
    href,
    isExpressive,
    isSelected,
    tabIndex,
    type,
    renderIcon: ButtonImageElement,
    dangerDescription,
    iconDescription,
    hasIconOnly,
    tooltipPosition,
    tooltipAlignment,
    onClick,
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    ...other
  },
  ref
) {
  const [allowTooltipVisibility, setAllowTooltipVisibility] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const tooltipRef = useRef(null);
  const tooltipTimeout = useRef(null);

  const closeTooltips = (evt) => {
    const tooltipNode = document?.querySelectorAll(`.${prefix}--tooltip--a11y`);
    [...tooltipNode].map((node) => {
      toggleClass(
        node,
        `${prefix}--tooltip--hidden`,
        node !== evt.currentTarget
      );
    });
  };

  const handleFocus = (evt) => {
    if (hasIconOnly) {
      closeTooltips(evt);
      setIsHovered(!isHovered);
      setIsFocused(true);
      setAllowTooltipVisibility(true);
    }
  };

  const handleBlur = () => {
    if (hasIconOnly) {
      setIsHovered(false);
      setIsFocused(false);
      setAllowTooltipVisibility(false);
    }
  };

  const handleMouseEnter = (evt) => {
    if (hasIconOnly) {
      setIsHovered(true);
      tooltipTimeout.current && clearTimeout(tooltipTimeout.current);

      if (evt.target === tooltipRef.current) {
        setAllowTooltipVisibility(true);
        return;
      }

      closeTooltips(evt);

      setAllowTooltipVisibility(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isFocused && hasIconOnly) {
      tooltipTimeout.current = setTimeout(() => {
        setAllowTooltipVisibility(false);
        setIsHovered(false);
      }, 100);
    }
  };

  const handleClick = (evt) => {
    // Prevent clicks on the tooltip from triggering the button click event
    if (evt.target === tooltipRef.current) {
      evt.preventDefault();
      return;
    }
  };

  useEffect(() => {
    const handleEscKeyDown = (event) => {
      if (matches(event, [keys.Escape])) {
        setAllowTooltipVisibility(false);
        setIsHovered(false);
      }
    };
    document.addEventListener('keydown', handleEscKeyDown);
    return () => document.removeEventListener('keydown', handleEscKeyDown);
  }, []);

  const enabled = useFeatureFlag('enable-v11-release');

  const buttonClasses = classNames(className, {
    [`${prefix}--btn`]: true,
    [`${prefix}--btn--sm`]:
      (size === 'small' && !isExpressive) ||
      (size === 'sm' && !isExpressive) ||
      (small && !isExpressive),
    [`${prefix}--btn--md`]:
      (size === 'field' && !isExpressive) || (size === 'md' && !isExpressive),
    // V11: change lg to xl
    [`${prefix}--btn--lg`]: enabled ? size === 'xl' : size === 'lg',
    // V11: change xl to 2xl
    [`${prefix}--btn--xl`]: enabled ? size === '2xl' : size === 'xl',
    [`${prefix}--btn--${kind}`]: kind,
    [`${prefix}--btn--disabled`]: disabled,
    [`${prefix}--btn--expressive`]: isExpressive,
    [`${prefix}--tooltip--hidden`]: hasIconOnly && !allowTooltipVisibility,
    [`${prefix}--tooltip--visible`]: isHovered,
    [`${prefix}--btn--icon-only`]: hasIconOnly,
    [`${prefix}--btn--selected`]: hasIconOnly && isSelected && kind === 'ghost',
    [`${prefix}--tooltip__trigger`]: hasIconOnly,
    [`${prefix}--tooltip--a11y`]: hasIconOnly,
    [`${prefix}--btn--icon-only--${tooltipPosition}`]:
      hasIconOnly && tooltipPosition,
    [`${prefix}--tooltip--align-${tooltipAlignment}`]:
      hasIconOnly && tooltipAlignment,
  });

  const commonProps = {
    tabIndex,
    className: buttonClasses,
    ref,
  };

  const buttonImage = !ButtonImageElement ? null : (
    <ButtonImageElement
      aria-label={iconDescription}
      className={`${prefix}--btn__icon`}
      aria-hidden="true"
    />
  );

  const dangerButtonVariants = ['danger', 'danger--tertiary', 'danger--ghost'];

  let component = 'button';
  const assistiveId = useId('danger-description');
  let otherProps = {
    disabled,
    type,
    'aria-describedby': dangerButtonVariants.includes(kind)
      ? assistiveId
      : null,
    'aria-pressed': hasIconOnly && kind === 'ghost' ? isSelected : null,
  };
  const anchorProps = {
    href,
  };

  let assistiveText;
  if (hasIconOnly) {
    assistiveText = (
      <div
        ref={tooltipRef}
        onMouseEnter={handleMouseEnter}
        className={`${prefix}--assistive-text`}>
        {iconDescription}
      </div>
    );
  } else if (dangerButtonVariants.includes(kind)) {
    assistiveText = (
      <span id={assistiveId} className={`${prefix}--visually-hidden`}>
        {dangerDescription}
      </span>
    );
  } else {
    assistiveText = null;
  }

  if (as) {
    component = as;
    otherProps = {
      ...otherProps,
      ...anchorProps,
    };
  } else if (href && !disabled) {
    component = 'a';
    otherProps = anchorProps;
  }
  return React.createElement(
    component,
    {
      onMouseEnter: composeEventHandlers([onMouseEnter, handleMouseEnter]),
      onMouseLeave: composeEventHandlers([onMouseLeave, handleMouseLeave]),
      onFocus: composeEventHandlers([onFocus, handleFocus]),
      onBlur: composeEventHandlers([onBlur, handleBlur]),
      onClick: composeEventHandlers([handleClick, onClick]),
      ...other,
      ...commonProps,
      ...otherProps,
    },
    assistiveText,
    children,
    buttonImage
  );
});

Button.displayName = 'Button';
Button.propTypes = {
  /**
   * Specify how the button itself should be rendered.
   * Make sure to apply all props to the root node and render children appropriately
   */
  as: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.elementType,
  ]),

  /**
   * Specify the content of your Button
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be added to your Button
   */
  className: PropTypes.string,

  /**
   * Specify the message read by screen readers for the danger button variant
   */
  dangerDescription: PropTypes.string,

  /**
   * Specify whether the Button should be disabled, or not
   */
  disabled: PropTypes.bool,

  /**
   * Specify if the button is an icon-only button
   */
  hasIconOnly: PropTypes.bool,

  /**
   * Optionally specify an href for your Button to become an `<a>` element
   */
  href: PropTypes.string,

  /**
   * If specifying the `renderIcon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  iconDescription: (props) => {
    if (props.renderIcon && !props.children && !props.iconDescription) {
      return new Error(
        'renderIcon property specified without also providing an iconDescription property.'
      );
    }
    return undefined;
  },

  /**
   * Specify whether the Button is expressive, or not
   */
  isExpressive: PropTypes.bool,

  /**
   * Specify whether the Button is currently selected
   */
  isSelected: PropTypes.bool,

  /**
   * Specify the kind of Button you want to create
   */
  kind: PropTypes.oneOf(ButtonKinds).isRequired,

  /**
   * Provide an optional function to be called when the button element
   * loses focus
   */
  onBlur: PropTypes.func,

  /**
   * Provide an optional function to be called when the button element
   * is clicked
   */
  onClick: PropTypes.func,

  /**
   * Provide an optional function to be called when the button element
   * receives focus
   */
  onFocus: PropTypes.func,

  /**
   * Provide an optional function to be called when the mouse
   * enters the button element
   */
  onMouseEnter: PropTypes.func,

  /**
   * Provide an optional function to be called when the mouse
   * leaves the button element
   */
  onMouseLeave: PropTypes.func,

  /**
   * Optional prop to allow overriding the icon rendering.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Optional prop to specify the role of the Button
   */
  role: PropTypes.string,

  /**
   * Specify the size of the button, from a list of available sizes.
   * For `default` buttons, this prop can remain unspecified or use `default`.
   * In the next major release of Carbon, `default`, `field`, and `small` will be removed
   */
  size: PropTypes.oneOf([
    'default',
    'field',
    'small',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
  ]),

  /**
   * Deprecated in v10 in favor of `size`.
   * Specify whether the Button should be a small variant
   */
  small: deprecate(
    PropTypes.bool,
    `\nThe prop \`small\` for Button has been deprecated in favor of \`size\`. Please use \`size="sm"\` instead.`
  ),

  /**
   * Optional prop to specify the tabIndex of the Button
   */
  tabIndex: PropTypes.number,

  /**
   * Specify the alignment of the tooltip to the icon-only button.
   * Can be one of: start, center, or end.
   */
  tooltipAlignment: PropTypes.oneOf(['start', 'center', 'end']),

  /**
   * Specify the direction of the tooltip for icon-only buttons.
   * Can be either top, right, bottom, or left.
   */
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

  /**
   * Optional prop to specify the type of the Button
   */
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
};

Button.defaultProps = {
  tabIndex: 0,
  type: 'button',
  disabled: false,
  kind: 'primary',
  size: 'default',
  dangerDescription: 'danger',
  tooltipAlignment: 'center',
  tooltipPosition: 'top',
  isExpressive: false,
};

export default Button;
