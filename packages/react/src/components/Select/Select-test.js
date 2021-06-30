/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ChevronDown } from '@carbon/icons-react/next';
import Select from '../Select';
import SelectItem from '../SelectItem';
import SelectSkeleton from '../Select/Select.Skeleton';
import { mount, shallow } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;
describe('Select', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(
      <Select
        id="testing"
        labelText="Select"
        className="extra-class"
        helperText="Helper text">
        <SelectItem />
        <SelectItem />
      </Select>
    );

    const selectContainer = wrapper.find(`.${prefix}--form-item > div`);
    const label = wrapper.find('label');
    const selectWrapper = () => wrapper.find(Select);
    const select = () => wrapper.find('select');
    const helper = wrapper.find(`.${prefix}--form__helper-text`);

    describe('selectContainer', () => {
      it('renders a container', () => {
        expect(selectContainer.length).toEqual(1);
      });

      it('renders the down arrow icon', () => {
        expect(selectContainer.find(ChevronDown).length).toEqual(1);
      });

      it('has the expected classes', () => {
        expect(selectContainer.hasClass(`${prefix}--select`)).toEqual(true);
      });

      it('applies extra classes specified via className', () => {
        expect(selectContainer.hasClass('extra-class')).toEqual(true);
      });

      it('should specify light select as expected', () => {
        expect(selectWrapper().props().light).toEqual(false);
        wrapper.setProps({ light: true });
        expect(selectWrapper().props().light).toEqual(true);
      });
    });

    describe('select', () => {
      it('renders a select', () => {
        expect(selectWrapper().length).toEqual(1);
      });

      it('has the expected classes', () => {
        expect(select().hasClass(`${prefix}--select-input`)).toEqual(true);
      });

      it('has the expected id', () => {
        expect(selectWrapper().props().id).toEqual('testing');
      });

      it('should set defaultValue as expected', () => {
        wrapper.setProps({ defaultValue: 'select-1' });
        expect(select().props().defaultValue).toEqual('select-1');
      });

      it('should set disabled as expected', () => {
        expect(selectWrapper().props().disabled).toEqual(false);
        wrapper.setProps({ disabled: true });
        expect(selectWrapper().props().disabled).toEqual(true);
      });

      it('renders children as expected', () => {
        expect(selectWrapper().props().children.length).toEqual(2);
      });
    });

    describe('label', () => {
      it('renders a label', () => {
        expect(label.length).toEqual(1);
      });

      it('has the expected classes', () => {
        expect(label.hasClass(`${prefix}--label`)).toEqual(true);
      });

      it('has the expected htmlFor value', () => {
        expect(label.props().htmlFor).toEqual('testing');
      });

      it('renders children as expected', () => {
        expect(label.props().children).toEqual('Select');
      });
    });

    describe('helper', () => {
      it('renders a helper', () => {
        expect(helper.length).toEqual(1);
      });

      it('renders children as expected', () => {
        wrapper.setProps({
          helperText: <span>This is helper text.</span>,
        });
        const renderedHelper = wrapper.find(`.${prefix}--form__helper-text`);
        expect(renderedHelper.props().children).toEqual(
          <span>This is helper text.</span>
        );
      });

      it('should set helper text as expected', () => {
        wrapper.setProps({ helperText: 'Helper text' });
        expect(helper.text()).toEqual('Helper text');
      });
    });
  });
  describe('Renders as expected', () => {
    const wrapper = mount(
      <Select id="testing" labelText="Select" className="extra-class" inline>
        <SelectItem />
        <SelectItem />
      </Select>
    );

    const selectContainer = wrapper.find(`.${prefix}--form-item > div`);

    it('has the expected classes', () => {
      expect(selectContainer.hasClass(`${prefix}--select--inline`)).toEqual(
        true
      );
    });
  });
});

describe('refs', () => {
  let container;

  it('should accept refs', () => {
    class MyComponent extends React.Component {
      constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.focus = this.focus.bind(this);
      }
      focus() {
        this.myRef.current.focus();
      }
      render() {
        return <Select id="test" labelText="testlabel" ref={this.myRef} />;
      }
    }
    container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);
    const wrapper = mount(<MyComponent />, {
      attachTo: document.querySelector('#container'),
    });
    expect(document.activeElement.type).toBeUndefined();
    wrapper.instance().focus();
    expect(document.activeElement.type).toEqual('select-one');
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null;
  });
});

describe('SelectSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(<SelectSkeleton />);

    const select = wrapper.find(`.${prefix}--select`);

    it('Has the expected classes', () => {
      expect(select.hasClass(`${prefix}--skeleton`)).toEqual(true);
    });
  });
});
