/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Search } from '@carbon/icons-react/next';
import Button from '../Button';
import Link from '../Link';
import ButtonSkeleton from '../Button/Button.Skeleton';
import { shallow, mount } from 'enzyme';
import { settings } from 'carbon-components';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const { prefix } = settings;

describe('Button', () => {
  describe('Renders common props as expected', () => {
    const wrapper = shallow(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <Button tabIndex={2} className="extra-class">
        <div className="child">child</div>
        <div className="child">child</div>
      </Button>
    );

    const wrapperHref = shallow(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <Button tabIndex={2} className="extra-class" href="/home">
        <div className="child">child</div>
        <div className="child">child</div>
      </Button>
    );

    it('renders children as expected', () => {
      expect(wrapper.find('.child').length).toBe(2);
      expect(wrapperHref.find('.child').length).toBe(2);
    });

    it('should set tabIndex if one is passed via props', () => {
      expect(wrapper.props().tabIndex).toEqual(2);
      expect(wrapperHref.props().tabIndex).toEqual(2);
    });

    it('should add extra classes via className', () => {
      expect(wrapper.hasClass('extra-class')).toBe(true);
      expect(wrapperHref.hasClass('extra-class')).toBe(true);
    });
  });

  describe('Renders <button> props as expected', () => {
    const wrapper = shallow(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <Button tabIndex={2}>
        <div className="child">child</div>
        <div className="child">child</div>
      </Button>
    );

    it('renders as a <button> element without an href', () => {
      expect(wrapper.is('button')).toBe(true);
    });

    it('should set disabled to false by default', () => {
      expect(wrapper.props().disabled).toBe(false);
    });

    it('should set disabled if one is passed via props', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper.props().disabled).toBe(true);
    });

    it('should set type to button by default', () => {
      expect(wrapper.props().type).toEqual('button');
    });

    it('should only set type to [button, reset or submit] if one is passed via props', () => {
      wrapper.setProps({ type: 'reset' });
      expect(wrapper.props().type).toEqual('reset');
      wrapper.setProps({ type: 'submit' });
      expect(wrapper.props().type).toEqual('submit');
    });
  });

  describe('Renders <a> props as expected', () => {
    const wrapper = shallow(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <Button href="#" tabIndex={2}>
        <div className="child">child</div>
        <div className="child">child</div>
      </Button>
    );

    it('renders as an <a> element with an href', () => {
      expect(wrapper.is('a')).toBe(true);
    });
  });

  describe('Renders arbitrary component with correct props', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(
        <Button as={Link} data-foo="foo">
          <div className="child">child</div>
          <div className="child">child</div>
        </Button>
      );
    });
    it('renders as a Link with data attribute', () => {
      expect(wrapper.is(Link)).toBe(true);
      expect(wrapper.is('[data-foo="foo"]')).toBe(true);
    });
  });

  describe('Renders icon buttons', () => {
    const iconButton = mount(
      <Button renderIcon={Search} iconDescription="Search">
        Search
      </Button>
    );
    const icon = iconButton.find('svg');

    it('should have the appropriate icon', () => {
      expect(icon.hasClass(`${prefix}--btn__icon`)).toBe(true);
    });

    it('should return error if icon given without description', () => {
      const props = {
        renderIcon: Search,
      };
      // eslint-disable-next-line quotes
      const error = new Error(
        'renderIcon property specified without also providing an iconDescription property.'
      );
      expect(Button.propTypes.iconDescription(props)).toEqual(error);
    });
  });

  describe('Renders custom icon buttons', () => {
    const iconButton = mount(
      <Button renderIcon={Search} iconDescription="Search">
        Search
      </Button>
    );
    const originalIcon = mount(<Search />).find('svg');
    const icon = iconButton.find('svg');

    it('should have the appropriate icon', () => {
      expect(icon.hasClass(`${prefix}--btn__icon`)).toBe(true);
      expect(icon.find(':not(svg):not(title)').html()).toBe(
        originalIcon.children().html()
      );
    });

    it('should return error if icon given without description', () => {
      const props = {
        renderIcon: Search,
      };
      // eslint-disable-next-line quotes
      const error = new Error(
        'renderIcon property specified without also providing an iconDescription property.'
      );
      expect(Button.propTypes.iconDescription(props)).toEqual(error);
    });
  });
});

