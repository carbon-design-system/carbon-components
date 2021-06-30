/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react';
import React from 'react';

export default {
  title: 'Components/Breadcrumb',
};

export const Default = () => {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <a href="/#">Breadcrumb 1</a>
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
      <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
    </Breadcrumb>
  );
};
