/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  withKnobs,
  boolean,
  select,
  text,
  array,
} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import DatePicker from '../DatePicker';
import DatePickerInput from '../DatePickerInput';
import DatePickerSkeleton from '../DatePicker/DatePicker.Skeleton';
import mdx from './DatePicker.mdx';

const patterns = {
  'Short (d{1,2}/d{4})': '\\d{1,2}/\\d{4}',
  'Regular (d{1,2}/d{1,2}/d{4})': '\\d{1,2}/\\d{1,2}/\\d{4}',
};

const sizes = {
  'Small  (sm)': 'sm',
  'Medium (md) - default': undefined,
  'Large  (lg)': 'lg',
};

const types = {
  Simple: 'simple',
  Single: 'single',
  Range: 'range',
};

const props = {
  datePicker: () => ({
    dateFormat: text('The date format (dateFormat in <DatePicker>)', 'm/d/Y'),
    id: 'date-picker',
    light: boolean('Light variant (light in <DatePicker>)', false),
    datePickerType: select(
      'Date Picker Type (datePickerType)',
      types,
      'single'
    ),
    minDate: text('Disable dates before this date (minDate)', '11/15/2020'),
    maxDate: text('Disabled dates after this date (maxDate)', '11/01/2040'),
    disable: array('Disable specific dates (disable)', ['07/15/2021'], ','),
    onClose: action('onClose'),
    onOpen: action('onOpen'),
    onChange: action('onChange'),
  }),
  datePickerInput: () => ({
    id: 'date-picker-input-id',
    className: 'some-class',
    size: select('Field size (size)', sizes, undefined) || undefined,
    labelText: text(
      'Label text (labelText in <DatePickerInput>)',
      'Date Picker label'
    ),
    pattern: select(
      'The date format (pattern in <DatePickerInput>)',
      patterns,
      'd{1,2}/d{4}'
    ),
    placeholder: text(
      'Placeholder text (placeholder in <DatePickerInput>)',
      'mm/dd/yyyy'
    ),
    disabled: boolean('Disabled (disabled in <DatePickerInput>)', false),
    invalid: boolean(
      'Show form validation UI (invalid in <DatePickerInput>)',
      false
    ),
    invalidText: text(
      'Form validation UI content (invalidText in <DatePickerInput>)',
      'A valid date is required'
    ),
    warn: boolean('Show warning state (warn)', false),
    warnText: text(
      'Warning state text (warnText)',
      'Selected dates may cause conflicts'
    ),
    iconDescription: text(
      'Icon description (iconDescription in <DatePickerInput>)',
      'Icon description'
    ),
    onChange: action('onChange'),
  }),
};

export default {
  title: 'Components/DatePicker',
  decorators: [withKnobs],

  parameters: {
    component: DatePicker,

    subcomponents: {
      DatePickerInput,
      DatePickerSkeleton,
    },
    docs: {
      page: mdx,
    },
  },
};

export const Simple = () => (
  <DatePicker datePickerType="simple">
    <DatePickerInput
      placeholder="mm/dd/yyyy"
      labelText="Date Picker label"
      id="date-picker-simple"
    />
  </DatePicker>
);

Simple.storyName = 'simple';

export const Single = () => (
  <DatePicker datePickerType="single">
    <DatePickerInput
      placeholder="mm/dd/yyyy"
      labelText="Date Picker label"
      id="date-picker-single"
    />
  </DatePicker>
);

Single.storyName = 'single with calendar';

export const Range = () => {
  return (
    <DatePicker datePickerType="range">
      <DatePickerInput
        id="date-picker-input-id-start"
        placeholder="mm/dd/yyyy"
        labelText="Start date"
      />
      <DatePickerInput
        id="date-picker-input-id-finish"
        placeholder="mm/dd/yyyy"
        labelText="End date"
      />
    </DatePicker>
  );
};

Range.storyName = 'range with calendar';

export const DatePickerPlayground = () => (
  <DatePicker {...props.datePicker()}>
    <DatePickerInput {...props.datePickerInput()} />
    {props.datePicker().datePickerType === 'range' && (
      <DatePickerInput {...props.datePickerInput()} id="date-picker-input-2" />
    )}
  </DatePicker>
);

export const Skeleton = () => <DatePickerSkeleton range />;

Skeleton.storyName = 'skeleton';