describe('Primary Button', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<Button className="extra-class" />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

describe('Secondary Button', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(
      <Button kind="secondary" className="extra-class" />
    );

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--secondary`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

describe('Ghost Button', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<Button kind="ghost" className="extra-class" />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--ghost`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

// V11: update this to `Extra Large Button`
describe('Large Button', () => {
  describe('Renders as expected', () => {
    // V11: update this size to `xl`
    const wrapper = shallow(<Button size="lg" className="extra-class" />);

    it('has the expected classes', () => {
      // V11: update this to `xl`
      expect(wrapper.hasClass(`${prefix}--btn--lg`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

// V11: update this to `Extra Extra Large Button`
describe('Extra Large Button', () => {
  describe('Renders as expected', () => {
    // V11: update this size to `2xl`
    const wrapper = shallow(<Button size="xl" className="extra-class" />);

    it('has the expected classes', () => {
      // V11: update to 2xl
      expect(wrapper.hasClass(`${prefix}--btn--xl`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

describe('Small Button', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<Button size="small" className="extra-class" />);

    it('has the expected classes for small', () => {
      expect(wrapper.hasClass(`${prefix}--btn--sm`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
  describe('deprecated prop `small`', () => {
    const wrapper = shallow(<Button size="sm" className="extra-class" />);

    it('has the expected classes for small', () => {
      expect(wrapper.hasClass(`${prefix}--btn--sm`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

describe('DangerButton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<Button kind="danger" className="extra-class" />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--danger`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });

  describe('Renders tertiary variation as expected', () => {
    const wrapper = shallow(<Button kind="danger--tertiary" />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--danger--tertiary`)).toEqual(
        true
      );
    });
  });

  describe('Renders ghost variation as expected', () => {
    const wrapper = shallow(<Button kind="danger--ghost" />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--danger--ghost`)).toEqual(true);
    });
  });
});

describe('danger--primaryButton', () => {
  describe('Renders as exptected', () => {
    const wrapper = shallow(
      <Button kind="danger--primary" className="extra-class" />
    );

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--danger--primary`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

describe('TertiaryButton', () => {
  describe('Renders as exptected', () => {
    const wrapper = shallow(<Button kind="tertiary" className="extra-class" />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--btn--tertiary`)).toEqual(true);
    });

    it('should add extra classes that are passed via className', () => {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});

describe('Icon-only button', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(<Button hasIconOnly />);

    it('has the expected classes', () => {
      expect(
        wrapper.find('button').hasClass(`${prefix}--btn--icon-only`)
      ).toEqual(true);
      expect(
        wrapper.find('button').hasClass(`${prefix}--tooltip__trigger`)
      ).toEqual(true);
      expect(
        wrapper.find('button').hasClass(`${prefix}--tooltip--a11y`)
      ).toEqual(true);
    });

    it('should only set tooltip position and alignment if passed via props', () => {
      wrapper.setProps({ tooltipPosition: 'bottom' });
      expect(wrapper.props().tooltipPosition).toEqual('bottom');
      wrapper.setProps({ tooltipAlignment: 'center' });
      expect(wrapper.props().tooltipAlignment).toEqual('center');
    });

    it('should contain assistive text', () => {
      wrapper.setProps({ tooltipPosition: 'bottom' });
      wrapper.setProps({ tooltipAlignment: 'center' });
      expect(wrapper.find(`.${prefix}--assistive-text`).length).toEqual(1);
    });
  });
});

describe('ButtonSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<ButtonSkeleton />);

    it('has the expected classes', () => {
      expect(wrapper.hasClass(`${prefix}--skeleton`)).toEqual(true);
      expect(wrapper.hasClass(`${prefix}--btn`)).toEqual(true);
    });
  });

  describe('Renders <a> props as expected', () => {
    const wrapper = shallow(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <ButtonSkeleton href="#" />
    );

    it('renders as an <a> element with an href', () => {
      expect(wrapper.is('a')).toBe(true);
    });

    it('should always render with [role="button"] by default', () => {
      expect(wrapper.props().role).toEqual('button');
    });
  });
});

describe('Small ButtonSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<ButtonSkeleton small />);

    it('has the expected classes for small', () => {
      expect(wrapper.hasClass(`${prefix}--btn--sm`)).toEqual(true);
      expect(wrapper.hasClass(`${prefix}--skeleton`)).toEqual(true);
    });
  });
});

describe('Small ButtonSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<ButtonSkeleton small />);

    it('has the expected classes for small', () => {
      expect(wrapper.hasClass(`${prefix}--btn--sm`)).toEqual(true);
      expect(wrapper.hasClass(`${prefix}--skeleton`)).toEqual(true);
    });
  });
});

describe('Button accessibility', () => {
  afterEach(cleanup);

  it('should have no Axe violations', async () => {
    render(<Button>Button Label</Button>);

    await expect(screen.getByRole('button')).toHaveNoAxeViolations();
  });

  it('should have no Accessibility Checker violations', async () => {
    render(
      <main>
        <Button>Button Label</Button>
      </main>
    );

    await expect(screen.getByRole('button')).toHaveNoACViolations('Button');
  });

  it('is keyboard accessible', () => {
    render(<Button>Button Label</Button>);
    userEvent.tab();
    expect(screen.getByText('Button Label')).toHaveFocus();
  });

  it('should have an accessible label', () => {
    render(<Button>Button Label</Button>);
    expect(() => screen.getByText('Button Label')).not.toThrow();
  });

  it('should have the role of button', () => {
    render(<Button>Button Label</Button>);
    expect(() => screen.getByRole('button')).not.toThrow();
  });

  it('is not keyboard accessible when disabled', () => {
    render(<Button disabled>Button Label</Button>);
    userEvent.tab();
    expect(document.body).toHaveFocus();
  });
});
