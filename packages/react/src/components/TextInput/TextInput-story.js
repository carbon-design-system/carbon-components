/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';
import TextInput from '../TextInput';
import TextInputSkeleton from '../TextInput/TextInput.Skeleton';
import FluidForm from '../FluidForm/FluidForm';
import mdx from './TextInput.mdx';

const types = {
  None: '',
  'Text (text)': 'text',
  'For email (email)': 'email',
  'For password (password)': 'password',
};

const sizes = {
  'Small  (sm)': 'sm',
  'Medium (md) - default': undefined,
  'Large  (lg)': 'lg',
};

const ControlledPasswordInputApp = React.forwardRef(
  function ControlledPasswordInputApp(props, ref) {
    const [type, setType] = useState('password');
    const togglePasswordVisibility = () => {
      setType(type === 'password' ? 'text' : 'password');
    };
    return (
      <>
        <TextInput.PasswordInput
          type={type}
          togglePasswordVisibility={togglePasswordVisibility}
          ref={ref}
          {...props}
        />
        <button type="button" onClick={() => setType('text')}>
          Show password
        </button>
        <button type="button" onClick={() => setType('password')}>
          Hide password
        </button>
      </>
    );
  }
);

const props = {
  SharedInputProps: () => ({
    className: 'some-class',
    id: 'test2',
    defaultValue: text(
      'Default value (defaultValue)',
      'This is not a default value'
    ),
    size: select('Field size (size)', sizes, undefined) || undefined,
    labelText: text('Label text (labelText)', 'Text input label'),
    placeholder: text('Placeholder text (placeholder)', 'Placeholder text'),
    light: boolean('Light variant (light)', false),
    disabled: boolean('Disabled (disabled)', false),
    hideLabel: boolean('No label (hideLabel)', false),
    invalid: boolean('Show form validation UI (invalid)', false),
    invalidText: text(
      'Form validation UI content (invalidText)',
      'A valid value is required'
    ),
    warn: boolean('Show warning state (warn)', false),
    warnText: text(
      'Warning state text (warnText)',
      'This will overwrite your current settings'
    ),
    helperText: text('Helper text (helperText)', 'Optional help text'),
    inline: boolean('Inline variant (inline)', false),
    onClick: action('onClick'),
    onChange: action('onChange'),
  }),
  TextInputProps: () => ({
    readOnly: boolean('Readonly variant (readOnly)', false),
  }),
  PasswordInputProps: () => ({
    tooltipPosition: select(
      'Tooltip position (tooltipPosition)',
      ['top', 'right', 'bottom', 'left'],
      'bottom'
    ),
    tooltipAlignment: select(
      'Tooltip alignment (tooltipAlignment)',
      ['start', 'center', 'end'],
      'center'
    ),
    hidePasswordLabel: text(
      '"Hide password" tooltip label for password visibility toggle (hidePasswordLabel)',
      'Hide password'
    ),
    showPasswordLabel: text(
      '"Show password" tooltip label for password visibility toggle (showPasswordLabel)',
      'Show password'
    ),
  }),
};

TextInput.displayName = 'TextInput';

export default {
  title: 'Components/TextInput',
  decorators: [withKnobs],

  parameters: {
    component: TextInput,
    docs: {
      page: mdx,
    },
    subcomponents: {
      TextInputSkeleton,
      'TextInput.PasswordInput': TextInput.PasswordInput,
    },
  },
};

export const Default = () => (
  <TextInput
    type={select('Form control type (type)', types, 'text')}
    {...props.SharedInputProps()}
    {...props.TextInputProps()}
  />
);

Default.parameters = {
  info: {
    text: `
        Text fields enable the user to interact with and input data. A single line
        field is used when the input anticipated by the user is a single line of
        text as opposed to a paragraph.
        The default type is 'text' and its value can be either 'string' or 'number'.
      `,
  },
};

export const Fluid = () => (
  <FluidForm>
    <TextInput
      type={select('Form control type (type)', types, 'text')}
      {...props.SharedInputProps()}
      {...props.TextInputProps()}
    />
  </FluidForm>
);

Fluid.parameters = {
  info: {
    text: `
        Text fields enable the user to interact with and input data. A single line
        field is used when the input anticipated by the user is a single line of
        text as opposed to a paragraph.
        The default type is 'text' and its value can be either 'string' or 'number'.
      `,
  },
};

export const TogglePasswordVisibility = () => {
  return (
    <TextInput.PasswordInput
      {...props.SharedInputProps()}
      {...props.PasswordInputProps()}
    />
  );
};

TogglePasswordVisibility.storyName = 'Toggle password visibility';

TogglePasswordVisibility.parameters = {
  info: {
    text: `
      Text field with password visibility toggle.
    `,
  },
};

export const FullyControlledTogglePasswordVisibility = () => {
  ControlledPasswordInputApp.__docgenInfo = {
    ...TextInput.PasswordInput.__docgenInfo,
    props: {
      ...TextInput.PasswordInput.__docgenInfo.props,
    },
  };

  return (
    <ControlledPasswordInputApp
      {...props.SharedInputProps()}
      {...props.PasswordInputProps()}
    />
  );
};

FullyControlledTogglePasswordVisibility.storyName =
  'Fully controlled toggle password visibility';

FullyControlledTogglePasswordVisibility.parameters = {
  info: {
    text: `
    Fully controlled text field with password visibility toggle.
  `,
  },
};

export const Skeleton = () => <TextInputSkeleton />;

Skeleton.storyName = 'skeleton';

Skeleton.parameters = {
  info: {
    text: `
        Placeholder skeleton state to use when content is loading.
        `,
  },
};
