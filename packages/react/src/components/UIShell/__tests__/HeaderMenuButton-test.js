/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Fade } from '@carbon/icons-react/next';
import React from 'react';
import { mount } from 'enzyme';
import { HeaderMenuButton } from '../';

describe('HeaderMenuButton', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      'aria-label': 'Accessibility label',
      className: 'custom-class',
      onClick: jest.fn(),
      isActive: false,
    };
  });

  it('should render', () => {
    const wrapper = mount(
      <HeaderMenuButton {...mockProps}>
        <Fade size={32} />
      </HeaderMenuButton>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
