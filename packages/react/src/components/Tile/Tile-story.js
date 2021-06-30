/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import './tile-story.scss';

import {
  withKnobs,
  boolean,
  number,
  select,
  text,
} from '@storybook/addon-knobs';
import {
  Tile,
  ClickableTile,
  SelectableTile,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from '../Tile';
import TextInput from '../TextInput';
import TileGroup from '../TileGroup';
import RadioTile from '../RadioTile';
import Link from '../Link';
import mdx from './Tile.mdx';

const radioValues = {
  None: '',
  standard: 'standard',
  'default-selected': 'default-selected',
  selected: 'selected',
};

const props = {
  regular: () => ({
    light: boolean('Light variant (light)', false),
  }),
  clickable: () => ({
    disabled: boolean('disabled (disabled)', false),
    href: text(
      'Href for clickable UI (href)',
      'https://www.carbondesignsystem.com/'
    ),
    light: boolean('Light variant (light)', false),
  }),
  selectable: () => ({
    selected: boolean('Selected (selected)', false),
    handleClick: action('handleClick'),
    handleKeyDown: action('handleKeyDown'),
    light: boolean('Light variant (light)', false),
    disabled: boolean('Disabled (disabled)', false),
  }),
  group: () => ({
    name: text('Form item (name in <TileGroup>)', 'tile-group'),
    valueSelected: select(
      'Value of the selected item (valueSelected in <TileGroup>)',
      radioValues,
      ''
    ),
    onChange: action('onChange'),
  }),
  radio: () => ({
    name: text('Form item name (name in <RadioTile>)', 'tiles'),
    onChange: action('onChange'),
    light: boolean('Light variant (light)', false),
    disabled: boolean('Disabled (disabled)', false),
  }),
  expandable: () => ({
    tabIndex: number('Tab index (tabIndex)', 0),
    expanded: boolean('Expanded (expanded)', false),
    tileCollapsedIconText: text(
      'Collapsed icon text (tileCollapsedIconText)',
      'Interact to Expand tile'
    ),
    tileExpandedIconText: text(
      'Collapsed icon text (tileExpandedIconText)',
      'Interact to Collapse tile'
    ),
    tileCollapsedLabel: text('Collapsed icon text (tileCollapsedLabel)'),
    tileExpandedLabel: text('Collapsed icon text (tileExpandedLabel)'),
    handleClick: action('handleClick'),
    light: boolean('Light variant (light)', false),
  }),
};

export default {
  title: 'Components/Tile',
  decorators: [withKnobs],

  parameters: {
    component: Tile,
    docs: {
      page: mdx,
    },
    subcomponents: {
      ClickableTile,
      SelectableTile,
      ExpandableTile,
      RadioTile,
      TileGroup,
      TileAboveTheFoldContent,
      TileBelowTheFoldContent,
    },
  },
};

export const Default = () => {
  const regularProps = props.regular();
  return (
    <Tile {...regularProps}>
      Default tile
      <br />
      <br />
      <Link href="https://www.carbondesignsystem.com">Link</Link>
    </Tile>
  );
};

export const Clickable = () => {
  const clickableProps = props.clickable();
  return <ClickableTile {...clickableProps}>Clickable Tile</ClickableTile>;
};

export const MultiSelect = () => {
  const selectableProps = props.selectable();
  return (
    <div role="group" aria-label="selectable tiles">
      <SelectableTile id="tile-1" name="tiles" {...selectableProps}>
        Option 1
      </SelectableTile>
      <SelectableTile id="tile-2" name="tiles" {...selectableProps}>
        Option 2
      </SelectableTile>
      <SelectableTile id="tile-3" name="tiles" {...selectableProps}>
        Option 3
      </SelectableTile>
    </div>
  );
};

export const Radio = () => {
  const radioProps = props.radio();
  return (
    <TileGroup
      defaultSelected="default-selected"
      legend="Radio Tile Group"
      {...props.group()}>
      <RadioTile value="standard" {...radioProps}>
        Option 1
      </RadioTile>
      <RadioTile value="default-selected" id="tile-2" {...radioProps}>
        Option 2
      </RadioTile>
      <RadioTile value="selected" id="tile-3" {...radioProps}>
        Option 3
      </RadioTile>
    </TileGroup>
  );
};

export const Expandable = () => (
  <ExpandableTile {...props.expandable()}>
    <TileAboveTheFoldContent>
      <div style={{ height: '200px' }}>Above the fold content here</div>
    </TileAboveTheFoldContent>
    <TileBelowTheFoldContent>
      <div style={{ height: '400px' }}>
        Below the fold content here
        <TextInput id="test2" invalidText="A valid value is required" />
      </div>
      {/* TODO: Remove before merge */}
      <Link>hello</Link>
    </TileBelowTheFoldContent>
  </ExpandableTile>
);
