/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ToggleNext from './next/Toggle';
import ToggleClassic from './Toggle';
import { createComponentToggle } from '../../internal/ComponentToggle';

const Toggle = createComponentToggle({
  name: 'Toggle',
  next: ToggleNext,
  classic: ToggleClassic,
});

export { default as ToggleSkeleton } from './Toggle.Skeleton';
export default Toggle;
