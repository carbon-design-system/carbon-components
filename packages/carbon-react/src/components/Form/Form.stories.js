/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  Checkbox,
  Form,
  FormGroup,
  FileUploader,
  NumberInput,
  RadioButton,
  RadioButtonGroup,
  Button,
  Search,
  Select,
  SelectItem,
  TextArea,
  TextInput,
  Toggle,
} from 'carbon-components-react';

const checkboxEvents = {
  className: 'some-class',
  labelText: 'Checkbox label',
};

const fieldsetCheckboxProps = () => ({
  className: 'some-class',
  legendText: 'Checkbox heading',
});

const numberInputProps = {
  className: 'some-class',
  id: 'number-input-1',
  label: 'Number Input',
  min: 0,
  max: 100,
  value: 50,
  step: 10,
};

const toggleProps = {
  className: 'some-class',
};

const fieldsetToggleProps = {
  className: 'some-class',
  legendText: 'Toggle heading',
};

const fileUploaderEvents = {
  buttonLabel: 'Add files',
  className: 'some-class',
};

const fieldsetFileUploaderProps = {
  className: 'some-class',
  legendText: 'File Uploader',
};

const radioProps = {
  className: 'some-class',
};

const fieldsetRadioProps = {
  className: 'some-class',
  legendText: 'Radio Button heading',
};

const searchProps = {
  className: 'some-class',
};

const fieldsetSearchProps = {
  className: 'some-class',
  legendText: 'Search',
};

const selectProps = {
  className: 'some-class',
};

const TextInputProps = {
  className: 'some-class',
  id: 'test2',
  labelText: 'Text Input label',
  placeholder: 'Placeholder text',
};

const PasswordProps = {
  className: 'some-class',
  id: 'test3',
  labelText: 'Password',
};

const InvalidPasswordProps = {
  className: 'some-class',
  id: 'test4',
  labelText: 'Password',
  invalid: true,
  invalidText:
    'Your password must be at least 6 characters as well as contain at least one uppercase, one lowercase, and one number.',
};

const textareaProps = {
  labelText: 'Text Area label',
  className: 'some-class',
  placeholder: 'Placeholder text',
  id: 'test5',
  cols: 50,
  rows: 4,
};

const buttonEvents = {
  className: 'some-class',
};

export default {
  title: 'Components/Form',
  component: Form,
};

export const Default = () => (
  <Form>
    <FormGroup {...fieldsetCheckboxProps()}>
      <Checkbox defaultChecked {...checkboxEvents} id="checkbox-0" />
      <Checkbox {...checkboxEvents} id="checkbox-1" />
      <Checkbox disabled {...checkboxEvents} id="checkbox-2" />
    </FormGroup>

    <NumberInput {...numberInputProps} />

    <FormGroup {...fieldsetToggleProps}>
      <Toggle {...toggleProps} id="toggle-1" />
      <Toggle disabled {...toggleProps} id="toggle-2" />
    </FormGroup>

    <FormGroup {...fieldsetFileUploaderProps}>
      <FileUploader
        {...fileUploaderEvents}
        id="file-1"
        labelDescription="Choose Files..."
      />
    </FormGroup>

    <FormGroup {...fieldsetRadioProps}>
      <RadioButtonGroup
        name="radio-button-group"
        defaultSelected="default-selected">
        <RadioButton
          value="standard"
          id="radio-1"
          labelText="Standard Radio Button"
          {...radioProps}
        />
        <RadioButton
          value="default-selected"
          labelText="Default Selected Radio Button"
          id="radio-2"
          {...radioProps}
        />
        <RadioButton
          value="blue"
          labelText="Standard Radio Button"
          id="radio-3"
          {...radioProps}
        />
        <RadioButton
          value="disabled"
          labelText="Disabled Radio Button"
          id="radio-4"
          disabled
          {...radioProps}
        />
      </RadioButtonGroup>
    </FormGroup>

    <FormGroup {...fieldsetSearchProps}>
      <Search
        {...searchProps}
        id="search-1"
        labelText="Search"
        placeholder="Search"
      />
    </FormGroup>

    <Select {...selectProps} id="select-1" defaultValue="placeholder-item">
      <SelectItem
        disabled
        hidden
        value="placeholder-item"
        text="Choose an option"
      />
      <SelectItem value="option-1" text="Option 1" />
      <SelectItem value="option-2" text="Option 2" />
      <SelectItem value="option-3" text="Option 3" />
    </Select>

    <TextInput {...TextInputProps} />

    <TextInput
      type="password"
      required
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
      {...PasswordProps}
    />

    <TextInput
      type="password"
      required
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
      {...InvalidPasswordProps}
    />

    <TextArea {...textareaProps} />

    <Button type="submit" className="some-class" {...buttonEvents}>
      Submit
    </Button>
  </Form>
);
