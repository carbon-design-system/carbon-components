/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Simulate } from 'react-dom/test-utils';

/**
 * A helper with standardizing behavior around selecting and clearing files with
 * an input with type="file".
 *
 * Based on comments on this discussion over in react-testing-library:
 * https://github.com/testing-library/react-testing-library/issues/93#issuecomment-392126991
 *
 * @param {HTMLInputElement} input
 * @param {Array<File>} [files]
 */
export function uploadFiles(input, files = []) {
  // Define the 'files' property on the input with the given files
  Object.defineProperty(input, 'files', {
    writable: true,
    value: files,
  });

  // When we update the value of the empty, if it is falsy we clear the input
  // files to mirror browser behavior
  Object.defineProperty(input, 'value', {
    set(newValue) {
      if (!newValue) {
        input.files.length = 0;
      }
    },
  });

  // Simulate the change event with the given options
  Simulate.change(input, {
    target: {
      files,
    },
  });
}
