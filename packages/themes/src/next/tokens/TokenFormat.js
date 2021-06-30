/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const formats = {
  js: 'javascript',
  scss: 'scss',
};

export const TokenFormat = {
  formats,

  convert({ name, format }) {
    if (format === formats.js) {
      const keywords = new Set(['ui']);

      return name
        .split('-')
        .map((part, index) => {
          if (index === 0) {
            return part;
          }

          if (keywords.has(part)) {
            return part.toUpperCase();
          }

          return part[0].toUpperCase() + part.slice(1);
        })
        .join('');
    }

    if (format === formats.scss) {
      return formatNameToScss(name);
    }

    return name;
  },
};

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Format a given token into the format expected in CSS/SCSS-based projects.
 * @param {string} token
 * @returns {string}
 */
function formatNameToScss(token) {
  let string = '';

  for (let i = 0; i < token.length; i++) {
    if (token[i] === '-') {
      continue;
    }

    // If we run into a number, we hit the scale step at the end of a token name
    // and can safely truncate the rest of the token
    if (numbers.indexOf(token[i]) !== -1) {
      string += '-' + token.slice(i);
      break;
    }

    // When encountering an uppercase name, we will want to start adding `-`
    // between words
    if (token[i] === token[i].toUpperCase()) {
      // Check backwards to see if previous letter was also capitalized, if so
      // we are in a special case like UI where each piece should be connected
      if (token[i - 1] && token[i - 1] === token[i - 1].toUpperCase()) {
        string += token[i].toLowerCase();
        continue;
      }

      if (token[i - 1] !== '-') {
        // Otherwise, just concatenate this new part on to the existing string
        string += '-' + token[i].toLowerCase();
      }
      continue;
    }

    // By default, we add the current character to the output string
    string += token[i];
  }

  return string;
}
