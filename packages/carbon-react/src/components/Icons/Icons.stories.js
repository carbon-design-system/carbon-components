/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { Bee, Bicycle, ChevronUp } from '@carbon/icons-react/next';
import './Icons.stories.scss';

export default {
  title: 'Elements/Icons',
};

export const Default = () => {
  return (
    <>
      <section>
        <h2>16 pixel (default)</h2>
        <Bee />
      </section>

      <section>
        <h2>20 pixel</h2>
        <Bicycle size={20} />
      </section>

      <section>
        <h2>32 pixel</h2>
        <ChevronUp size={32} />
      </section>
    </>
  );
};
