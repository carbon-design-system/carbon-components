/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Close20, ErrorFilled20, CheckmarkFilled20 } from '@carbon/icons-react';
import {
  NotificationButton,
  NotificationTextDetails,
  ToastNotification,
  InlineNotification,
} from './Notification';
import { shallow, mount } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;

describe('NotificationButton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<NotificationButton className="some-class" />);

    it('renders given className', () => {
      expect(wrapper.hasClass('some-class')).toBe(true);
    });

    it('renders only one Icon', () => {
      const icon = wrapper.find(Close20);
      expect(icon.length).toEqual(1);
    });

    it('supports custom icon', () => {
      const iconButton = mount(
        <NotificationButton renderIcon={Close20} iconDescription="Close" />
      );
      const originalIcon = mount(<Close20 />).find('svg');
      const icon = iconButton.find('svg');
      expect(icon.find(':not(svg):not(title)').html()).toBe(
        originalIcon.children().html()
      );
    });

    describe('When notificationType equals "toast"', () => {
      it('button should have correct className by default', () => {
        expect(
          wrapper.hasClass(`${prefix}--toast-notification__close-button`)
        ).toBe(true);
      });

      it('icon should have correct className by default', () => {
        const icon = wrapper.find(Close20);
        expect(icon.hasClass(`${prefix}--toast-notification__close-icon`)).toBe(
          true
        );
      });
    });

    describe('When notificationType equals "inline"', () => {
      it('button should have correct className', () => {
        wrapper.setProps({ notificationType: 'inline' });
        expect(
          wrapper.hasClass(`${prefix}--inline-notification__close-button`)
        ).toBe(true);
      });

      it('icon should have correct className', () => {
        const icon = wrapper.find(Close20);
        expect(
          icon.hasClass(`${prefix}--inline-notification__close-icon`)
        ).toBe(true);
      });
    });
  });
});

describe('NotificationTextDetails', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<NotificationTextDetails />);

    describe('When notificationType equals "toast"', () => {
      it('div shoudld have correct className by default', () => {
        expect(wrapper.hasClass(`${prefix}--toast-notification__details`)).toBe(
          true
        );
      });
    });

    describe('When notificationType equals "inline"', () => {
      it('div shoudld have correct className', () => {
        wrapper.setProps({ notificationType: 'inline' });
        expect(
          wrapper.hasClass(`${prefix}--inline-notification__text-wrapper`)
        ).toBe(true);
      });
    });
  });
});

describe('ToastNotification', () => {
  describe('Renders as expected', () => {
    const toast = shallow(
      <ToastNotification
        kind="error"
        title="this is a title"
        subtitle="this is a subtitle"
        caption="this is a caption"
      />
    );
    it('renders itself', () => {
      expect(toast.length).toEqual(1);
    });

    it('renders HTML for toast notifications when caption exists', () => {
      expect(toast.hasClass(`${prefix}--toast-notification`)).toBe(true);
    });

    it('adds extra classes via className', () => {
      toast.setProps({ className: 'extra-class' });

      expect(toast.hasClass('extra-class')).toBe(true);
    });

    it('interpolates matching className based on kind prop', () => {
      const kinds = ['error', 'info', 'success', 'warning'];

      kinds.forEach((kind) => {
        toast.setProps({ kind });
        expect(
          toast.hasClass(`${prefix}--toast-notification--${kind}`)
        ).toEqual(true);
      });
    });

    it('has [role="alert"] on wrapping <div>', () => {
      expect(toast.props().role).toEqual('alert');
    });

    it('sets a new kind when passed in via props', () => {
      toast.setProps({ kind: 'success' });
      expect(toast.props().kind).toEqual('success');
    });

    it('can render any node for the subtitle and caption', () => {
      toast.setProps({
        subtitle: <button type="button" />,
        caption: <button type="button" />,
      });
      expect(toast.length).toEqual(1);
    });
  });
  describe('events and state', () => {
    it('initial open state set to true', () => {
      const wrapper = mount(
        <ToastNotification
          kind="error"
          title="this is a title"
          subtitle="this is a subtitle"
          caption="this is a caption"
        />
      );

      expect(wrapper.children().length > 0).toBe(true);
    });

    it('sets open state to false when close button is clicked', () => {
      const wrapper = mount(
        <ToastNotification
          kind="error"
          title="this is a title"
          subtitle="this is a subtitle"
          caption="this is a caption"
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.children().length).toBe(0);
    });

    it('closes notification if `onClose` is provided', () => {
      const wrapper = mount(
        <ToastNotification
          kind="error"
          title="this is a title"
          subtitle="this is a subtitle"
          caption="this is a caption"
          onClose={() => {}}
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.children().length).toBe(0);
    });

    it('keeps notification open if `onClose` returns false', () => {
      const wrapper = mount(
        <ToastNotification
          kind="error"
          title="this is a title"
          subtitle="this is a subtitle"
          caption="this is a caption"
          onClose={() => false}
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.children().length).not.toBe(0);
    });

    it('renders null when open state is false', () => {
      const wrapper = mount(
        <ToastNotification
          kind="error"
          title="this is a title"
          subtitle="this is a subtitle"
          caption="this is a caption"
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.html()).toBeNull();
    });
  });
});

