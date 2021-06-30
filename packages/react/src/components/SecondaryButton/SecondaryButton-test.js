/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Search } from '@carbon/icons-react/next';
import SecondaryButton from '../SecondaryButton';
import { shallow, mount } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;

describe('SecondaryButton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(
      <SecondaryButton size="sm" className="extra-class">
        <div className="child">Test</div>
        <div className="child">Test</div>
      </SecondaryButton>
    );

    it('Renders children as expected', () => {
      expect(wrapper.find('.child').length).toBe(2);
      expect(wrapper.find('svg').length).toBe(0);
    });
    it('Renders wrapper as expected', () => {
      expect(wrapper.length).toBe(1);
    });
    it('Has the expected kind set to "secondary"', () => {
      expect(wrapper.props().kind).toEqual('secondary');
    });
    it('Should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });

    describe('Renders icon buttons', () => {
      const iconButton = mount(
        <SecondaryButton renderIcon={Search} iconDescription="Search">
          Search
        </SecondaryButton>
      );
      const icon = iconButton.find('svg');
      it('should have the appropriate icon', () => {
        expect(icon.hasClass(`${prefix}--btn__icon`)).toBe(true);
      });
    });
  });
});
