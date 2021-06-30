/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import { Add16 } from '@carbon/icons-react';
import { Button, ButtonSet, ButtonSkeleton } from 'carbon-components-react';

export default {
  title: 'Components/Button',
  parameters: {
    component: Button,
    subcomponents: {
      ButtonSet,
      ButtonSkeleton,
    },
  },
};

export const _Default = () => {
  return <Button>Button</Button>;
};

export const Secondary = () => {
  return <Button kind="secondary">Button</Button>;
};

export const Tertiary = () => {
  return <Button kind="tertiary">Button</Button>;
};

export const Danger = () => {
  return (
    <>
      <Button kind="danger">Button</Button>
      &nbsp;
      <Button kind="danger--tertiary">Tertiary Danger Button</Button>
      &nbsp;
      <Button kind="danger--ghost">Ghost Danger Button</Button>
    </>
  );
};

export const Ghost = () => {
  return <Button kind="ghost">Button</Button>;
};

export const IconButton = () => (
  <Button
    renderIcon={Add16}
    iconDescription="Icon Description"
    hasIconOnly
    onClick={action('onClick')}
  />
);

export const SetOfButtons = () => {
  return (
    <ButtonSet>
      <Button kind="secondary">Secondary button</Button>
      <Button kind="primary">Primary button</Button>
    </ButtonSet>
  );
};

export const Skeleton = () => (
  <div>
    <ButtonSkeleton />
    &nbsp;
    <ButtonSkeleton small />
  </div>
);
