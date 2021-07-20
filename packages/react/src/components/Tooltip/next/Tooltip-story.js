/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Add24 } from '@carbon/icons-react';
import { select } from '@storybook/addon-knobs';
import React from 'react';
import { Tooltip } from './Tooltip';
import { TooltipDefinition } from './TooltipDefinition';

export default {
  title: 'Experimental/unstable_Tooltip',
  component: Tooltip,
  // includeStories: [],
};

export const Definition = () => {
  return <TooltipDefinition content="hi hello">test</TooltipDefinition>;
};

export const Default = () => {
  const sizes = [
    'top',
    'top-left',
    'top-right',
    'bottom',
    'bottom-left',
    'bottom-right',
    'left',
    'left-top',
    'left-bottom',
    'right',
    'right-top',
    'right-bottom',
  ];
  return (
    <Tooltip
      align={select(
        'Specify where the target should be relative to the tooltip',
        sizes,
        'top'
      )}
      label="Close">
      <button type="button">
        <Add24 />
      </button>
    </Tooltip>
  );
};

export const Description = () => {
  return (
    <Tooltip description="Modify account settings">
      <button type="button">Edit</button>
    </Tooltip>
  );
};

export const Duration = () => {
  return (
    <>
      <Tooltip label="Close" enterDelayMs={500} leaveDelayMs={500}>
        <button type="button">
          <Add24 />
        </button>
      </Tooltip>
      <Tooltip label="Close" enterDelayMs={500} leaveDelayMs={500}>
        <button type="button">
          <Add24 />
        </button>
      </Tooltip>
      <Tooltip label="Close" enterDelayMs={500} leaveDelayMs={500}>
        <button type="button">
          <Add24 />
        </button>
      </Tooltip>
    </>
  );
};
