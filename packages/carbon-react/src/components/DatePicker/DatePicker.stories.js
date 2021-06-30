/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  DatePicker,
  DatePickerInput,
  DatePickerSkeleton,
} from 'carbon-components-react';

// const patterns = {
//   'Short (d{1,2}/d{4})': '\\d{1,2}/\\d{4}',
//   'Regular (d{1,2}/d{1,2}/d{4})': '\\d{1,2}/\\d{1,2}/\\d{4}',
// };

// const sizes = {
//   'Small  (sm)': 'sm',
//   'Medium (md) - default': undefined,
//   'Large  (lg)': 'lg',
// };

// const types = {
//   Simple: 'simple',
//   Single: 'single',
//   Range: 'range',
// };

const props = {
  datePicker: () => ({
    dateFormat: 'm/d/Y',
    id: 'date-picker',
    light: false,
    datePickerType: 'single',
    minDate: '11/15/2020',
    maxDate: '11/01/2040',
    disable: ['07/15/2021'],
    onClose: action('onClose'),
    onOpen: action('onOpen'),
  }),
  datePickerInput: () => ({
    id: 'date-picker-input-id',
    className: 'some-class',
    size: undefined,
    labelText: 'Date Picker label',
    pattern: 'd{1,2}/d{4}',
    placeholder: 'mm/dd/yyyy',
    disabled: false,
    invalid: false,
    invalidText: 'A valid date is required',
    warn: false,
    warnText: 'Selected dates may cause conflicts',
    iconDescription: 'Icon description',
  }),
};

export default {
  title: 'Components/DatePicker',

  parameters: {
    component: DatePicker,

    subcomponents: {
      DatePickerInput,
      DatePickerSkeleton,
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

export const SingleWithCalendar = () => (
  <DatePicker datePickerType="single">
    <DatePickerInput
      placeholder="mm/dd/yyyy"
      labelText="Date Picker label"
      id="date-picker-single"
    />
  </DatePicker>
);

export const RangeWithCalendar = () => {
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

/* eslint-disable react/prop-types */
export const DatePickerPlayground = () => (
  <DatePicker {...props.datePicker()}>
    <DatePickerInput {...props.datePickerInput()} />
    {props.datePicker().datePickerType === 'range' && (
      <DatePickerInput {...props.datePickerInput()} id="date-picker-input-2" />
    )}
  </DatePicker>
);
/* eslint-enable react/prop-types */

export const Skeleton = () => <DatePickerSkeleton range />;
