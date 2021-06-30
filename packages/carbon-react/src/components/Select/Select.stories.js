/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  Select,
  SelectItem,
  SelectItemGroup,
  SelectSkeleton,
} from 'carbon-components-react';

export default {
  title: 'Components/Select',
  decorators: [(story) => <div style={{ width: '400px' }}>{story()}</div>],
  parameters: {
    component: Select,
    subcomponents: {
      SelectItem,
      SelectItemGroup,
      SelectSkeleton,
    },
  },
};

export const _Default = () => {
  return (
    <div>
      <Select
        id="select-1"
        defaultValue="placeholder-item"
        labelText="Select an option"
        helperText="Optional helper text">
        <SelectItem
          disabled
          hidden
          value="placeholder-item"
          text="Choose an option"
        />
        <SelectItemGroup label="Category 1">
          <SelectItem value="option-1" text="Option 1" />
          <SelectItem value="option-2" text="Option 2" />
        </SelectItemGroup>
        <SelectItemGroup label="Category 2">
          <SelectItem value="option-3" text="Option 3" />
          <SelectItem value="option-4" text="Option 4" />
        </SelectItemGroup>
      </Select>
    </div>
  );
};

export const Inline = () => {
  return (
    <div>
      <Select
        inline
        id="select-1"
        defaultValue="placeholder-item"
        labelText=""
        helperText="Optional helper text">
        <SelectItem
          disabled
          hidden
          value="placeholder-item"
          text="Choose an option"
        />
        <SelectItemGroup label="Category 1">
          <SelectItem value="option-1" text="Option 1" />
          <SelectItem value="option-2" text="Option 2" />
        </SelectItemGroup>
        <SelectItemGroup label="Category 2">
          <SelectItem value="option-3" text="Option 3" />
          <SelectItem value="option-4" text="Option 4" />
        </SelectItemGroup>
      </Select>
    </div>
  );
};

export const _Skeleton = () => (
  <div
    aria-label="loading select"
    aria-live="assertive"
    role="status"
    tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
  >
    <SelectSkeleton />
  </div>
);
