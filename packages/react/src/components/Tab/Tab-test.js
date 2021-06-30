/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';

const { prefix } = settings;

describe('Tab', () => {
  describe('renders as expected', () => {
    let React;
    let enzyme;
    let mount;
    let Tab;
    let wrapper;

    beforeEach(() => {
      jest.isolateModules(() => {
        React = require('react');
        enzyme = require('enzyme');
        mount = enzyme.mount;
        Tab = require('../Tab').default;

        const Adapter = require('enzyme-adapter-react-16');
        enzyme.configure({ adapter: new Adapter() });

        wrapper = mount(<Tab label="firstTab" />);
      });
    });

    it('adds extra classes that are passed via className', () => {
      wrapper.setProps({ className: 'extra-class' });
      expect(wrapper.hasClass('extra-class')).toBe(true);
    });

    it('renders <button> with expected className', () => {
      expect(
        // TODO: uncomment and replace assertion in next major version
        // wrapper.find('button').hasClass(`${prefix}--tabs__nav-link`)
        wrapper.find('button').hasClass(`${prefix}--tabs--scrollable__nav-link`)
      ).toBe(true);
    });

    it('renders <li> with [role="presentation"]', () => {
      expect(wrapper.props().role).toEqual('presentation');
    });

    it('renders <button> with tabindex set to 0', () => {
      expect(wrapper.find('button').props().tabIndex).toEqual(0);
    });

    it('uses label to set children on <button> when passed via props', () => {
      expect(wrapper.find('button').props().children).toEqual('firstTab');
    });

    it(`should not have [className="${prefix}--tabs__nav-item--selected"] by default`, () => {
      expect(wrapper.hasClass(`${prefix}--tabs__nav-item--selected`)).toBe(
        false
      );
    });

    it('has aria-disabled that matches disabled', () => {
      const getDisabledRegion = () => wrapper.find('[aria-disabled]');

      expect(getDisabledRegion().length).toEqual(0);

      wrapper.setProps({ disabled: true });
      expect(getDisabledRegion().prop('aria-disabled')).toEqual(true);
    });

    it(`adds [className="${prefix}--tabs__nav-item--selected"] when selected prop is true`, () => {
      wrapper.setProps({ selected: true });
      expect(
        wrapper.children().hasClass(`${prefix}--tabs__nav-item--selected`)
      ).toBe(true);
    });
  });

  describe('events', () => {
    let React;
    let enzyme;
    let mount;
    let Tab;

    beforeEach(() => {
      jest.isolateModules(() => {
        React = require('react');
        enzyme = require('enzyme');
        mount = enzyme.mount;
        Tab = require('../Tab').default;

        const Adapter = require('enzyme-adapter-react-16');

        enzyme.configure({ adapter: new Adapter() });
      });
    });

    describe('click', () => {
      let wrapper;
      let onClick;
      let handleTabClick;

      beforeEach(() => {
        wrapper = mount(<Tab label="firstTab" />);
        onClick = jest.fn();
        handleTabClick = jest.fn();
      });

      it('invokes handleTabClick from onClick prop', () => {
        wrapper.setProps({ handleTabClick });
        wrapper.simulate('click');
        expect(handleTabClick).toBeCalled();
      });

      it('invokes onClick when a function is passed to onClick prop', () => {
        wrapper.setProps({ onClick });
        wrapper.simulate('click');
        expect(onClick).toBeCalled();
      });
    });

    describe('keydown', () => {
      let onKeyDown;
      let handleTabKeyDown;
      let wrapper;

      beforeEach(() => {
        onKeyDown = jest.fn();
        handleTabKeyDown = jest.fn();
        wrapper = mount(
          <Tab
            label="firstTab"
            onKeyDown={onKeyDown}
            handleTabKeyDown={handleTabKeyDown}
          />
        );
      });

      it('invokes onKeyDown when a function is passed to onKeyDown prop', () => {
        wrapper.simulate('keyDown', { which: 38 });
        expect(onKeyDown).toBeCalled();
      });

      it('invokes handleTabAnchorFocus when onKeyDown occurs for appropriate events', () => {
        wrapper.simulate('keyDown', { which: 37 });
        expect(onKeyDown).toBeCalled();
      });
    });
  });

  describe('deprecated', () => {
    let React;
    let enzyme;
    let mount;
    let Tab;

    beforeEach(() => {
      jest.isolateModules(() => {
        jest.mock('../../prop-types/deprecate', () => {
          return jest.fn().mockImplementation(() => jest.fn());
        });

        React = require('react');
        enzyme = require('enzyme');
        mount = enzyme.mount;
        Tab = require('../Tab').default;

        const Adapter = require('enzyme-adapter-react-16');

        enzyme.configure({ adapter: new Adapter() });
      });
    });

    test('custom render label', () => {
      const wrapper = mount(
        <Tab
          renderAnchor={() => (
            <a id="custom-label" href="#other-content">
              Content
            </a>
          )}
        />
      );
      expect(wrapper.find('#custom-label').props().href).toEqual(
        '#other-content'
      );
    });

    it('sets tabIndex on <button> if one is passed via props', () => {
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      const wrapper = mount(<Tab label="firstTab" tabIndex={2} />);
      expect(wrapper.find('button').props().tabIndex).toEqual(2);
    });
  });
});
