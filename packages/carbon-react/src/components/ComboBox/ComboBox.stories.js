/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ComboBox } from 'carbon-components-react';

const items = [
  {
    id: 'option-0',
    text:
      'An example option that is really long to show what should be done to handle long text',
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
  title: 'Components/ComboBox',
  component: ComboBox,
};

export const Combobox = () => (
  <div style={{ width: 300 }}>
    <ComboBox
      onChange={() => {}}
      id="carbon-combobox"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      placeholder="Filter..."
      titleText="ComboBox title"
      helperText="Combobox helper text"
    />
  </div>
);
