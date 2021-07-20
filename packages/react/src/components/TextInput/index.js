/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { deprecateFieldOnObject } from '../../internal/deprecateFieldOnObject';

export * from './TextInput.Skeleton';
import ControlledPasswordInput from './ControlledPasswordInput';
import PasswordInput from './PasswordInput';
import TextInput from './TextInput';

TextInput.ControlledPasswordInput = ControlledPasswordInput;
TextInput.PasswordInput = PasswordInput;

if (__DEV__ && !process.env.JEST_WORKER_ID) {
  deprecateFieldOnObject(
    TextInput,
    'ControlledPasswordInput',
    ControlledPasswordInput
  );
  deprecateFieldOnObject(TextInput, 'PasswordInput', PasswordInput);
}

export default TextInput;
