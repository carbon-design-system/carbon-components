/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import setupGetInstanceId from '../../tools/setupGetInstanceId';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();

function Loading({
  id,
  active,
  className: customClassName,
  withOverlay,
  small,
  description,
  ...rest
}) {
  const { current: instanceId } = useRef(getInstanceId());
  const loadingClassName = cx(customClassName, {
    [`${prefix}--loading`]: true,
    [`${prefix}--loading--small`]: small,
    [`${prefix}--loading--stop`]: !active,
  });
  const overlayClassName = cx({
    [`${prefix}--loading-overlay`]: true,
    [`${prefix}--loading-overlay--stop`]: !active,
  });
  const loadingId = id || `loading-id-${instanceId}`;

  const loading = (
    <div
      {...rest}
      aria-atomic="true"
      aria-labelledby={loadingId}
      aria-live={active ? 'assertive' : 'off'}
      className={loadingClassName}>
      <label id={loadingId} className={`${prefix}--visually-hidden`}>
        {description}
      </label>
      <svg className={`${prefix}--loading__svg`} viewBox="0 0 100 100">
        <title>{description}</title>
        {small ? (
          <circle
            className={`${prefix}--loading__background`}
            cx="50%"
            cy="50%"
            r="44"
          />
        ) : null}
        <circle
          className={`${prefix}--loading__stroke`}
          cx="50%"
          cy="50%"
          r="44"
        />
      </svg>
    </div>
  );

  return withOverlay ? (
    <div className={overlayClassName}>{loading}</div>
  ) : (
    loading
  );
}

Loading.propTypes = {
  /**
   * Specify whether you want the loading indicator to be spinning or not
   */
  active: PropTypes.bool,

  /**
   * Provide an optional className to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify an description that would be used to best describe the loading state
   */
  description: PropTypes.string,

  /**
   * Provide an `id` to uniquely identify the label
   */
  id: PropTypes.string,

  /**
   * Specify whether you would like the small variant of <Loading>
   */
  small: PropTypes.bool,

  /**
   * Specify whether you want the loader to be applied with an overlay
   */
  withOverlay: PropTypes.bool,
};

Loading.defaultProps = {
  active: true,
  withOverlay: true,
  small: false,
  description: 'Active loading indicator',
};

export default Loading;
