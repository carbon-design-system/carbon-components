/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Close } from '@carbon/icons-react/next';
import Modal from '../Modal';
import ModalWrapper from '../ModalWrapper';
import InlineLoading from '../InlineLoading';
import { shallow, mount } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;

// The modal is the 0th child inside the wrapper on account of focus-trap-react
const getModal = (wrapper) => wrapper.find('.bx--modal');
const getModalBody = (wrapper) => wrapper.find('.bx--modal-container');

describe('Modal', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(
      <Modal aria-label="test" className="extra-class" />
    );
    const mounted = mount(<Modal aria-label="test" className="extra-class" />);

    it('has the expected classes', () => {
      expect(getModal(wrapper).hasClass(`${prefix}--modal`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(getModal(wrapper).hasClass('extra-class')).toEqual(true);
    });

    it('should not be a passive modal by default', () => {
      expect(getModal(wrapper).hasClass(`${prefix}--modal-tall`)).toEqual(true);
    });

    it('should be a passive modal when passiveModal is passed', () => {
      wrapper.setProps({ passiveModal: true });
      expect(getModal(wrapper).hasClass(`${prefix}--modal-tall`)).toEqual(
        false
      );
    });

    it('should set id if one is passed via props', () => {
      const modal = shallow(<Modal aria-label="test" id="modal-1" />);
      expect(getModal(modal).props().id).toEqual('modal-1');
    });

    it('has the expected default iconDescription', () => {
      expect(mounted.props().iconDescription).toEqual('Close');
    });

    it('adds new iconDescription when passed via props', () => {
      mounted.setProps({ iconDescription: 'new description' });
      expect(mounted.props().iconDescription).toEqual('new description');
    });

    it('should have iconDescription match Icon component description prop', () => {
      const description = mounted.find(Close).props()['aria-label'];
      const matches = mounted.props().iconDescription === description;
      expect(matches).toEqual(true);
    });

    it('enables primary button by default', () => {
      const primaryButton = mounted
        .find(`.${prefix}--btn.${prefix}--btn--primary`)
        .at(0);
      expect(primaryButton.prop('disabled')).toEqual(false);
    });

    it('disables primary button when diablePrimaryButton prop is passed', () => {
      mounted.setProps({ primaryButtonDisabled: true });
      const primaryButton = mounted
        .find(`.${prefix}--btn.${prefix}--btn--primary`)
        .at(0);
      expect(primaryButton.props().disabled).toEqual(true);
    });

    it('Should have node in primary', () => {
      mounted.setProps({ primaryButtonText: <InlineLoading /> });
      const primaryButton = mounted
        .find(`.${prefix}--btn.${prefix}--btn--primary`)
        .at(0);
      expect(primaryButton.find('InlineLoading').exists()).toEqual(true);
    });

    it('Should have node in secondary', () => {
      mounted.setProps({ secondaryButtonText: <InlineLoading /> });
      const secondaryButton = mounted
        .find(`.${prefix}--btn.${prefix}--btn--secondary`)
        .at(0);
      expect(secondaryButton.find('InlineLoading').exists()).toEqual(true);
    });
  });

  describe('Renders as expected with secondaryButtons prop', () => {
    const mounted = mount(<Modal aria-label="test" className="extra-class" />);

    it('Should support node in secondary', () => {
      mounted.setProps({
        secondaryButtons: [
          {
            buttonText: <InlineLoading />,
            onClick: jest.fn(),
          },
          {
            buttonText: 'Cancel',
            onClick: jest.fn(),
          },
        ],
      });

      const secondaryButtons = mounted.find(
        `.${prefix}--btn.${prefix}--btn--secondary`
      );
      expect(secondaryButtons.length).toEqual(2);
      expect(secondaryButtons.at(0).find('InlineLoading').exists()).toEqual(
        true
      );
      expect(secondaryButtons.at(1).text()).toEqual('Cancel');
    });
  });

  describe('Adds props as expected to the right children', () => {
    it('should set label if one is passed via props', () => {
      const wrapper = shallow(<Modal aria-label="test" modalLabel="modal-1" />);
      const label = wrapper.find(`.${prefix}--modal-header__label`);
      expect(label.props().children).toEqual('modal-1');
    });

    it('should set modal heading if one is passed via props', () => {
      const wrapper = shallow(
        <Modal aria-label="test" modalHeading="modal-1" />
      );
      const heading = wrapper.find(`.${prefix}--modal-header__heading`);
      expect(heading.props().children).toEqual('modal-1');
    });

    it('should set button text if one is passed via props', () => {
      const wrapper = mount(
        <Modal
          aria-label="test"
          primaryButtonText="Submit"
          secondaryButtonText="Cancel"
        />
      );
      const modalButtons = wrapper.find(`.${prefix}--modal-footer Button`);
      expect(modalButtons.at(0).props().children).toEqual('Cancel');
      expect(modalButtons.at(1).props().children).toEqual('Submit');
    });
  });

  describe('events', () => {
    it('should set expected class when state is open', () => {
      const wrapper = mount(<ModalWrapper aria-label="test" />);
      const modal = wrapper.find(Modal);
      const modalContainer = modal.find(`.${prefix}--modal`);
      const openClass = 'is-visible';

      expect(modalContainer.hasClass(openClass)).not.toEqual(true);
      expect(
        document.body.classList.contains('bx--body--with-modal-open')
      ).not.toEqual(true);
      wrapper.setState({ isOpen: true });
      expect(wrapper.find(`.${prefix}--modal`).hasClass(openClass)).toEqual(
        true
      );
      expect(
        document.body.classList.contains('bx--body--with-modal-open')
      ).toEqual(true);
      wrapper.unmount();
      expect(
        document.body.classList.contains('bx--body--with-modal-open')
      ).toEqual(false);
    });

    it('should set state to open when trigger button is clicked', () => {
      const wrapper = mount(<ModalWrapper aria-label="test" />);
      const triggerBtn = wrapper.children().childAt(0);
      expect(wrapper.state('isOpen')).not.toEqual(true);
      triggerBtn.simulate('click');
      expect(wrapper.state('isOpen')).toEqual(true);
    });

    it('should set open state to false when close button is clicked', () => {
      const wrapper = mount(<ModalWrapper aria-label="test" />);
      const modal = wrapper.find(Modal);
      const closeBtn = modal.find(`.${prefix}--modal-close`);
      wrapper.setState({ isOpen: true });
      expect(wrapper.state('isOpen')).toEqual(true);
      closeBtn.simulate('click');
      expect(wrapper.state('isOpen')).not.toEqual(true);
    });

    it('should stay open when "inner modal" is clicked', () => {
      const wrapper = mount(<ModalWrapper aria-label="test" />);
      const modal = wrapper.find(Modal);
      const div = modal.find(`.${prefix}--modal-container`);
      wrapper.setState({ isOpen: true });
      div.simulate('click');
      expect(wrapper.state('isOpen')).toEqual(true);
    });

    it('should close when "outer modal" is clicked...not "inner modal"', () => {
      const wrapper = mount(<ModalWrapper aria-label="test" />);
      const modal = wrapper.find(Modal);
      const div = modal.find(`.${prefix}--modal`);
      wrapper.setState({ isOpen: true });
      div.simulate('mousedown');
      expect(wrapper.state('isOpen')).toEqual(false);
    });

    it('should handle close keyDown events', () => {
      const onRequestClose = jest.fn();
      const wrapper = mount(
        <Modal aria-label="test" open onRequestClose={onRequestClose} />
      );
      wrapper.simulate('keyDown', { which: 26 });
      expect(onRequestClose).not.toBeCalled();
      wrapper.simulate('keyDown', { which: 27 });
      expect(onRequestClose).toBeCalled();
    });

    it('should handle submit keyDown events with shouldSubmitOnEnter enabled', () => {
      const onRequestSubmit = jest.fn();
      const wrapper = mount(
        <Modal
          aria-label="test"
          open
          onRequestSubmit={onRequestSubmit}
          shouldSubmitOnEnter
        />
      );
      wrapper.simulate('keyDown', { which: 14 });
      expect(onRequestSubmit).not.toBeCalled();
      wrapper.simulate('keyDown', { which: 13 });
      expect(onRequestSubmit).toBeCalled();
    });

    it('should not handle submit keyDown events with shouldSubmitOnEnter not enabled', () => {
      const onRequestSubmit = jest.fn();
      const wrapper = mount(
        <Modal aria-label="test" open onRequestSubmit={onRequestSubmit} />
      );
      wrapper.simulate('keyDown', { which: 14 });
      expect(onRequestSubmit).not.toBeCalled();
      wrapper.simulate('keyDown', { which: 13 });
      expect(onRequestSubmit).not.toBeCalled();
    });

    it('should close by default on secondary button click', () => {
      const onRequestClose = jest.fn();
      const modal = mount(
        <Modal
          aria-label="test"
          secondaryButtonText="Cancel"
          onRequestClose={onRequestClose}
        />
      );
      const secondaryBtn = modal.find(`.${prefix}--btn--secondary`);
      secondaryBtn.simulate('click');
      expect(onRequestClose).toBeCalled();
    });

    it('should handle custom secondary button events', () => {
      const onSecondarySubmit = jest.fn();
      const modal = mount(
        <Modal
          aria-label="test"
          secondaryButtonText="Cancel"
          onSecondarySubmit={onSecondarySubmit}
        />
      );
      const secondaryBtn = modal.find(`.${prefix}--btn--secondary`);
      secondaryBtn.simulate('click');
      expect(onSecondarySubmit).toBeCalled();
    });
  });
});
describe('Modal Wrapper', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(<ModalWrapper aria-label="test" />);

    it('should default to primary button', () => {
      expect(wrapper.find(`.${prefix}--btn--primary`).length).toEqual(2);
    });

    it('should render ghost button when ghost is passed', () => {
      wrapper.setProps({ triggerButtonKind: 'ghost' });
      expect(wrapper.find(`.${prefix}--btn--ghost`).length).toEqual(1);
    });

    it('should render danger button when danger is passed', () => {
      wrapper.setProps({ triggerButtonKind: 'danger' });
      expect(wrapper.find(`.${prefix}--btn--danger`).length).toEqual(1);
    });

    it('should render secondary button when secondary is passed', () => {
      wrapper.setProps({ triggerButtonKind: 'secondary' });
      expect(wrapper.find(`.${prefix}--btn--secondary`).length).toEqual(2);
    });
  });
});
describe('Danger Modal', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(
      <Modal aria-label="test" secondaryButtonText="Cancel" danger />
    );

    it('has the expected classes', () => {
      expect(getModal(wrapper).hasClass(`${prefix}--modal--danger`)).toEqual(
        true
      );
    });

    it('has correct button combination', () => {
      const modalButtons = wrapper.find(
        `.${prefix}--modal-footer.${prefix}--btn-set Button`
      );
      expect(modalButtons.length).toEqual(2);
      expect(modalButtons.at(0).props().kind).toEqual('secondary');
      expect(modalButtons.at(1).props().kind).toEqual('danger');
    });
  });
});
describe('Alert Modal', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<Modal aria-label="test" alert />);

    it('has the expected attributes', () => {
      expect(getModalBody(wrapper).props()).toEqual(
        expect.objectContaining({
          role: 'alertdialog',
          'aria-describedby': expect.any(String),
        })
      );
    });

    it('should be a passive modal when passiveModal is passed', () => {
      wrapper.setProps({ passiveModal: true });
      expect(getModalBody(wrapper).props()).toEqual(
        expect.objectContaining({
          role: 'alert',
        })
      );
    });
  });
});
