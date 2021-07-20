/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Slider from '../Slider';
import SliderSkeleton from '../Slider/Slider.Skeleton';
import { mount, shallow } from 'enzyme';
import 'requestanimationframe';
import throttle from 'lodash.throttle';
import { settings } from 'carbon-components';

jest.mock('lodash.throttle');

throttle.mockImplementation((fn) => Object.assign(fn, { throttled: true }));

const { prefix } = settings;
describe('Slider', () => {
  const id = 'slider';
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Slider
        id={id}
        className="extra-class"
        value={1}
        min={1}
        max={3}
        step={1}
      />
    );
  });

  describe('Renders as expected', () => {
    it('renders children as expected', () => {
      expect(wrapper.find(`.${prefix}--text-input`).length).toBe(1);
    });

    it('has the expected classes', () => {
      expect(wrapper.find(`.${prefix}--slider`).length).toBe(1);
    });

    it('renders extra classes passed in via className', () => {
      expect(
        wrapper.find(`.${prefix}--slider`).hasClass('extra-class')
      ).toEqual(true);
    });

    it('can be disabled', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper.props().disabled).toEqual(true);
    });

    it('can set value via props', () => {
      wrapper.setProps({ value: 55 });
      expect(wrapper.props().value).toEqual(55);
    });

    it('should change the value upon change in props', () => {
      wrapper.setProps({ value: 1 });
      wrapper.setState({ value: 1 });
      wrapper.update();
      wrapper.setProps({ value: 2 });
      expect(wrapper.state().value).toEqual(2);
    });

    it('should accurately position slider on mount', () => {
      expect(wrapper.state().left).toEqual(0);
    });

    it('should specify light version as expected', () => {
      expect(wrapper.props().light).toEqual(false);
      wrapper.setProps({ light: true });
      expect(wrapper.props().light).toEqual(true);
    });

    it('marks input field as hidden if hidden via props', () => {
      wrapper.setProps({ hideTextInput: true });
      expect(wrapper.find(`#${id}-input-for-slider`).props().type).toEqual(
        'hidden'
      );
    });

    it('sets style to display:none on input field if hidden via props', () => {
      wrapper.setProps({ hideTextInput: true });
      expect(wrapper.find(`#${id}-input-for-slider`).props().style).toEqual({
        display: 'none',
      });
    });
  });

  describe('Supporting label', () => {
    it('concatenates the value and the label by default', () => {
      const wrapper = mount(
        <Slider min={0} minLabel="min" max={100} maxLabel="max" value={0} />
      );
      expect(
        wrapper.find(`.${prefix}--slider__range-label`).first().text()
      ).toBe('0min');
      expect(
        wrapper.find(`.${prefix}--slider__range-label`).last().text()
      ).toBe('100max');
    });

    it('supports custom formatting of the label', () => {
      const wrapper = mount(
        <Slider
          min={0}
          minLabel="min"
          max={100}
          maxLabel="max"
          formatLabel={(value, label) => `${value}-${label}`}
          value={0}
        />
      );
      expect(
        wrapper.find(`.${prefix}--slider__range-label`).first().text()
      ).toBe('0-min');
      expect(
        wrapper.find(`.${prefix}--slider__range-label`).last().text()
      ).toBe('100-max');
    });
  });

  describe('key/mouse event processing', () => {
    const handleChange = jest.fn();
    const handleRelease = jest.fn();
    const handleBlur = jest.fn();

    const wrapper = mount(
      <Slider
        id="slider"
        className="extra-class"
        value={50}
        min={0}
        max={100}
        step={1}
        stepMultiplier={5}
        onChange={handleChange}
        onRelease={handleRelease}
        onBlur={handleBlur}
      />
    );

    it('sets correct state from event with a right/up keydown', () => {
      const evt = {
        type: 'keydown',
        which: '38',
      };
      wrapper.instance().onKeyDown(evt);
      expect(wrapper.state().value).toEqual(51);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 51 });
    });

    it('sets correct state from event with a left/down keydown', () => {
      const evt = {
        type: 'keydown',
        which: '40',
      };
      wrapper.instance().onKeyDown(evt);
      expect(wrapper.state().value).toEqual(50);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 50 });
    });

    it('correctly uses setMultiplier with a right/up keydown', () => {
      const evt = {
        type: 'keydown',
        which: '38',
        shiftKey: true,
      };
      wrapper.instance().onKeyDown(evt);
      expect(wrapper.state().value).toEqual(55);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 55 });
    });

    it('sets correct state from event with a clientX in a mousemove', () => {
      const evt = {
        type: 'mousemove',
        clientX: '1000',
      };
      wrapper.instance()._onDrag(evt);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 100 });
      expect(wrapper.state().value).toEqual(100);
    });

    it('sets correct state from event with a clientX in a touchmove', () => {
      const evt = {
        type: 'touchmove',
        touches: [{ clientX: '0' }],
      };
      wrapper.instance()._onDrag(evt);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 0 });
      expect(wrapper.state().value).toEqual(0);
    });

    it('throttles mousemove events', () => {
      expect(wrapper.instance().onDrag.throttled).toBe(true);
    });

    describe('user is holding the handle', () => {
      it('does not call onRelease', () => {
        const evt = {
          type: 'mousemove',
          clientX: '1000',
        };
        handleRelease.mockClear();
        expect(handleRelease).not.toHaveBeenCalled();

        wrapper.instance().onDragStart(evt);
        wrapper.instance().onDrag(evt);
        expect(handleRelease).not.toHaveBeenCalled();
      });
    });

    describe('user releases the handle', () => {
      it('calls onRelease', () => {
        handleRelease.mockClear();
        expect(handleRelease).not.toHaveBeenCalled();
        wrapper.setState({
          needsOnRelease: true,
        });
        wrapper.instance().onDragStop();
        expect(handleRelease).toHaveBeenCalled();
      });
    });

    it('allows user to set invalid value when typing in input field', () => {
      const evt = {
        target: {
          value: '999',
        },
      };

      wrapper.instance().onChange(evt);
      expect(wrapper.state().value).toEqual(999);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 999 });
    });

    it('checks for validity onBlur', () => {
      const checkValidity = jest.fn();

      const evt = {
        target: {
          value: '',
          checkValidity: checkValidity,
        },
      };

      wrapper.instance().onBlur(evt);
      expect(checkValidity).toHaveBeenCalled();
    });

    it('sets correct state when typing a valid value in input field', () => {
      const evt = {
        target: {
          value: '12',
        },
      };

      wrapper.instance().onChange(evt);
      expect(wrapper.state().value).toEqual(12);
      expect(handleChange).toHaveBeenLastCalledWith({ value: 12 });
    });
  });

  describe('syncs invalid state and props', () => {
    const handleChange = jest.fn();
    const handleRelease = jest.fn();
    const handleBlur = jest.fn();

    const wrapper = mount(
      <Slider
        id="slider"
        className="extra-class"
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={handleChange}
        onRelease={handleRelease}
        onBlur={handleBlur}
        invalid={false}
      />
    );

    it('overrides invalid state for invalid prop', () => {
      const changeEvt = {
        target: {
          value: '200',
        },
      };

      const blurEvt = {
        target: {
          checkValidity: () => false,
        },
      };

      wrapper.instance().onChange(changeEvt);
      wrapper.instance().onBlur(blurEvt);
      expect(wrapper.state().value).toEqual(200);
      expect(wrapper.state().isValid).toEqual(true);
      expect(
        wrapper
          .find(`.${prefix}--slider-text-input`)
          .hasClass(`${prefix}--text-input--invalid`)
      ).toEqual(false);
    });
  });

  describe('error handling', () => {
    const handleChange = jest.fn();
    const handleRelease = jest.fn();
    const wrapper = mount(
      <Slider
        id="slider"
        className="extra-class"
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={handleChange}
        onRelease={handleRelease}
      />
    );

    it('handles non-number typed into input field', () => {
      const evt = {
        target: {
          value: '',
        },
      };
      wrapper.instance().onChange(evt);
      expect(wrapper.state().value).toEqual('');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('gracefully tolerates empty event passed to _onDrag', () => {
      const evt = {};
      wrapper.instance()._onDrag(evt);
      expect(wrapper.state().value).toEqual(''); // from last test
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('gracefully tolerates empty event passed to onChange', () => {
      const evt = {};
      wrapper.instance().onChange(evt);
      expect(wrapper.state().value).toEqual(''); // from last test
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('gracefully tolerates empty event passed to onBlur', () => {
      const evt = {};
      wrapper.instance().onBlur(evt);
      expect(wrapper.state().value).toEqual(''); // from last test
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('gracefully tolerates empty event passed to onKeyDown', () => {
      const evt = {};
      wrapper.instance().onKeyDown(evt);
      expect(wrapper.state().value).toEqual(''); // from last test
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('gracefully tolerates bad key code passed to onKeyDown', () => {
      const evt = {
        which: '123',
      };
      wrapper.instance().onKeyDown(evt);
      expect(wrapper.state().value).toEqual(''); // from last test
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('slider is disabled', () => {
    const handleChange = jest.fn();
    const handleRelease = jest.fn();
    const wrapper = mount(
      <Slider
        id="slider"
        className="extra-class"
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={handleChange}
        onRelease={handleRelease}
        disabled={true}
      />
    );

    it('does nothing when trying to type in the input', () => {
      const evt = {
        target: {
          value: '',
        },
      };
      wrapper.instance().onChange(evt);
      expect(wrapper.state().value).toEqual(50);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does nothing when trying to start a drag', () => {
      const evt = {
        type: 'mousedown',
        clientX: '1001',
      };
      wrapper.instance().onDragStart(evt);
      expect(wrapper.state().value).toEqual(50);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does nothing when trying to drag', () => {
      const evt = {
        type: 'mousemove',
        clientX: '1000',
      };
      wrapper.instance()._onDrag(evt);
      expect(wrapper.state().value).toEqual(50);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does nothing when trying to stop a drag', () => {
      const evt = {
        type: 'mouseup',
        clientX: '1001',
      };
      wrapper.instance().onDragStop(evt);
      expect(wrapper.state().needsOnRelease).toEqual(false);
      expect(handleChange).not.toHaveBeenCalled();
      expect(handleRelease).not.toHaveBeenCalled();
    });

    it('does nothing when using arrow key', () => {
      const evt = {
        type: 'keydown',
        which: '40',
      };
      wrapper.instance().onKeyDown(evt);
      expect(wrapper.state().value).toEqual(50);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});

describe('SliderSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<SliderSkeleton />);

    const slider = wrapper.find(`.${prefix}--slider-container`);

    it('Has the expected classes', () => {
      expect(slider.hasClass(`${prefix}--skeleton`)).toEqual(true);
    });
  });
});
