/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { default as OverflowMenuNext } from './next/OverflowMenu';
import { default as OverflowMenuClassic } from './OverflowMenu';
import { createComponentToggle } from '../../internal/ComponentToggle';

const OverflowMenu = createComponentToggle({
  name: 'OverflowMenu',
  next: OverflowMenuNext,
  classic: OverflowMenuClassic,
});

export default OverflowMenu;
