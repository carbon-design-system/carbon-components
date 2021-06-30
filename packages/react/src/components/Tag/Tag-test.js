/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Tag from '../Tag';
import TagSkeleton from '../Tag/Tag.Skeleton';
import { Add } from '@carbon/icons-react/next';
import { shallow } from 'enzyme';
import { settings } from 'carbon-components';
import { render, cleanup } from '@carbon/test-utils/react';

const { prefix } = settings;

describe('Tag', () => {
  afterEach(cleanup);

  describe('automated accessibility testing', () => {
    it('should have no Axe violations', async () => {
      const { container } = render(<Tag type="red">This is not a tag</Tag>);
      await expect(container).toHaveNoAxeViolations();
    });

    it('should have no AC violations', async () => {
      const { container } = render(
        <main>
          <Tag type="red">This is not a tag</Tag>
        </main>
      );
      await expect(container).toHaveNoACViolations('Tag');
    });
  });

  describe('with a screenreader', () => {
    it('filtered variant should have appropriate aria-label', () => {
      const children = 'tag content';
      const { container } = render(
        <Tag type="red" filter>
          {children}
        </Tag>
      );
      const button = container.querySelector('[aria-label], [aria-labelledby]');
      const accessibilityLabel =
        button.getAttribute('aria-label') ||
        button.getAttribute('aria-labelledby');
      // This check would mirror our "Accessibility label must contain at least all of visible label"
      // requirement
      expect(accessibilityLabel).toEqual(expect.stringContaining(children));
    });
  });

  describe('Renders as expected', () => {
    it('should render with the appropriate type', () => {
      const tag = shallow(<Tag type="red" />);
      expect(tag.hasClass(`${prefix}--tag`)).toEqual(true);
      expect(tag.hasClass(`${prefix}--tag--red`)).toEqual(true);
    });
  });

  it('should allow for a custom label', () => {
    const tag = shallow(<Tag type="red">New Version!</Tag>);
    expect(tag.text()).toEqual('New Version!');
  });

  it('should allow for a custom icon', () => {
    const tag = shallow(
      <Tag type="red" renderIcon={Add}>
        This is a tag
      </Tag>
    );
    expect(tag.childAt(0).hasClass('bx--tag__custom-icon'));
  });

  it('should support extra class names', () => {
    const tag = shallow(<Tag type="red" className="extra-class" />);
    expect(tag.hasClass('extra-class')).toEqual(true);
  });
});

describe('TagSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<TagSkeleton />);

    it('Has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--skeleton`)).toEqual(true);
      expect(wrapper.hasClass(`${prefix}--tag`)).toEqual(true);
    });
  });
});
