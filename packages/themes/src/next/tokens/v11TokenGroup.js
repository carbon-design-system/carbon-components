/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TokenGroup } from './TokenGroup';

export const background = TokenGroup.create({
  name: 'Background',
  properties: ['background'],
  tokens: [
    'background',
    {
      name: 'background-active',
      state: 'active',
    },
    {
      name: 'background-selected',
      state: 'selected',
    },
    {
      name: 'background-selected-hover',
      state: 'hover',
    },
    {
      name: 'background-hover',
      state: 'hover',
    },
    'background-brand',
    'background-inverse',
    {
      state: 'hover',
      name: 'background-inverse-hover',
    },
  ],
});

export const layer = TokenGroup.create({
  name: 'Layer',
  properties: ['background'],
  tokens: [
    {
      name: 'layer-01',
    },
    {
      state: 'active',
      name: 'layer-active-01',
    },
    {
      state: 'hover',
      name: 'layer-hover-01',
    },
    {
      state: 'selected',
      name: 'layer-selected-01',
    },
    {
      state: 'hover',
      name: 'layer-selected-hover-01',
    },
    {
      name: 'layer-02',
    },
    {
      state: 'active',
      name: 'layer-active-02',
    },
    {
      state: 'hover',
      name: 'layer-hover-02',
    },
    {
      state: 'selected',
      name: 'layer-selected-02',
    },
    {
      state: 'hover',
      name: 'layer-selected-hover-02',
    },
    {
      name: 'layer-03',
    },
    {
      state: 'active',
      name: 'layer-active-03',
    },
    {
      state: 'hover',
      name: 'layer-hover-03',
    },
    {
      state: 'selected',
      name: 'layer-selected-03',
    },
    {
      state: 'hover',
      name: 'layer-selected-hover-03',
    },
    {
      state: 'disabled',
      name: 'layer-disabled',
    },
    {
      name: 'layer-selected-inverse',
    },
    {
      state: 'disabled',
      name: 'layer-selected-disabled',
    },
    {
      name: 'layer-accent-01',
    },
    {
      state: 'active',
      name: 'layer-accent-active-01',
    },
    {
      state: 'hover',
      name: 'layer-accent-hover-01',
    },
    {
      name: 'layer-accent-02',
    },
    {
      state: 'active',
      name: 'layer-accent-active-02',
    },
    {
      state: 'hover',
      name: 'layer-accent-hover-02',
    },
    {
      name: 'layer-accent-03',
    },
    {
      state: 'active',
      name: 'layer-accent-active-03',
    },
    {
      state: 'hover',
      name: 'layer-accent-hover-03',
    },
  ],
});

export const field = TokenGroup.create({
  name: 'Field',
  properties: ['background'],
  tokens: [
    {
      name: 'field-01',
    },
    {
      state: 'hover',
      name: 'field-hover-01',
    },
    {
      name: 'field-02',
    },
    {
      state: 'hover',
      name: 'field-hover-02',
    },
    {
      name: 'field-03',
    },
    {
      state: 'hover',
      name: 'field-hover-03',
    },
    {
      state: 'disabled',
      name: 'field-disabled',
    },
  ],
});

export const border = TokenGroup.create({
  name: 'Borders',
  properties: ['border'],
  tokens: [
    {
      name: 'border-subtle-00',
    },
    {
      name: 'border-subtle-01',
    },
    {
      state: 'selected',
      name: 'border-subtle-selected-01',
    },
    {
      name: 'border-subtle-02',
    },
    {
      state: 'selected',
      name: 'border-subtle-selected-02',
    },
    {
      name: 'border-subtle-03',
    },
    {
      state: 'selected',
      name: 'border-subtle-selected-03',
    },

    // Border strong
    'border-strong-01',
    'border-strong-02',
    'border-strong-03',

    // Border inverse
    'border-inverse',

    // Border interactive
    'border-interactive',

    {
      state: 'disabled',
      name: 'border-disabled',
    },
  ],
});

export const text = TokenGroup.create({
  name: 'Text',
  properties: ['text'],
  tokens: [
    'text-primary',
    'text-secondary',
    'text-placeholder',
    'text-helper',
    'text-error',
    'text-inverse',
    {
      name: 'text-on-color',
    },
    {
      state: 'disabled',
      name: 'text-on-color-disabled',
    },

    {
      state: 'disabled',
      name: 'text-disabled',
    },
  ],
});

export const link = TokenGroup.create({
  name: 'Link',
  properties: ['text'],
  tokens: [
    {
      name: 'link-primary',
    },
    {
      state: 'hover',
      name: 'link-primary-hover',
    },
    'link-secondary',
    'link-inverse',
    {
      state: 'visited',
      name: 'link-visited',
    },
  ],
});

export const icon = TokenGroup.create({
  name: 'Icons',
  properties: ['background', 'fill', 'stroke'],
  tokens: [
    'icon-primary',
    'icon-secondary',
    'icon-inverse',
    {
      name: 'icon-on-color',
    },
    {
      state: 'disabled',
      name: 'icon-on-color-disabled',
    },
    {
      state: 'disabled',
      name: 'icon-disabled',
    },
  ],
});

export const support = TokenGroup.create({
  name: 'Support',
  properties: ['background', 'fill', 'stroke'],
  tokens: [
    'support-error',
    'support-success',
    'support-warning',
    'support-info',
    'support-error-inverse',
    'support-success-inverse',
    'support-warning-inverse',
    'support-info-inverse',
    'support-caution-major',
    'support-caution-minor',
    'support-caution-undefined',
  ],
});

export const focus = TokenGroup.create({
  name: 'Focus',
  properties: ['border'],
  tokens: ['focus', 'focus-inset', 'focus-inverse'],
});

export const skeleton = TokenGroup.create({
  name: 'Skeleton',
  properties: ['background'],
  tokens: ['skeleton-background', 'skeleton-element'],
});

export const group = TokenGroup.create({
  name: 'All',
  tokens: [
    background,
    layer,
    field,

    // Interactive
    {
      name: 'interactive',
      properties: ['background', 'text'],
    },

    border,
    text,
    link,
    icon,
    support,

    // Misc
    {
      name: 'highlight',
    },
    {
      name: 'overlay',
      properties: ['background'],
    },
    {
      name: 'toggle-off',
    },

    focus,
    skeleton,
  ],
});
