/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import IconButton from './IconButton';
import { Add16 } from '@carbon/icons-react';

export default {
  title: 'Experimental/unstable_IconButton',
  component: IconButton,
};

export const Default = () => {
  return (
    <IconButton
      renderIcon={Add16}
      iconDescription="Some tooltip text here"
      alignment="left"
    />
  );
};
