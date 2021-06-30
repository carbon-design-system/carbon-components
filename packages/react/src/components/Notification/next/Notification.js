/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { settings } from 'carbon-components';
import {
  Close20,
  ErrorFilled20,
  CheckmarkFilled20,
  WarningFilled20,
  WarningAltFilled20,
  InformationFilled20,
  InformationSquareFilled20,
} from '@carbon/icons-react';

import Button from '../../Button';
import useIsomorphicEffect from '../../../internal/useIsomorphicEffect';
import { useNoInteractiveChildren } from '../../../internal/useNoInteractiveChildren';
import { keys, matches } from '../../../internal/keyboard';

const { prefix } = settings;

/**
 * Conditionally call a callback when the escape key is pressed
 * @param {func} callback - function to be called
 * @param {bool} override - escape hatch to conditionally call the callback
 */
function useEscapeToClose(callback, override = true) {
  const handleKeyDown = (event) => {
    if (matches(event, [keys.Escape]) && override) {
      callback(event);
    }
  };

  useIsomorphicEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown, false);
  });
}

export function NotificationActionButton({
  children,
  className: customClassName,
  onClick,
  ...rest
}) {
  const className = cx(
    customClassName,
    `${prefix}--inline-notification__action-button`
  );

  return (
    <Button
      className={className}
      kind="ghost"
      onClick={onClick}
      size="small"
      {...rest}>
      {children}
    </Button>
  );
}

NotificationActionButton.propTypes = {
  /**
   * Specify the content of the notification action button.
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the notification action button
   */
  className: PropTypes.string,

  /**
   * Optionally specify a click handler for the notification action button.
   */
  onClick: PropTypes.func,
};

export function NotificationButton({
  ariaLabel,
  className,
  iconDescription,
  type,
  renderIcon: IconTag,
  name,
  notificationType,
  ...rest
}) {
  const buttonClassName = cx(className, {
    [`${prefix}--${notificationType}-notification__close-button`]: notificationType,
  });
  const iconClassName = cx({
    [`${prefix}--${notificationType}-notification__close-icon`]: notificationType,
  });

  return (
    <button
      {...rest}
      // eslint-disable-next-line react/button-has-type
      type={type}
      aria-label={iconDescription}
      title={iconDescription}
      className={buttonClassName}>
      {IconTag && (
        <IconTag aria-label={ariaLabel} className={iconClassName} name={name} />
      )}
    </button>
  );
}

NotificationButton.propTypes = {
  /**
   * Specify a label to be read by screen readers on the notification button
   */
  ariaLabel: PropTypes.string,

  /**
   * Specify an optional className to be applied to the notification button
   */
  className: PropTypes.string,

  /**
   * Provide a description for "close" icon that can be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify an optional icon for the Button through a string,
   * if something but regular "close" icon is desirable
   */
  name: PropTypes.string,

  /**
   * Specify the notification type
   */
  notificationType: PropTypes.oneOf(['toast', 'inline']),

  /**
   * Optional prop to allow overriding the icon rendering.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Optional prop to specify the type of the Button
   */
  type: PropTypes.string,
};

NotificationButton.defaultProps = {
  ariaLabel: 'close notification', // TODO: deprecate this prop
  notificationType: 'toast',
  type: 'button',
  iconDescription: 'close icon',
  renderIcon: Close20,
};

const iconTypes = {
  error: ErrorFilled20,
  success: CheckmarkFilled20,
  warning: WarningFilled20,
  ['warning-alt']: WarningAltFilled20,
  info: InformationFilled20,
  ['info-square']: InformationSquareFilled20,
};

function NotificationIcon({ iconDescription, kind, notificationType }) {
  const IconForKind = iconTypes[kind];
  if (!IconForKind) {
    return null;
  }
  return (
    <IconForKind
      className={`${prefix}--${notificationType}-notification__icon`}>
      <title>{iconDescription}</title>
    </IconForKind>
  );
}