describe('InlineNotification', () => {
  describe('Renders as expected', () => {
    const inline = mount(
      <InlineNotification
        title="this is a title"
        subtitle="this is a subtitle"
        kind="error"
      />
    );

    it('renders itself', () => {
      expect(inline.length).toEqual(1);
    });

    it('renders success notification with matching kind and <icon name=""> values', () => {
      inline.setProps({ kind: 'success' });
      expect(inline.find(CheckmarkFilled20).length).toBe(1);
    });

    it('renders error notification with matching kind and <icon name=""> values', () => {
      inline.setProps({ kind: 'error' });
      expect(inline.find(ErrorFilled20).length).toBe(1);
    });

    it('renders warning notification with matching kind and <icon name=""> values', () => {
      inline.setProps({ kind: 'warning' });
      expect(
        inline.find(`.${prefix}--inline-notification__icon`).exists()
      ).toBe(true);
    });

    it('renders HTML for inline notifications when caption does not exist', () => {
      expect(inline.find(`.${prefix}--inline-notification`).exists()).toBe(
        true
      );
    });

    it('adds extra classes via className', () => {
      inline.setProps({ className: 'extra-class' });
      expect(inline.find('.extra-class').exists()).toBe(true);
    });

    it('interpolates matching className based on kind prop', () => {
      const kinds = ['error', 'info', 'success', 'warning'];

      kinds.forEach((kind) => {
        inline.setProps({ kind });
        expect(
          inline.find(`.${prefix}--inline-notification--${kind}`).exists()
        ).toEqual(true);
      });
    });

    it('has [role="alert"] on wrapping <div>', () => {
      expect(inline.props().role).toEqual('alert');
    });

    it('sets a new kind when passed in via props', () => {
      inline.setProps({ kind: 'success' });
      expect(inline.props().kind).toEqual('success');
    });

    it('can render any node for the subtitle', () => {
      inline.setProps({ subtitle: <button type="button" /> });
      expect(inline.length).toEqual(1);
    });
  });

  describe('events and state', () => {
    it('initial open state set to true', () => {
      const wrapper = mount(
        <InlineNotification
          title="this is a title"
          subtitle="this is a subtitle"
          kind="error"
        />
      );

      expect(wrapper.children().length > 0).toBe(true);
    });

    it('sets open state to false when close button is clicked', () => {
      const wrapper = mount(
        <InlineNotification
          kind="success"
          title="title"
          subtitle="subtitle"
          iconDescription="description"
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.children().length).toBe(0);
    });

    it('closes notification if `onClose` is provided', () => {
      const wrapper = mount(
        <InlineNotification
          kind="success"
          title="title"
          subtitle="subtitle"
          iconDescription="description"
          onClose={() => {}}
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.children().length).toBe(0);
    });

    it('keeps notification open if `onClose` returns false', () => {
      const wrapper = mount(
        <InlineNotification
          kind="success"
          title="title"
          subtitle="subtitle"
          iconDescription="description"
          onClose={() => false}
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.children().length).not.toBe(0);
    });

    it('renders null when open state is false', () => {
      const wrapper = mount(
        <InlineNotification
          title="this is a title"
          subtitle="this is a subtitle"
          kind="error"
        />
      );

      wrapper.find('button').simulate('click');
      expect(wrapper.html()).toBeNull();
    });
  });
});

// Deprecated
