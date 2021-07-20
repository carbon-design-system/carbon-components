/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

export default {
  title: 'Elements/Plex',
  argTypes: {
    fontWeight: {
      defaultValue: 'Regular',
      options: [
        'Thin',
        'Extra Light',
        'Light',
        'Regular',
        'Text',
        'Medium',
        'SemiBold',
        'Bold',
      ],
      mapping: {
        Thin: 100,
        'Extra Light': 200,
        Light: 300,
        Regular: 400,
        Text: 450,
        Medium: 500,
        SemiBold: 600,
        Bold: 700,
      },
      control: { type: 'radio' },
    },
    fontSize: {
      defaultValue: 16,
      control: { type: 'range', min: 12, max: 54, step: 4 },
    },
  },
};

export const English = (args) => {
  return (
    <p dir="auto" style={args}>
      This paragraph is in English and correctly goes left to right.
    </p>
  );
};

export const Mono = (args) => {
  return (
    <code className="text-mono" style={args}>
      This paragraph is in English and is monospaced.
    </code>
  );
};

export const Arabic = (args) => {
  return (
    <p dir="auto" style={args}>
      هذه الفقرة باللغة العربية ، لذا يجب الانتقال من اليمين إلى اليسار.
    </p>
  );
};
