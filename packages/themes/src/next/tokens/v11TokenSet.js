/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TokenSet } from './TokenSet';
import { background, border, field, layer } from './v11TokenGroup';

export const set = TokenSet.create({
  name: 'All',
  tokens: [
    TokenSet.create({
      name: 'Base set',
      tokens: [
        background.getToken('background'),
        background.getToken('background-hover'),
        background.getToken('background-selected'),
        background.getToken('background-selected-hover'),
        border.getToken('border-subtle-00'),
      ],
    }),
    TokenSet.create({
      name: '01 Layer set',
      tokens: [
        layer.getToken('layer-01'),
        layer.getToken('layer-active-01'),
        layer.getToken('layer-hover-01'),
        layer.getToken('layer-selected-hover-01'),
        layer.getToken('layer-accent-01'),
        layer.getToken('layer-accent-active-01'),
        layer.getToken('layer-accent-hover-01'),

        field.getToken('field-01'),
        field.getToken('field-hover-01'),

        border.getToken('border-subtle-01'),
        border.getToken('border-subtle-selected-01'),

        border.getToken('border-strong-01'),
      ],
    }),
    TokenSet.create({
      name: '02 Layer set',
      tokens: [
        layer.getToken('layer-02'),
        layer.getToken('layer-active-02'),
        layer.getToken('layer-hover-02'),
        layer.getToken('layer-selected-hover-02'),
        layer.getToken('layer-accent-02'),
        layer.getToken('layer-accent-active-02'),
        layer.getToken('layer-accent-hover-02'),

        field.getToken('field-02'),
        field.getToken('field-hover-02'),

        border.getToken('border-subtle-02'),
        border.getToken('border-subtle-selected-02'),

        border.getToken('border-strong-02'),
      ],
    }),
    TokenSet.create({
      name: '03 Layer set',
      tokens: [
        layer.getToken('layer-03'),
        layer.getToken('layer-active-03'),
        layer.getToken('layer-hover-03'),
        layer.getToken('layer-selected-hover-03'),
        layer.getToken('layer-accent-03'),
        layer.getToken('layer-accent-active-03'),
        layer.getToken('layer-accent-hover-03'),

        field.getToken('field-03'),
        field.getToken('field-hover-03'),

        border.getToken('border-subtle-03'),
        border.getToken('border-subtle-selected-03'),

        border.getToken('border-strong-03'),
      ],
    }),
  ],
});
