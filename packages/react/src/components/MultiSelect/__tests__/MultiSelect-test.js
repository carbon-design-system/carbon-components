/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getByText } from '@carbon/test-utils/dom';
import { pressEnter, pressSpace, pressTab } from '@carbon/test-utils/keyboard';
import { render, cleanup } from '@carbon/test-utils/react';
import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import MultiSelect from '../';
import { generateItems, generateGenericItem } from '../../ListBox/test-helpers';
import { keys } from '../../../internal/keyboard';

describe('MultiSelect', () => {
  afterEach(cleanup);

  describe.skip('automated accessibility tests', () => {
    it('should have no axe violations', async () => {
      const items = generateItems(4, generateGenericItem);
      const { container } = render(
        <MultiSelect id="test" label="Field" items={items} />
      );
      await expect(container).toHaveNoAxeViolations();
    });

    it('should have no DAP violations', async () => {
      const items = generateItems(4, generateGenericItem);
      const { container } = render(
        <MultiSelect id="test" label="Field" items={items} />
      );
      await expect(container).toHaveNoDAPViolations();
    });
  });

  it('should initially render with a given label', () => {
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );

    const labelNode = getByText(container, label);
    expect(isElementVisible(labelNode)).toBe(true);

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeNull();
  });

  it('should open the menu when a user clicks on the label', () => {
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );

    const labelNode = getByText(container, label);
    Simulate.click(labelNode);

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeInstanceOf(HTMLElement);
  });

  it('should open the menu when a user hits space while the field is focused', () => {
    const items = generateItems(4, generateGenericItem);
    const { container } = render(
      <MultiSelect id="test" label="test-label" items={items} />
    );

    pressTab();
    pressSpace();

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeInstanceOf(HTMLElement);
  });

  it.skip('should open the menu when a user hits enter while the field is focused', () => {
    const items = generateItems(4, generateGenericItem);
    const { container } = render(
      <MultiSelect id="test" label="test-label" items={items} />
    );

    pressTab();
    pressEnter();

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeInstanceOf(HTMLElement);
  });

  it('should let the user toggle item selection with a mouse', () => {
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );

    const labelNode = getByText(container, label);
    Simulate.click(labelNode);

    const [item] = items;
    const itemNode = getByText(container, item.label);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeNull();

    Simulate.click(itemNode);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeInstanceOf(HTMLElement);

    Simulate.click(itemNode);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeNull();
  });

  it('should close the menu when the user hits the Escape key', () => {
    const items = generateItems(4, generateGenericItem);
    const { container } = render(
      <MultiSelect id="test" label="test-label" items={items} />
    );

    pressTab();
    pressSpace();

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeInstanceOf(HTMLElement);

    Simulate.keyDown(document.activeElement, {
      key: 'Escape',
    });

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeNull();
  });

  it.skip('close menu with click outside of field', () => {
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );
    const labelNode = getByText(container, label);
    const button = document.createElement('BUTTON');
    button.id = 'button-id';
    document.body.appendChild(button);
    const buttonNode = document.getElementById('button-id');

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeFalsy();

    Simulate.click(labelNode);

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeTruthy();

    Simulate.click(buttonNode);

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeFalsy();

    document.body.removeChild(button);
  });

  it.skip('should toggle selection with enter', () => {
    // yeah focus is on the field, you hit the arrows to change the active index, and keydown is on the field since it has focus
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );

    const labelNode = getByText(container, label);
    Simulate.click(labelNode);

    const [item] = items;
    const itemNode = getByText(container, item.label);
    console.log(item.label);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeNull();

    Simulate.keyDown(itemNode, { key: 'Enter' });

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeInstanceOf(HTMLElement);

    Simulate.keyDown(itemNode, { key: 'Enter' });

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeNull();
  });

  it.skip('toggle selection with space', () => {
    // yeah focus is on the field, you hit the arrows to change the active index, and keydown is on the field since it has focus
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );

    const labelNode = getByText(container, label);
    Simulate.click(labelNode);

    const [item] = items;
    const itemNode = getByText(container, item.label);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeNull();

    Simulate.keyDown(itemNode, keys.Space);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeInstanceOf(HTMLElement);

    Simulate.keyDown(itemNode, keys.Space);

    expect(
      document.querySelector('[aria-selected="true"][role="option"]')
    ).toBeNull();
  });

  it('should clear selected items when the user clicks the clear selection button', () => {
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" label={label} items={items} />
    );
    const labelNode = getByText(container, label);
    Simulate.click(labelNode);

    const [item] = items;
    const itemNode = getByText(container, item.label);
    Simulate.click(itemNode);

    expect(
      document.querySelector('[aria-label="Clear Selection"]')
    ).toBeTruthy();

    Simulate.click(document.querySelector('[aria-label="Clear Selection"]'));

    expect(
      document.querySelector('[aria-label="Clear Selection"]')
    ).toBeFalsy();
  });

  it('should not be interactive if disabled', () => {
    const items = generateItems(4, generateGenericItem);
    const label = 'test-label';
    const { container } = render(
      <MultiSelect id="test" disabled label={label} items={items} />
    );
    const labelNode = getByText(container, label);
    Simulate.click(labelNode);

    expect(
      container.querySelector('[aria-expanded="true"][aria-haspopup="true"]')
    ).toBeFalsy();
  });

  describe('Component API', () => {
    it('should set the default selected items with the `initialSelectedItems` prop', () => {
      const items = generateItems(4, generateGenericItem);
      const label = 'test-label';
      const { container } = render(
        <MultiSelect
          id="test-multiselect"
          label={label}
          items={items}
          initialSelectedItems={[items[0], items[1]]}
        />
      );

      expect(
        document.querySelector('[aria-label="Clear Selection"]')
      ).toBeTruthy();

      const labelNode = getByText(container, label);

      Simulate.click(labelNode);

      expect(
        document.querySelector('[aria-selected="true"][role="option"]')
      ).toBeInstanceOf(HTMLElement);
    });

    it('should place the given id on the ___ node when passed in as a prop', () => {
      const items = generateItems(4, generateGenericItem);
      const label = 'test-label';
      // eslint-disable-next-line no-unused-vars
      const { container } = render(
        <MultiSelect
          id="custom-id"
          label={label}
          items={items}
          initialSelectedItems={[items[0], items[1]]}
        />
      );

      expect(document.getElementById('custom-id')).toBeTruthy();
    });

    it('should support a custom itemToString with object items', () => {
      const items = [
        { text: 'joey' },
        { text: 'johnny' },
        { text: 'tommy' },
        { text: 'dee dee' },
        { text: 'marky' },
      ];
      const label = 'test-label';
      const { container } = render(
        <MultiSelect
          id="custom-id"
          label={label}
          items={items}
          itemToString={item => (item ? item.text : '')}
        />
      );
      const labelNode = getByText(container, label);

      Simulate.click(labelNode);

      expect(getByText(container, 'joey')).toBeTruthy();
      expect(getByText(container, 'johnny')).toBeTruthy();
      expect(getByText(container, 'tommy')).toBeTruthy();
      expect(getByText(container, 'dee dee')).toBeTruthy();
      expect(getByText(container, 'marky')).toBeTruthy();
    });

    it('should support custom translation with translateWithId', () => {
      const items = generateItems(4, generateGenericItem);
      const label = 'test-label';
      const translateWithId = jest.fn(() => 'message');

      render(
        <MultiSelect
          id="custom-id"
          translateWithId={translateWithId}
          label={label}
          items={items}
        />
      );

      expect(translateWithId).toHaveBeenCalled();
    });

    it('should call onChange when the selection changes', () => {
      const testFunction = jest.fn();
      const items = generateItems(4, generateGenericItem);
      const label = 'test-label';

      const { container } = render(
        <MultiSelect
          id="custom-id"
          onChange={testFunction}
          label={label}
          items={items}
        />
      );

      const labelNode = getByText(container, label);
      Simulate.click(labelNode);

      const [item] = items;
      const itemNode = getByText(container, item.label);
      Simulate.click(itemNode);

      expect(testFunction).toHaveBeenCalled();
    });

    it('should support an invalid state with invalidText that describes the field', () => {
      const items = generateItems(4, generateGenericItem);
      const label = 'test-label';

      const { container } = render(
        <MultiSelect
          id="custom-id"
          invalid
          invalidText="Fool of a Took!"
          label={label}
          items={items}
        />
      );

      expect(getByText(container, 'Fool of a Took!')).toBeTruthy();

      expect(document.querySelector('[data-invalid="true"')).toBeInstanceOf(
        HTMLElement
      );
    });

    it('should support different feedback modes with selectionFeedback', () => {
      const items = generateItems(4, generateGenericItem);
      const label = 'test-label';
      // eslint-disable-next-line no-unused-vars
      const { container } = render(
        <MultiSelect
          id="custom-id"
          selectionFeedback="top"
          label={label}
          items={items}
        />
      );

      // click the label to open the multiselect options menu
      const labelNode = getByText(container, label);
      Simulate.click(labelNode);

      // click the third option down in the list
      const itemNode = getByText(container, thirdItem.label);
      Simulate.click(itemNode);

      // get an array of all the options
      const optionsArray = Array.from(
        document.querySelectorAll('[role="option"]')
      );

      // the first option in the list to the the former third option in the list
      expect(optionsArray[0].title).toMatch('Item 2');
    });
  });
});
