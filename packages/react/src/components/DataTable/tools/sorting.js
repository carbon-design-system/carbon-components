/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getCellId } from './cells';
import { sortStates } from '../state/sortStates';

/**
 * Compare two primitives to determine which comes first. Initially, this method
 * will try and figure out if both entries are the same type. If so, it will
 * apply the default sort algorithm for those types. Otherwise, it defaults to a
 * string conversion.
 *
 * @param {number|string} a
 * @param {number|string} b
 * @param {string} locale
 * @returns {number}
 */
export const compare = (a, b, locale = 'en') => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return compareStrings(a, b, locale);
  }

  return compareStrings('' + a, '' + b, locale);
};

/**
 * Use the built-in `localeCompare` function available on strings to compare two
 * strings.
 *
 * @param {string} a
 * @param {string} b
 * @param {string} locale
 * @returns {number}
 */
export const compareStrings = (a, b, locale = 'en') => {
  // Only set `numeric: true` if the string only contains numbers
  // https://stackoverflow.com/a/175787
  if (!isNaN(a) && !isNaN(parseFloat(a))) {
    return a.localeCompare(b, locale, { numeric: true });
  }

  return a.localeCompare(b, locale);
};

/**
 * Default implementation of how we sort rows internally. The idea behind this
 * implementation is to use the given list of row ids to look up the cells in
 * the row by the given key. We then use the value of these cells and pipe them
 * into our local `compareStrings` method, including the locale where
 * appropriate.
 *
 * @param {object} config
 * @param {Array[string]} config.rowIds array of all the row ids in the table
 * @param {object} config.cellsById object containing a mapping of cell id to
 * cell
 * @param {string} config.key the header key that we use to lookup the cell
 * @param {string} [config.locale] optional locale used in the comparison
 * function
 * @param {string} config.sortDirection the sort direction used to determine the
 * order the comparison is called in
 * @param {Function} config.sortRow
 * @returns {Array[string]} array of sorted rowIds
 */
export const sortRows = ({
  rowIds,
  cellsById,
  sortDirection,
  key,
  locale,
  sortRow,
}) =>
  rowIds.slice().sort((a, b) => {
    const cellA = cellsById[getCellId(a, key)];
    const cellB = cellsById[getCellId(b, key)];
    return sortRow(cellA.value, cellB.value, {
      key,
      sortDirection,
      locale,
      sortStates,
      compare,
    });
  });

export const defaultSortRow = (
  cellA,
  cellB,
  { sortDirection, sortStates, locale }
) => {
  if (sortDirection === sortStates.ASC) {
    return compare(cellA, cellB, locale);
  }

  return compare(cellB, cellA, locale);
};
