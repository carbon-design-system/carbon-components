/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import OverflowMenu from '../OverflowMenu';
import OverflowMenuItem from '../OverflowMenuItem';
import { OverflowMenuVertical } from '@carbon/icons-react/next';
import { mount } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;

describe('OverflowMenu', () => {
  describe('Renders as expected', () => {
    const rootWrapper = mount(
      <OverflowMenu className="extra-class">
        <OverflowMenuItem className="test-child">one</OverflowMenuItem>
        <OverflowMenuItem className="test-child">two</OverflowMenuItem>
      </OverflowMenu>
    );
    const menu = rootWrapper.find(`button.${prefix}--overflow-menu`);
    const icon = menu.find(OverflowMenuVertical);

    it('should render an Icon', () => {
      expect(icon.length).toBe(1);
      expect(icon.hasClass(`${prefix}--overflow-menu__icon`)).toEqual(true);
    });

    it('has the expected classes', () => {
      expect(menu.hasClass(`${prefix}--overflow-menu`)).toBe(true);
      expect(menu.hasClass(`${prefix}--overflow-menu--open`)).not.toBe(true);
    });

    it('should not render a ul unless menu is open', () => {
      const list = menu.find('ul');
      expect(list.length).toEqual(0);
    });

    it('should add extra classes that are passed via className', () => {
      expect(menu.hasClass('extra-class')).toEqual(true);
    });

    it('should not render children unless the menu is open', () => {
      expect(menu.find('.test-child').length).toEqual(0);
    });

    it('should set tabIndex if one is passed via props', () => {
      rootWrapper.setProps({ tabIndex: 2 });

      expect(
        rootWrapper.find(`button.${prefix}--overflow-menu`).props().tabIndex
      ).toEqual(2);
    });

    it('should set ariaLabel if one is passed via props', () => {
      rootWrapper.setProps({ ariaLabel: 'test label' });
      expect(
        rootWrapper.find(`button.${prefix}--overflow-menu`).props()[
          'aria-label'
        ]
      ).toEqual('test label');
    });

    it('should set id if one is passed via props', () => {
      rootWrapper.setProps({ id: 'uniqueId' });
      expect(
        rootWrapper.find(`button.${prefix}--overflow-menu`).props().id
      ).toEqual('uniqueId');
    });

    it('should specify light version as expected', () => {
      rootWrapper.setProps({ light: true });
      expect(rootWrapper.props().light).toEqual(true);
    });
    it('should add light modifier to overflow menu', () => {
      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper
        .setProps({ light: true })
        .find('OverflowMenu')
        .instance()
        .setState({ open: true });
      rootWrapper.update();

      const oMenu = rootWrapper.find(`.${prefix}--overflow-menu`);
      const oMenuOptions = rootWrapper.find(
        `.${prefix}--overflow-menu-options`
      );
      expect(oMenu.hasClass(`${prefix}--overflow-menu--light`)).toEqual(true);
      expect(
        oMenuOptions.hasClass(`${prefix}--overflow-menu-options--light`)
      ).toEqual(true);
    });
  });

  describe('open and closed states', () => {
    it('open state should be false by default', () => {
      const rootWrapper = mount(<OverflowMenu />);
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(rootWrapper.find('OverflowMenu').instance().state.open).toEqual(
        false
      );
      // Enzyme doesn't seem to allow props() in a forwardRef-wrapped class component
      expect(rootWrapper.find('OverflowMenu').instance().props.open).toEqual(
        false
      );
    });

    it('should render a ul with the appropriate class', () => {
      const rootWrapper = mount(
        <OverflowMenu menuOptionsClass="extra-menu-class">
          <OverflowMenuItem className="test-child">one</OverflowMenuItem>
          <OverflowMenuItem className="test-child">two</OverflowMenuItem>
        </OverflowMenu>
      );
      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper.find('OverflowMenu').instance().setState({ open: true });
      rootWrapper.update();
      const list = rootWrapper.find('ul');
      expect(list.length).toEqual(1);
      expect(list.hasClass(`${prefix}--overflow-menu-options`)).toEqual(true);
      expect(list.hasClass('extra-menu-class')).toEqual(true);
    });

    it('should render children as expected', () => {
      const rootWrapper = mount(
        <OverflowMenu>
          <OverflowMenuItem className="test-child">one</OverflowMenuItem>
          <OverflowMenuItem className="test-child">two</OverflowMenuItem>
        </OverflowMenu>
      );
      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper.find('OverflowMenu').instance().setState({ open: true });
      rootWrapper.update();
      expect(rootWrapper.find('button.test-child').length).toEqual(2);
    });

    it('should set expected class when state is open', () => {
      const rootWrapper = mount(<OverflowMenu />);
      const openClass = `${prefix}--overflow-menu-options--open`;
      expect(rootWrapper.find('ul').length).toEqual(0);
      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper.find('OverflowMenu').instance().setState({ open: true });
      rootWrapper.update();
      expect(rootWrapper.find('ul').hasClass(openClass)).not.toEqual(false);
    });

    it('should be in an open state after icon is clicked', () => {
      const rootWrapper = mount(<OverflowMenu />);
      const menu = rootWrapper.childAt(0);
      const icon = menu.find(OverflowMenuVertical);

      icon.simulate('click');
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(rootWrapper.find('OverflowMenu').instance().state.open).toEqual(
        true
      );
    });

    it('should NOT toggle state in response to Enter or Space when the menu is open', () => {
      const enterKey = 13;
      const spaceKey = 32;
      const rootWrapper = mount(<OverflowMenu />);
      const menu = rootWrapper.childAt(0);

      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper.find('OverflowMenu').instance().setState({ open: true });

      menu.simulate('keydown', { which: spaceKey });
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(rootWrapper.find('OverflowMenu').instance().state.open).toEqual(
        true
      );
      menu.simulate('keydown', { which: enterKey });
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(rootWrapper.find('OverflowMenu').instance().state.open).toEqual(
        true
      );
    });

    // Removed until a better solution appears
    //
    // it('should be hidden when it loses focus', () => {
    //   const rootWrapper = mount(
    //     <OverflowMenu className="extra-class">
    //       <div className="test-child"></div>
    //       <div className="test-child"></div>
    //     </OverflowMenu>
    //   );
    //   const menu = rootWrapper.childAt(0);

    //   rootWrapper.setState({ open: true });

    //   menu.simulate('blur');
    //   expect(rootWrapper.state().open).toEqual(false);
    // });

    it('should be in a closed state after handleOutsideClick() is invoked', () => {
      const rootWrapper = mount(<OverflowMenu />);

      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(
        rootWrapper.find('OverflowMenu').instance().state.open
      ).not.toEqual(true);

      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper.find('OverflowMenu').instance().setState({ open: true });

      rootWrapper
        .find('ClickListener')
        .props()
        .onClickOutside({ target: document.body });

      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(
        rootWrapper.find('OverflowMenu').instance().state.open
      ).not.toEqual(true);
    });

    it('open state should be controlled by open props', () => {
      const rootWrapper = mount(<OverflowMenu />);

      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      rootWrapper.find('OverflowMenu').instance().setState({ open: true });

      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(rootWrapper.find('OverflowMenu').instance().state.open).toEqual(
        true
      );
    });
  });

  describe('customized icon', () => {
    it('renders', () => {
      const rootWrapper = mount(
        <OverflowMenu
          className="extra-class"
          renderIcon={() => <div className="other">Other</div>}>
          <OverflowMenuItem className="test-child">one</OverflowMenuItem>
          <OverflowMenuItem className="test-child">two</OverflowMenuItem>
        </OverflowMenu>
      );
      // renderIcon should be the only component where `${prefix}--overflow-menu__icon` class is applied,
      // meaning no actual DOM node should have that class
      const nodesWithIconClasses = rootWrapper.find(
        `.${prefix}--overflow-menu__icon`
      );
      expect(nodesWithIconClasses.length).toBe(
        nodesWithIconClasses.filter('renderIcon').length
      );
      expect(rootWrapper.find('.other')).toHaveLength(1);
    });
  });

  describe('Getting derived state from props', () => {
    it('should change the open state upon change in props', () => {
      const wrapper = mount(<OverflowMenu open />);
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(wrapper.find('OverflowMenu').instance().state.open).toEqual(true);
      wrapper.setProps({ open: false });
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(wrapper.find('OverflowMenu').instance().state.open).toEqual(false);
    });

    it('should avoid change the open state upon setting props, unless there the value actually changes', () => {
      const wrapper = mount(<OverflowMenu />);
      wrapper.setProps({ open: true });
      // Enzyme doesn't seem to allow setState() in a forwardRef-wrapped class component
      wrapper.find('OverflowMenu').instance().setState({ open: false });
      wrapper.update();
      wrapper.setProps({ open: true });
      // Enzyme doesn't seem to allow state() in a forwardRef-wrapped class component
      expect(wrapper.find('OverflowMenu').instance().state.open).toEqual(false);
    });
  });
});
