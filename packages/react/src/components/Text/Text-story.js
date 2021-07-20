/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { LayoutDirection, TextDirection, Text } from '../Text';
import RadioButtonGroup from '../RadioButtonGroup';
import RadioButton from '../RadioButton';

export default {
  title: 'Experimental/unstable_Text',
  parameters: {
    component: Text,
  },
};

export const Default = () => (
  <>
    <p>
      <Text>Hello world</Text>
    </p>
    <p>
      <Text>لكن لا بد أن أوضح لك أن كل</Text>
    </p>
  </>
);

export const LayoutAndText = () => (
  <LayoutDirection direction="ltr">
    <p>
      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
      ratione nobis voluptatibus facilis nostrum, necessitatibus magnam Maxime
      esse consequatur nemo sit repellat Dignissimos rem nobis hic reprehenderit
      ducimus? Fuga voluptatem?
    </p>
    <LayoutDirection direction="rtl">
      <Text as="p">
        المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل
        لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب
        الشعور بالسعادة، ولكن بفضل هؤ.
      </Text>
    </LayoutDirection>
    <p>
      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
      ratione nobis voluptatibus facilis nostrum, necessitatibus magnam Maxime
      esse consequatur nemo sit repellat Dignissimos rem nobis hic reprehenderit
      ducimus? Fuga voluptatem?
    </p>
  </LayoutDirection>
);

export const SetTextDirection = () => {
  const legendText = 'הכותרת שלי!';

  return (
    <TextDirection
      getTextDirection={(text) => {
        if (text === legendText) {
          return 'ltr';
        }
        return 'auto';
      }}>
      <RadioButtonGroup
        legendText={legendText}
        name="radio-button-group"
        defaultSelected="radio-1"
        style={{ maxWidth: '400px' }}>
        <RadioButton
          labelText="שלום עולם Option 1"
          value="radio-1"
          id="radio-1"
        />
        <RadioButton
          labelText="שלום עולם Option 2"
          value="radio-1"
          id="radio-1"
        />
        <RadioButton
          labelText="שלום עולם Option 3"
          value="radio-1"
          id="radio-1"
        />
      </RadioButtonGroup>
    </TextDirection>
  );
};
