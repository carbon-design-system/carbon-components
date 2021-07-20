/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { TextDirectionContext } from './TextDirection';

function Text({ as: BaseComponent = 'span', children, dir = 'auto', ...rest }) {
  const textDir = useContext(TextDirectionContext);

  if (textDir) {
    const { direction, getTextDirection } = textDir;

    if (direction) {
      return (
        <BaseComponent {...rest} dir={direction}>
          {children}
        </BaseComponent>
      );
    }

    if (getTextDirection) {
      return (
        <BaseComponent {...rest} dir={getTextDirection(children) || dir}>
          {children}
        </BaseComponent>
      );
    }
  }

  return (
    <BaseComponent {...rest} dir={dir}>
      {children}
    </BaseComponent>
  );
}

Text.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.elementType,
  ]),
  children: PropTypes.node.isRequired,
  dir: PropTypes.oneOf(['ltr', 'rtl', 'auto']),
};

export { Text };