NotificationIcon.propTypes = {
  iconDescription: PropTypes.string.isRequired,
  kind: PropTypes.oneOf([
    'error',
    'success',
    'warning',
    'warning-alt',
    'info',
    'info-square',
  ]).isRequired,
  notificationType: PropTypes.oneOf(['inline', 'toast']).isRequired,
};

export function ToastNotification({
  role,
  onClose,
  onCloseButtonClick,
  iconDescription,
  statusIconDescription,
  className,
  children,
  kind,
  lowContrast,
  hideCloseButton,
  timeout,
  closeOnEscape,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(true);
  const containerClassName = cx(className, {
    [`${prefix}--toast-notification`]: true,
    [`${prefix}--toast-notification--low-contrast`]: lowContrast,
    [`${prefix}--toast-notification--${kind}`]: kind,
  });

  const ref = useRef(null);
  useNoInteractiveChildren(ref);

  const handleClose = (evt) => {
    if (!onClose || onClose(evt) !== false) {
      setIsOpen(false);
    }
  };
  useEscapeToClose(handleCloseButtonClick, closeOnEscape);

  function handleCloseButtonClick(event) {
    onCloseButtonClick(event);
    handleClose(event);
  }

  const savedOnClose = useRef(onClose);

  useEffect(() => {
    savedOnClose.current = onClose;
  });

  useEffect(() => {
    if (!timeout) {
      return;
    }

    const timeoutId = window.setTimeout((event) => {
      setIsOpen(false);
      if (savedOnClose.current) {
        savedOnClose.current(event);
      }
    }, timeout);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [timeout]);

  if (!isOpen) {
    return null;
  }

  return (
    <div {...rest} role={role} className={containerClassName}>
      <NotificationIcon
        notificationType="toast"
        kind={kind}
        iconDescription={statusIconDescription || `${kind} icon`}
      />
      <div ref={ref} className={`${prefix}--toast-notification__content`}>
        {children}
      </div>
      {!hideCloseButton && (
        <NotificationButton
          iconDescription={iconDescription}
          notificationType="toast"
          onClick={handleCloseButtonClick}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

ToastNotification.propTypes = {
  /**
   * Specify the content
   */
  children: PropTypes.node.isRequired,

  /**
   * Specify an optional className to be applied to the notification box
   */
  className: PropTypes.string,

  /**
   * Specify if pressing the escape key should close notifications
   */
  closeOnEscape: PropTypes.bool,

  /**
   * Specify the close button should be disabled, or not
   */
  hideCloseButton: PropTypes.bool,

  /**
   * Provide a description for "close" icon that can be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify what state the notification represents
   */
  kind: PropTypes.oneOf([
    'error',
    'info',
    'info-square',
    'success',
    'warning',
    'warning-alt',
  ]).isRequired,

  /**
   * Specify whether you are using the low contrast variant of the ToastNotification.
   */
  lowContrast: PropTypes.bool,

  /**
   * Provide a function that is called when menu is closed
   */
  onClose: PropTypes.func,

  /**
   * Provide a function that is called when the close button is clicked
   */
  onCloseButtonClick: PropTypes.func,

  /**
   * By default, this value is "alert". You can also provide an alternate
   * role if it makes sense from the accessibility-side
   */
  role: PropTypes.oneOf(['alert', 'log', 'status']).isRequired,

  /**
   * Provide a description for "status" icon that can be read by screen readers
   */
  statusIconDescription: PropTypes.string,

  /**
   * Specify an optional duration the notification should be closed in
   */
  timeout: PropTypes.number,
};

ToastNotification.defaultProps = {
  kind: 'error',
  children: 'provide content',
  role: 'status',
  iconDescription: 'closes notification',
  onCloseButtonClick: () => {},
  hideCloseButton: false,
  timeout: 0,
  closeOnEscape: true,
};

export function InlineNotification({
  actions,
  children,
  role: initialRole,
  onClose,
  onCloseButtonClick,
  iconDescription,
  statusIconDescription,
  className,
  kind,
  lowContrast,
  hideCloseButton,
  hasFocus,
  closeOnEscape,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(true);
  const containerClassName = cx(className, {
    [`${prefix}--inline-notification`]: true,
    [`${prefix}--inline-notification--low-contrast`]: lowContrast,
    [`${prefix}--inline-notification--${kind}`]: kind,
    [`${prefix}--inline-notification--hide-close-button`]: hideCloseButton,
  });

  // Placing interactable element(s) within a notification requires a role of
  // alertdialog. Additionaly, focus must be automatically moved to the component.
  const role = actions ? 'alertdialog' : initialRole;
  const ref = useRef(null);
  useIsomorphicEffect(() => {
    if (ref.current && role == 'alertdialog' && hasFocus) {
      ref.current.focus();
    }
  });

  const handleClose = (evt) => {
    if (!onClose || onClose(evt) !== false) {
      setIsOpen(false);
    }
  };
  useEscapeToClose(handleCloseButtonClick, closeOnEscape);

  function handleCloseButtonClick(event) {
    onCloseButtonClick(event);
    handleClose(event);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div {...rest} ref={ref} role={role} className={containerClassName}>
      <div className={`${prefix}--inline-notification__details`}>
        <NotificationIcon
          notificationType="inline"
          kind={kind}
          iconDescription={statusIconDescription || `${kind} icon`}
        />
        <div className={`${prefix}--inline-notification__text-wrapper`}>
          <div className={`${prefix}--inline-notification__content`}>
            {children}
          </div>
        </div>
      </div>
      {actions}
      {!hideCloseButton && (
        <NotificationButton
          iconDescription={iconDescription}
          notificationType="inline"
          onClick={handleCloseButtonClick}
          aria-hidden={role === 'alertdialog' ? false : true}
        />
      )}
    </div>
  );
}

InlineNotification.propTypes = {
  /**
   * Pass in the action nodes that will be rendered within the InlineNotification.
   * If this prop is configured, the aria role will be changed to "alertdialog"
   */
  actions: PropTypes.node,

  /**
   * Specify the content
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the notification box
   */
  className: PropTypes.string,

  /**
   * Specify if pressing the escape key should close notifications
   */
  closeOnEscape: PropTypes.bool,

  /**
   * Specify if focus should be moved to the component when the notification contains actions
   */
  hasFocus: PropTypes.bool,

  /**
   * Specify the close button should be disabled, or not
   */
  hideCloseButton: PropTypes.bool,

  /**
   * Provide a description for "close" icon that can be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify what state the notification represents
   */
  kind: PropTypes.oneOf([
    'error',
    'info',
    'info-square',
    'success',
    'warning',
    'warning-alt',
  ]).isRequired,

  /**
   * Specify whether you are using the low contrast variant of the InlineNotification.
   */
  lowContrast: PropTypes.bool,

  /**
   * Provide a function that is called when menu is closed
   */
  onClose: PropTypes.func,

  /**
   * Provide a function that is called when the close button is clicked
   */
  onCloseButtonClick: PropTypes.func,

  /**
   * By default, this value is "alert". You can also provide an alternate
   * role if it makes sense from the accessibility-side. If the `actions` prop is
   * configured, this will be overridden to "alertdialog".
   */
  role: PropTypes.string.isRequired,

  /**
   * Provide a description for "status" icon that can be read by screen readers
   */
  statusIconDescription: PropTypes.string,
};

InlineNotification.defaultProps = {
  kind: 'error',
  content: 'provide content',
  role: 'status',
  iconDescription: 'closes notification',
  onCloseButtonClick: () => {},
  hideCloseButton: false,
  hasFocus: true,
  closeOnEscape: true,
};
