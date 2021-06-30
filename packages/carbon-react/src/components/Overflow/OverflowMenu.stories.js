/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import React from 'react';

export default {
  title: 'Components/OverflowMenu',
};

export const Default = () => {
  return (
    <OverflowMenu>
      <OverflowMenuItem itemText="Stop app" />
      <OverflowMenuItem itemText="Restart app" />
      <OverflowMenuItem itemText="Rename app" />
      <OverflowMenuItem itemText="Edit routes and access" requireTitle />
      <OverflowMenuItem hasDivider isDelete itemText="Delete app" />
    </OverflowMenu>
  );
};
