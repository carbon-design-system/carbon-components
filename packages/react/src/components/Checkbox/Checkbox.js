/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { useFeatureFlag } from '../FeatureFlags';
import { settings } from 'carbon-components';
import resolveBaseTextDir from '../../tools/bidiUtils';

const { prefix } = settings;

const Checkbox = React.forwardRef(function Checkbox(
  {
    className,
    id,
    labelText,
    onChange,
    indeterminate,
    hideLabel,
    wrapperClassName,
    title = '',
    dir,
    ...other
  },
  ref
) {
  const labelClasses = classNames(`${prefix}--checkbox-label`, className);
  const innerLabelClasses = classNames(`${prefix}--checkbox-label-text`, {
    [`${prefix}--visually-hidden`]: hideLabel,
  });
  const wrapperClasses = classNames(
    `${prefix}--form-item`,
    `${prefix}--checkbox-wrapper`,
    wrapperClassName
  );

  const enabled = useFeatureFlag('enable-v11-release');

  return (
    <div className={wrapperClasses}>
      <input
        {...other}
        type="checkbox"
        onChange={(evt) => {
          if (enabled) {
            onChange(evt, { checked: evt.target.checked, id });
          } else {
            onChange(evt.target.checked, id, evt);
          }
        }}
        className={`${prefix}--checkbox`}
        id={id}
        ref={(el) => {
          if (el) {
            el.indeterminate = indeterminate;
          }
          if (typeof ref === 'function') {
            ref(el);
          } else if (Object(ref) === ref) {
            ref.current = el;
          }
        }}
      />
      <label htmlFor={id} className={labelClasses} title={title || null}>
        <span
          className={innerLabelClasses}
          dir={resolveBaseTextDir(labelText, dir, false)}>
          {labelText}
        </span>
      </label>
    </div>
  );
});

Checkbox.propTypes = {
  /**
   * Specify whether the underlying input should be checked
   */
  checked: PropTypes.bool,

  /**
   * Specify an optional className to be applied to the <label> node
   */
  className: PropTypes.string,

  /**
   * Specify whether the underlying input should be checked by default
   */
  defaultChecked: PropTypes.bool,

  /**
   * Provide the text direction for the given <FormLabel>
   */
  dir: PropTypes.oneOf(['', 'ltr', 'rtl', 'auto']),

  /**
   * Specify whether the Checkbox should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: PropTypes.bool,

  /**
   * Provide an `id` to uniquely identify the Checkbox input
   */
  id: PropTypes.string.isRequired,

  /**
   * Specify whether the Checkbox is in an indeterminate state
   */
  indeterminate: PropTypes.bool,

  /**
   * Provide a label to provide a description of the Checkbox input that you are
   * exposing to the user
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Receives three arguments: true/false, the checkbox's id, and the dom event.
   * `(value, id, event) => console.log({value, id, event})`
   */
  onChange: PropTypes.func,

  /**
   * Specify a title for the <label> node for the Checkbox
   */
  title: PropTypes.string,

  /**
   * The CSS class name to be placed on the wrapping element
   */
  wrapperClassName: PropTypes.string,
};

Checkbox.defaultProps = {
  onChange: () => {},
  indeterminate: false,
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
