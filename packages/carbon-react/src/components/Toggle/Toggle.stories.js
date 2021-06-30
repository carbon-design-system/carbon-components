/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Toggle } from 'carbon-components-react';

export default {
  title: 'Components/Toggle',
  parameters: {
    component: Toggle,
  },
};

export const Default = () => (
  <Toggle
    labelText="Toggle element label"
    labelA="Off"
    labelB="On"
    defaultToggled
    id="toggle-1"
  />
);

export const SmallToggle = () => (
  <Toggle
    size="sm"
    labelText="Toggle element label"
    labelA="Off"
    labelB="On"
    defaultToggled
    id="toggle-2"
  />
);
