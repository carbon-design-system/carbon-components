/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import Toggle from '../Toggle';
import ToggleSkeleton from '../Toggle/Toggle.Skeleton';

export default {
  title: 'Components/Toggle',
  decorators: [withKnobs],

  parameters: {
    component: Toggle,
    subcomponents: {},
  },
};

export const Default = () => (
  <Toggle
    defaultToggled
    labelText="Toggle element label"
    className="some-class"
    labelA="Off"
    labelB="On"
    id="toggle-1"
  />
);

Default.storyName = 'Toggle';

Default.parameters = {
  info: {
    text: `
        Toggles are controls that are used to quickly switch between two possible states. The example below shows
        an uncontrolled Toggle component. To use the Toggle component as a controlled component, set the toggled property.
        Setting the toggled property will allow you to change the value dynamically, whereas setting the defaultToggled
        prop will only set the value initially. This example has defaultToggled set to true.
      `,
  },
};

export const Small = () => (
  <Toggle
    defaultToggled
    size="sm"
    labelText="Toggle element label"
    className="some-class"
    labelA="Off"
    labelB="On"
    id="toggle-1"
  />
);

export const Skeleton = () => {
  const isLoading = boolean('isLoading', true);

  return (
    <div style={{ maxWidth: '100%' }}>
      {isLoading ? (
        <>
          <ToggleSkeleton labelText="Toggle label" id="toggle-skeleton-id" />
          <br />
          <ToggleSkeleton
            labelText="Toggle label"
            id="toggle-skeleton-id"
            size="sm"
          />
        </>
      ) : (
        <Toggle
          defaultToggled
          labelText="Toggle element label"
          className="some-class"
          labelA="Off"
          labelB="On"
          id="toggle-1"
        />
      )}
    </div>
  );
};
