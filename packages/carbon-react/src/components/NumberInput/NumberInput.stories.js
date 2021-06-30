/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { NumberInput, NumberInputSkeleton } from 'carbon-components-react';

export default {
  title: 'Components/NumberInput',
  parameters: {
    component: NumberInput,
    subcomponents: {
      NumberInputSkeleton,
    },
  },
};

const numberInputProps = {
  className: 'some-class',
  id: 'number-input-1',
  label: 'Number Input',
  helperText: 'Optional helper text.',
  min: 0,
  max: 100,
  value: 50,
  step: 1,
};

export const Default = () => {
  return <NumberInput {...numberInputProps} />;
};

export const Skeleton = () => (
  <div>
    <NumberInputSkeleton />
    &nbsp;
    <NumberInputSkeleton small />
  </div>
);
