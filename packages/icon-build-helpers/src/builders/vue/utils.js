/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getAttributes } from '@carbon/icon-helpers';
import * as Vue from 'vue';

const getSvgAttrs = (title, svgAttrs, componentAttrs) => {
  return getAttributes({
    ...svgAttrs,
    preserveAspectRatio: 'xMidYMid meet',
    xmlns: 'http://www.w3.org/2000/svg',
    // Special case here, we need to coordinate that we are using title,
    // potentially, to get the right focus attributes
    title,
    ...componentAttrs,
  });
};

const getVue2SvgAttrs = (title, svgAttrs, data, listeners) => {
  const result = {
    attrs: getSvgAttrs(title, svgAttrs, data.attrs),
    on: listeners,
    style: { ...data.staticStyle, ...data.style },
  };

  // remove style set by getAttributes
  delete result.attrs.style;

  if (data.staticClass || data.class) {
    result.class = {};

    if (data.staticClass) {
      result.class[data.staticClass] = true;
    }

    if (data.class) {
      result.class[data.class] = true;
    }
  }

  return result;
};

const createSVGComponent = (name, svgAttrs, svgContent) => ({
  // We use title as a prop name for the component
  // as it is not a valid attribute for an SVG HTML element
  props: { title: String },
  name: name,
  ...(Vue.h
    ? {
        // Vue 3 component
        setup({ title }, { attrs: componentAttrs, slots }) {
          return () =>
            Vue.h('svg', getSvgAttrs(title, svgAttrs, componentAttrs), [
              ...(title ? [Vue.h('title', title)] : []),
              ...svgContent.map(({ elem, attrs }) => Vue.h(elem, attrs)),
              ...(slots.default ? slots.default() : []),
            ]);
        },
      }
    : {
        // Vue 2 component
        functional: true,
        render(createElement, { props: { title }, children, data, listeners }) {
          return createElement(
            'svg',
            getVue2SvgAttrs(title, svgAttrs, data, listeners),
            [
              ...(title ? [createElement('title', null, title)] : []),
              ...svgContent.map(({ elem, attrs }) =>
                createElement(elem, { attrs: attrs })
              ),
              ...(children || []),
            ]
          );
        },
      }),
});

export default createSVGComponent;
