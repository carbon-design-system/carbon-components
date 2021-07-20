/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { warning } from '../internal/warning';

const didWarnAboutDeprecation = {};

function deprecateFieldOnObject(object, field, Component, message) {
  Object.defineProperty(object, field, {
    enumerable: true,
    get() {
      if (!didWarnAboutDeprecation[field]) {
        warning(
          false,
          message ||
            `The ${field} field has been deprecated on the ${object.displayName} object. ` +
              `Please import and use ${Component.displayName} directly.`
        );
        didWarnAboutDeprecation[field] = true;
      }

      return Component;
    },
  });
}

export { deprecateFieldOnObject };
