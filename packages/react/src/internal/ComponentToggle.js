/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useFeatureFlag } from '../components/FeatureFlags';

export function createComponentToggle(spec) {
  const { name, flag = 'enable-v11-release', next, classic } = spec;

  function ComponentToggle(props, ref) {
    const enabled = useFeatureFlag(flag);
    if (enabled) {
      if (next) {
        return React.createElement(next, { ...props, ref: ref });
      } else {
        return null;
      }
    }

    return React.createElement(classic, { ...props, ref: ref });
  }

  ComponentToggle.displayName = `FeatureToggle(${name})`;

  return React.forwardRef(ComponentToggle);
}
