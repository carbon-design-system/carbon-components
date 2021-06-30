/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CopyButton from '../CopyButton';
import { Copy } from '@carbon/icons-react/next';
import { shallow, mount } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;
jest.useFakeTimers();

describe('CopyButton', () => {
  describe('Renders common props as expected', () => {
    const wrapper = shallow(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <CopyButton tabIndex={2} className="extra-class" />
    );

    it('Should set tabIndex if one is passed via props', () => {
      expect(wrapper.props().tabIndex).toEqual(2);
    });

    it('Should add extra classes via className', () => {
      expect(wrapper.hasClass('extra-class')).toBe(true);
    });
  });

  describe('Renders button props as expected', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<CopyButton />);
    });

    it('Renders children as expected', () => {
      expect(wrapper.find('button').hasClass(`${prefix}--copy-btn`)).toBe(true);
      expect(wrapper.find(`.${prefix}--copy-btn__feedback`).length).toBe(1);
      expect(wrapper.find(Copy).length).toBe(1);
    });

    it('Should be able to disable the button', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper.props().disabled).toBe(true);
      wrapper.setProps({ disabled: false });
    });

    it('Should have a default feedback timeout', () => {
      const timeoutWrapper = mount(<CopyButton />);
      expect(timeoutWrapper.props().feedbackTimeout).toBe(2000);
    });

    it('Should be able to set the timeout for displaying feedback', () => {
      const timeoutWrapper = mount(<CopyButton feedbackTimeout={5000} />);
      expect(timeoutWrapper.props().feedbackTimeout).toBe(5000);
    });

    it('Should be able to specify the feedback message', () => {
      const feedbackWrapper = mount(<CopyButton feedback="Copied!" />);
      expect(
        feedbackWrapper.find(`.${prefix}--copy-btn__feedback`).text()
      ).toBe('Copied!');
    });
  });

  describe('Renders feedback as expected', () => {
    it('Should make the feedback visible', () => {
      const feedbackWrapper = mount(<CopyButton feedback="Copied!" />);
      const feedback = feedbackWrapper.find(`.${prefix}--copy-btn__feedback`);
      expect(feedback).toBeFalsy;
      feedbackWrapper.simulate('click');
      expect(feedback).toBeTruthy;
    });

    it('Should show feedback for a limited amount of time', () => {
      const feedbackWrapper = mount(
        <CopyButton feedback="Copied!" feedbackTimeout={5000} />
      );
      feedbackWrapper.simulate('click');
      const copyButton = feedbackWrapper.find('button');
      expect(copyButton.hasClass(`${prefix}--copy-btn--animating`)).toBe(true);
      setTimeout(() => {
        expect(copyButton.hasClass(`${prefix}--copy-btn--animating`)).toBe(
          false
        );
      }, 5220); // 5000 + 2 * 110 (transition duration)
    });
  });

  describe('Triggers appropriate events', () => {
    it('should call the click handler', () => {
      const onClick = jest.fn();
      const clickWrapper = mount(<CopyButton onClick={onClick} />);
      clickWrapper.simulate('click');
      expect(onClick).toBeCalled();
    });
  });
});
