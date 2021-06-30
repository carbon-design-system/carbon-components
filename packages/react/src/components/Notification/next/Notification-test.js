/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ErrorFilled20 } from '@carbon/icons-react';
import {
  NotificationButton,
  ToastNotification,
  InlineNotification,
  NotificationActionButton,
} from '../next/Notification';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { settings } from 'carbon-components';
import { it } from 'window-or-global';

const { prefix } = settings;

describe('NotificationButton', () => {
  it('should place the `className` prop on the outermost DOM node', () => {
    const { container } = render(<NotificationButton className="test" />);
    expect(container.firstChild).toHaveClass('test');
  });

  it('renders only one icon', () => {
    render(<NotificationButton />);
    expect(screen.queryAllByRole('img').length).toEqual(1);
  });

  it('supports custom icon', () => {
    const { rerender } = render(<NotificationButton />);
    const defaultIcon = screen.queryByRole('img').innerHTML;

    rerender(<NotificationButton renderIcon={ErrorFilled20} />);
    const customIcon = screen.queryByRole('img').innerHTML;

    expect(defaultIcon).not.toEqual(customIcon);
  });

  it('interpolates matching className based on notificationType prop', () => {
    const { rerender, container } = render(<NotificationButton />);
    const notificationTypes = ['toast', 'inline'];

    notificationTypes.forEach((notificationType) => {
      rerender(<NotificationButton notificationType={notificationType} />);
      expect(container.firstChild).toHaveClass(
        `${prefix}--${notificationType}-notification__close-button`
      );
      expect(screen.queryByRole('img')).toHaveClass(
        `${prefix}--${notificationType}-notification__close-icon`
      );
    });
  });
});

describe('ToastNotification', () => {
  it('should have role=status by default', () => {
    const { container } = render(<ToastNotification />);
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });

  it('should place the `className` prop on the outermost DOM node', () => {
    const { container } = render(<ToastNotification className="test" />);
    expect(container.firstChild).toHaveClass('test');
  });

  it('interpolates matching className based on kind prop', () => {
    const { rerender } = render(<ToastNotification />);
    const kinds = [
      'error',
      'info',
      'info-square',
      'success',
      'warning',
      'warning-alt',
    ];
    kinds.forEach((kind) => {
      rerender(<ToastNotification kind={kind} />);
      expect(screen.queryByRole('status')).toHaveClass(
        `${prefix}--toast-notification--${kind}`
      );
    });
  });

  it('allows non-interactive elements as children', () => {
    render(
      <ToastNotification>
        <p>Sample text</p>
      </ToastNotification>
    );
    expect(screen.queryByText(/Sample text/i)).toBeInTheDocument();
  });

  it('does not allow interactive elements as children', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <ToastNotification>
          <button type="button">Sample text</button>
        </ToastNotification>
      );
    }).toThrow();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('close button is rendered by default and includes aria-hidden=true', () => {
    render(<ToastNotification />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });

    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render close button when `hideCloseButton` is provided', () => {
    render(<ToastNotification hideCloseButton />);
    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('calls `onClose` when notification is closed', async () => {
    const onClose = jest.fn();
    render(<ToastNotification onClose={onClose} />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('keeps notification open if `onClose` returns false', () => {
    render(<ToastNotification onClose={() => false} />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    userEvent.click(closeButton);
    expect(screen.queryByRole('status')).toBeInTheDocument();
  });

  it('calls `onCloseButtonClick` when notification is closed', () => {
    const onCloseButtonClick = jest.fn();
    render(<ToastNotification onCloseButtonClick={onCloseButtonClick} />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    userEvent.click(closeButton);
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('closes notification via escape button', async () => {
    const onCloseButtonClick = jest.fn();
    const onClose = jest.fn();
    render(
      <ToastNotification
        onClose={onClose}
        onCloseButtonClick={onCloseButtonClick}
      />
    );

    userEvent.keyboard('{Escape}');
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});

describe('InlineNotification', () => {
  it('should have role=status by default', () => {
    const { container } = render(<InlineNotification />);
    expect(container.firstChild).toHaveAttribute('role', 'status');
  });

  it('should place the `className` prop on the outermost DOM node', () => {
    const { container } = render(<InlineNotification className="test" />);
    expect(container.firstChild).toHaveClass('test');
  });

  it('interpolates matching className based on kind prop', () => {
    const { rerender } = render(<InlineNotification />);
    const kinds = [
      'error',
      'info',
      'info-square',
      'success',
      'warning',
      'warning-alt',
    ];
    kinds.forEach((kind) => {
      rerender(<InlineNotification kind={kind} />);
      expect(screen.queryByRole('status')).toHaveClass(
        `${prefix}--inline-notification--${kind}`
      );
    });
  });

  it('allows non-interactive elements as children', () => {
    render(
      <InlineNotification>
        <p>Sample text</p>
      </InlineNotification>
    );
    expect(screen.queryByText(/Sample text/i)).toBeInTheDocument();
  });

  it('allows interactive elements as children', () => {
    render(
      <InlineNotification>
        <button type="button">Sample text</button>
      </InlineNotification>
    );
    expect(screen.queryByText(/Sample text/i)).toBeInTheDocument();
  });

  it('close button is rendered by default and includes aria-hidden=true', () => {
    render(<InlineNotification />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render close button when `hideCloseButton` is provided', () => {
    render(<InlineNotification hideCloseButton />);
    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('calls `onClose` when notification is closed', async () => {
    const onClose = jest.fn();
    render(<InlineNotification onClose={onClose} />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('keeps notification open if `onClose` returns false', () => {
    render(<InlineNotification onClose={() => false} />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    userEvent.click(closeButton);
    expect(screen.queryByRole('status')).toBeInTheDocument();
  });

  it('calls `onCloseButtonClick` when notification is closed', () => {
    const onCloseButtonClick = jest.fn();
    render(<InlineNotification onCloseButtonClick={onCloseButtonClick} />);

    const closeButton = screen.queryByRole('button', {
      hidden: true,
    });
    userEvent.click(closeButton);
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('closes notification via escape button', async () => {
    const onCloseButtonClick = jest.fn();
    const onClose = jest.fn();
    render(
      <InlineNotification
        onClose={onClose}
        onCloseButtonClick={onCloseButtonClick}
      />
    );

    userEvent.keyboard('{Escape}');
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders actions when provided, and overrides role to be alertdialog', () => {
    const { container } = render(
      <InlineNotification
        actions={
          <NotificationActionButton>Button text</NotificationActionButton>
        }
      />
    );
    const actionButton = screen.queryByRole('button', {
      name: 'Button text',
    });
    expect(actionButton).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('role', 'alertdialog');
  });
});
