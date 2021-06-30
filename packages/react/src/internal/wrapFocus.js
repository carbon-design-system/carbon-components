/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import findLast from 'lodash.findlast';
import { settings } from 'carbon-components';
import {
  DOCUMENT_POSITION_BROAD_PRECEDING,
  DOCUMENT_POSITION_BROAD_FOLLOWING,
  selectorTabbable,
} from './keyboard/navigation';

const { prefix } = settings;

/**
 * @param {Node} node A DOM node.
 * @param {string[]} selectorsFloatingMenus The CSS selectors that matches floating menus.
 * @returns {boolean} `true` of the given `node` is in a floating menu.
 */
function elementOrParentIsFloatingMenu(
  node,
  selectorsFloatingMenus = [
    `.${prefix}--overflow-menu-options`,
    `.${prefix}--tooltip`,
    '.flatpickr-calendar',
  ]
) {
  if (node && typeof node.closest === 'function') {
    return selectorsFloatingMenus.some((selector) => node.closest(selector));
  }
}

/**
 * Ensures the focus is kept in the given `modalNode`, implementing "focus-wrap" behavior.
 * @param {object} options The options.
 * @param {Node} options.bodyNode
 * @param {Node} options.startTrapNode The DOM node of the focus sentinel the is placed earlier next to `modalNode`.
 * @param {Node} options.endTrapNode The DOM node of the focus sentinel the is placed next to `modalNode`.
 * @param {Node} options.currentActiveNode The DOM node that has focus.
 * @param {Node} options.oldActiveNode The DOM node that previously had focus.
 * @param {Node} [options.selectorsFloatingMenus] The CSS selectors that matches floating menus.
 */
function wrapFocus({
  bodyNode,
  startTrapNode,
  endTrapNode,
  currentActiveNode,
  oldActiveNode,
  selectorsFloatingMenus,
}) {
  if (
    bodyNode &&
    currentActiveNode &&
    oldActiveNode &&
    !bodyNode.contains(currentActiveNode) &&
    !elementOrParentIsFloatingMenu(currentActiveNode, selectorsFloatingMenus)
  ) {
    const comparisonResult = oldActiveNode.compareDocumentPosition(
      currentActiveNode
    );
    if (
      currentActiveNode === startTrapNode ||
      comparisonResult & DOCUMENT_POSITION_BROAD_PRECEDING
    ) {
      const tabbable = findLast(
        bodyNode.querySelectorAll(selectorTabbable),
        (elem) => Boolean(elem.offsetParent)
      );
      if (tabbable) {
        tabbable.focus();
      } else if (bodyNode !== oldActiveNode) {
        bodyNode.focus();
      }
    } else if (
      currentActiveNode === endTrapNode ||
      comparisonResult & DOCUMENT_POSITION_BROAD_FOLLOWING
    ) {
      const tabbable = Array.prototype.find.call(
        bodyNode.querySelectorAll(selectorTabbable),
        (elem) => Boolean(elem.offsetParent)
      );
      if (tabbable) {
        tabbable.focus();
      } else if (bodyNode !== oldActiveNode) {
        bodyNode.focus();
      }
    }
  }
}

export { elementOrParentIsFloatingMenu };
export default wrapFocus;
