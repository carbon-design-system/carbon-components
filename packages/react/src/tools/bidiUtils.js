/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checks if the character passed in is an Arabic character.
 * @param {string} charCode - Character code
 * @returns {boolean} True, if character is an Arabic character, false otherwise
 */
function isArabicChar(charCode) {
  if (
    (charCode >= 0x0600 && charCode <= 0x0669) ||
    (charCode >= 0x06fa && charCode <= 0x07ff) ||
    (charCode >= 0xfb50 && charCode <= 0xfdff) ||
    (charCode >= 0xfe70 && charCode <= 0xfefc)
  ) {
    return true;
  }
  return false;
}

/**
 * Checks if the character passed in is a Hebrew character.
 * @param {string} charCode - Character code
 * @returns {boolean} True, if character is a Hebrew character, false otherwise
 */
function isHebrewChar(charCode) {
  if (charCode >= 0x05d0 && charCode <= 0x05ff) {
    return true;
  }
  return false;
}

/**
 * Checks if the character passed in is a BiDi character.
 * @param {number} charCode - Character code
 * @returns {boolean} True, if the character is a BiDi (Arabic or Hebrew) character, false otherwise
 */
function isBidiChar(charCode) {
  return isArabicChar(charCode) || isHebrewChar(charCode);
}

/**
 * Checks if the character passed in is a Latin character (Only treats
 * capital and lower case alphabets as latin characters)
 * @param {number} charCode - Character code
 * @returns {boolean} True if the character is a Latin character, false otherwise
 */
function isLatinChar(charCode) {
  if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
    return true;
  }
  return false;
}

const AUTO = 'auto';

/**
 * Traverses the string passed in as a parameter from the beginning and
 * determines the direction of the text based on the first strong character
 * @param {string} text - A bi-directional text
 * @param {textDir} textDir - the text direction
 * @param {bool} isTextArea - Does the text belong to a textarea
 * @returns {string} Direction of the text
 */
export default function resolveBaseTextDir(text, textDir, isTextArea) {
  if (!textDir || typeof text !== 'string') {
    return null;
  }

  if (textDir === AUTO && !isTextArea) {
    for (let i = 0; text && i < text.length; i++) {
      const character = text.charCodeAt(i);
      if (isBidiChar(character)) {
        textDir = 'rtl';
        break;
      } else if (isLatinChar(character)) {
        textDir = 'ltr';
        break;
      }
    }
  }

  return textDir;
}
