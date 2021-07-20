/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getCellId } from './cells';

/**
 * Normalize a collection of rows with the given headers.
 *
 * @param {Array<object>} rows
 * @param {Array<object>} headers
 * @returns {object}
 */
const normalize = (rows, headers, prevState = {}) => {
  const { rowsById: prevRowsByIds } = prevState;
  const rowIds = new Array(rows.length);
  const rowsById = {};
  const cellsById = {};

  rows.forEach((row, i) => {
    rowIds[i] = row.id;
    // Initialize the row info and state values, namely for selection and
    // expansion
    const {
      id,
      isSelected = false,
      isExpanded = false,
      disabled = false,
      lastSelected = false,
    } = row;
    rowsById[id] = {
      id,
      isSelected,
      isExpanded,
      disabled,
      cells: new Array(headers.length),
      lastSelected,
    };

    // If we have a previous state, and the row existed in that previous state,
    // then we'll set the state values of the row to the previous state values.
    if (prevRowsByIds && prevRowsByIds[row.id] !== undefined) {
      rowsById[row.id].isSelected = prevRowsByIds[row.id].isSelected;
      rowsById[row.id].isExpanded = prevRowsByIds[row.id].isExpanded;
      rowsById[row.id].lastSelected = prevRowsByIds[row.id].lastSelected;
    }

    headers.forEach(({ key }, i) => {
      const id = getCellId(row.id, key);
      // Initialize the cell info and state values, namely for editing
      cellsById[id] = {
        id,
        value: row[key],
        isEditable: false,
        isEditing: false,
        isValid: true,
        errors: null,
        info: {
          header: key,
        },
      };

      // TODO: When working on inline edits, we'll need to derive the state
      // values similarly to rows above.

      rowsById[row.id].cells[i] = id;
    });
  });

  return {
    rowIds,
    rowsById,
    cellsById,
  };
};

export default normalize;
