/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ContentSwitcher, Switch } from 'carbon-components-react';

export default {
  title: 'Components/ContentSwitcher',

  parameters: {
    component: ContentSwitcher,

    subcomponents: {
      Switch,
    },
  },
};

export const Default = () => (
  <ContentSwitcher onChange={() => {}}>
    <Switch name="one" text="First section" />
    <Switch name="two" text="Second section" />
    <Switch name="three" text="Third section" />
  </ContentSwitcher>
);
