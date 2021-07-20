/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';

const TextDirectionContext = React.createContext('auto');

function TextDirection({ children, dir, getTextDirection }) {
  const value = {
    direction: dir,
    getTextDirection,
  };

  return (
    <TextDirectionContext.Provider value={value}>
      {children}
    </TextDirectionContext.Provider>
  );
}

TextDirection.propTypes = {
  children: PropTypes.node,
  dir: PropTypes.oneOf(['ltr', 'rtl', 'auto']),
  getTextDirection: PropTypes.func,
};

export { TextDirectionContext, TextDirection };
