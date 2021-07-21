/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Tag } from 'carbon-components-react';
import React from 'react';

export default { title: 'Components/Tag' };

export const Default = () => {
  return (
    <Tag className="some-class" type="red">
      {'This is a tag'}
    </Tag>
  );
};
