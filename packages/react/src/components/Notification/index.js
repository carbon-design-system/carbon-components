/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  NotificationActionButton as NotificationActionButtonNext,
  NotificationButton as NotificationButtonNext,
  ToastNotification as ToastNotificationNext,
  InlineNotification as InlineNotificationNext,
} from './next/Notification';
import {
  NotificationActionButton as NotificationActionButtonClassic,
  NotificationTextDetails as NotificationTextDetailsClassic,
  NotificationButton as NotificationButtonClassic,
  ToastNotification as ToastNotificationClassic,
  InlineNotification as InlineNotificationClassic,
} from './Notification';
import { createComponentToggle } from '../../internal/ComponentToggle';

export const NotificationActionButton = createComponentToggle({
  name: 'NotificationActionButton',
  next: NotificationActionButtonNext,
  classic: NotificationActionButtonClassic,
});

export const NotificationTextDetails = createComponentToggle({
  name: 'NotificationTextDetails',
  classic: NotificationTextDetailsClassic,
});

export const NotificationButton = createComponentToggle({
  name: 'NotificationButton',
  next: NotificationButtonNext,
  classic: NotificationButtonClassic,
});

export const ToastNotification = createComponentToggle({
  name: 'ToastNotification',
  next: ToastNotificationNext,
  classic: ToastNotificationClassic,
});

export const InlineNotification = createComponentToggle({
  name: 'InlineNotification',
  next: InlineNotificationNext,
  classic: InlineNotificationClassic,
});
