/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';

export function useNoInteractiveChildren(
  ref,
  message = 'component should have no interactive child nodes'
) {
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const node = ref.current ? getInteractiveContent(ref.current) : false;

      if (node) {
        throw new Error(
          `Error: ${message}.\n\nInstead found: ${node.outerHTML}`
        );
      }
    });
  }
}

/**
 * Determines if a given DOM node has interactive content, or is itself
 * interactive. It returns the interactive node if one is found
 *
 * @param {HTMLElement} node
 * @returns {HTMLElement}
 */
function getInteractiveContent(node) {
  if (isFocusable(node)) {
    return node;
  }

  for (const childNode of node.childNodes) {
    const interactiveNode = getInteractiveContent(childNode);
    if (interactiveNode) {
      return interactiveNode;
    }
  }

  return null;
}

/**
 * Determines if the given element is focusable, or not
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 * @see https://github.com/w3c/aria-practices/blob/0553bb51588ffa517506e2a1b2ca1422ed438c5f/examples/js/utils.js#L68
 */
function isFocusable(element) {
  if (element.tabIndex < 0) {
    return false;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case 'A':
      return !!element.href && element.rel !== 'ignore';
    case 'INPUT':
      return element.type !== 'hidden';
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;
    default:
      return false;
  }
}
