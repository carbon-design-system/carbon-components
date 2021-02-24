/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';

import {
  withKnobs,
  boolean,
  number,
  text,
  object,
  select,
} from '@storybook/addon-knobs';
import NumberInput from '../NumberInput';
import { NumberInput as OGNumberInput } from './NumberInput';
import NumberInputSkeleton from '../NumberInput/NumberInput.Skeleton';
import mdx from './NumberInput.mdx';

const sizes = {
  'Extra large size (xl)': 'xl',
  'Default size': undefined,
  'Small size (sm)': 'sm',
};

const props = () => ({
  className: 'some-class',
  id: 'tj-input',
  label: text('Label (label)', 'Number Input label'),
  hideLabel: boolean('No label (hideLabel)', false),
  min: number('Minimum value (min)', 0),
  max: number('Maximum value (max)', 100),
  value: number('Value (value)', 50),
  step: select('Step of up/down arrow (step)', [10, 2, 'any'], 10),
  size: select('Field size (size)', sizes, undefined) || undefined,
  disabled: boolean('Disabled (disabled)', false),
  readOnly: boolean('Read only (readOnly)', false),
  invalid: boolean('Show form validation UI (invalid)', false),
  isMobile: boolean('Mobile variant', false),
  invalidText: text(
    'Form validation UI content (invalidText)',
    'Number is not valid'
  ),
  warn: boolean('Show warning state (warn)', false),
  warnText: text(
    'Warning state text (warnText)',
    'A high threshold may impact performance'
  ),
  helperText: text('Helper text (helperText)', 'Optional helper text.'),
  light: boolean('Light variant (light)', false),
  onChange: action('onChange'),
  onClick: action('onClick'),
  allowEmpty: boolean('Allow empty value (allowEmpty)', false),
  numberInputArrowTranslationIds: object(
    'Number input arrow icon translation IDs (for translateWithId callback)',
    {
      'increment.number': 'Increment number',
      'decrement.number': 'Decrement number',
    }
  ),
});

export default {
  title: 'NumberInput',
  component: OGNumberInput,
  decorators: [withKnobs],

  parameters: {
    docs: {
      page: mdx,
    },

    subcomponents: {
      NumberInputSkeleton,
    },
  },
};

export const Default = () => {
  const { numberInputArrowTranslationIds, ...rest } = props();
  return (
    <NumberInput
      translateWithId={(id) => numberInputArrowTranslationIds[id]}
      {...rest}
    />
  );
};

export const Skeleton = () => (
  <div
    aria-label="loading number input"
    aria-live="assertive"
    role="status"
    tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
  >
    <NumberInputSkeleton />
  </div>
);

Skeleton.storyName = 'skeleton';

Skeleton.parameters = {
  info: {
    text: `
        Placeholder skeleton state to use when content is loading.
      `,
  },
};
