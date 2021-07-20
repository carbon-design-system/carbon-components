/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useContext } from 'react';

const LayoutDirectionContext = React.createContext('ltr');

function LayoutDirection({
  as: BaseComponent = 'div',
  children,
  direction,
  ...rest
}) {
  const parentDirection = useContext(LayoutDirectionContext);
  if (parentDirection === direction) {
    console.log('here?');
    return children;
  }

  return (
    <LayoutDirectionContext.Provider value={direction}>
      <BaseComponent dir={direction} {...rest}>
        {children}
      </BaseComponent>
    </LayoutDirectionContext.Provider>
  );
}

LayoutDirection.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.elementType,
  ]),
  children: PropTypes.node,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

export { LayoutDirectionContext, LayoutDirection };
