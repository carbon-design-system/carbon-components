/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { MultiSelect } from 'carbon-components-react';

const items = [
  {
    id: 'downshift-1-item-0',
    text: 'Option 1',
  },
  {
    id: 'downshift-1-item-1',
    text: 'Option 2',
  },
  {
    id: 'downshift-1-item-2',
    text: 'Option 3',
  },
  {
    id: 'downshift-1-item-3',
    text: 'Option 4',
  },
  {
    id: 'downshift-1-item-4',
    text:
      'An example option that is really long to show what should be done to handle long text',
  },
  {
    id: 'downshift-1-item-5',
    text: 'Option 5',
  },
];

export default {
  title: 'Components/MultiSelect',

  parameters: {
    component: MultiSelect,
    subcomponents: {
      'MultiSelect.Filterable': MultiSelect.Filterable,
    },
  },
};

export const Default = () => {
  return (
    <div style={{ width: 300 }}>
      <MultiSelect
        label="Multiselect Label"
        id="carbon-multiselect-example"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
      />
    </div>
  );
};

export const WithInitialSelectedItems = () => {
  return (
    <div style={{ width: 300 }}>
      <MultiSelect
        id="carbon-multiselect-example-2"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        initialSelectedItems={[items[0], items[1]]}
        selectionFeedback="top-after-reopen"
      />
    </div>
  );
};

export const _Filterable = () => {
  return (
    <div style={{ width: 300 }}>
      <MultiSelect.Filterable
        id="carbon-multiselect-example-3"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        placeholder="Filter"
        selectionFeedback="top-after-reopen"
      />
    </div>
  );
};
