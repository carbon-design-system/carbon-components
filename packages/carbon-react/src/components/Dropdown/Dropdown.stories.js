/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Dropdown, DropdownSkeleton } from 'carbon-components-react';

const items = [
  {
    id: 'option-0',
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  },
  {
    id: 'option-1',
    text: 'Option 1',
  },
  {
    id: 'option-2',
    text: 'Option 2',
  },
  {
    id: 'option-3',
    text: 'Option 3',
  },
  {
    id: 'option-4',
    text: 'Option 4',
  },
  {
    id: 'option-5',
    text: 'Option 5',
  },
];

export default {
  title: 'Components/Dropdown',

  parameters: {
    component: Dropdown,

    subcomponents: {
      DropdownSkeleton,
    },
  },
};

export const Default = () => (
  <div style={{ width: 400 }}>
    <Dropdown
      id="default"
      titleText="Dropdown label"
      helperText="This is some helper text"
      label="Dropdown menu options"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
    />
  </div>
);

export const Inline = () => (
  <div style={{ width: 600 }}>
    <Dropdown
      id="inline"
      titleText="Inline dropdown label"
      label="Dropdown menu options"
      type="inline"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
    />
  </div>
);

export const Skeleton = () => (
  <div style={{ width: 300 }}>
    <DropdownSkeleton />
  </div>
);
