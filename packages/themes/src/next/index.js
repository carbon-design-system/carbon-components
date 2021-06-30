/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as white from './white';
import * as g10 from './g10';
import * as g90 from './g90';
import * as g100 from './g100';
import { TokenFormat, group, set } from './tokens';

export const themes = {
  white,
  g10,
  g90,
  g100,
};

export { TokenFormat, group, set };
