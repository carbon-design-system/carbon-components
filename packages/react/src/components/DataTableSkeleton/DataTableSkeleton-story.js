/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import DataTableSkeleton from '../DataTableSkeleton';
import { headers } from '../DataTable/stories/shared';

const props = () => ({
  showHeaders: boolean('Show table headers', true),
  zebra: boolean('Use zebra stripe (zebra)', false),
  compact: boolean('Compact variant (compact)', false),
  showHeader: boolean('Show the Table Header (showHeader)', true),
  showToolbar: boolean('Show the Table Toolbar (showToolbar)', true),
});

export default {
  title: 'Components/DataTable',
  decorators: [withKnobs],

  parameters: {
    component: DataTableSkeleton,
  },
};

export const Skeleton = () => {
  const { showHeaders, ...rest } = props();
  return (
    <div style={{ width: '800px' }}>
      <DataTableSkeleton {...rest} headers={showHeaders ? headers : null} />
      <br />
    </div>
  );
};

Skeleton.storyName = 'default';

Skeleton.parameters = {
  info: {
    text: `
        Skeleton states are used as a progressive loading state while the user waits for content to load.

        This example shows a skeleton state for a data table.
      `,
  },
};
