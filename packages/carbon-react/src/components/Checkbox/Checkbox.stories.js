/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Checkbox, CheckboxSkeleton } from 'carbon-components-react';
import { settings } from 'carbon-components';
const { prefix } = settings;

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  subcomponents: {
    CheckboxSkeleton,
  },
};

export const checkbox = () => {
  return (
    <fieldset className={`${prefix}--fieldset`}>
      <legend className={`${prefix}--label`}>Checkbox heading</legend>
      <Checkbox labelText={`Checkbox label`} id="checkbox-label-1" />
      <Checkbox labelText={`Checkbox label`} id="checkbox-label-2" />
    </fieldset>
  );
};

export const skeleton = () => <CheckboxSkeleton />;
