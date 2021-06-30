/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { keys, matches } from '../../internal/keyboard';
import uniqueId from '../../tools/uniqueId';

const { prefix } = settings;

function FileUploaderDropContainer({
  accept,
  className,
  id,
  disabled,
  labelText,
  multiple,
  name,
  onAddFiles,
  role,
  tabIndex,
  ...rest
}) {
  const inputRef = useRef(null);
  const { current: uid } = useRef(id || uniqueId());
  const [isActive, setActive] = useState(false);
  const labelClasses = classNames(`${prefix}--file-browse-btn`, {
    [`${prefix}--file-browse-btn--disabled`]: disabled,
  });
  const dropareaClasses = classNames(`${prefix}--file__drop-container`, {
    [`${prefix}--file__drop-container--drag-over`]: isActive,
    [className]: className,
  });

  /**
   * Filters the array of added files based on file type restrictions
   * @param {Event} event - Event object, used to get the list of files added
   */
  function validateFiles(event) {
    const transferredFiles =
      event.type === 'drop'
        ? [...event.dataTransfer.files]
        : [...event.target.files];
    if (!accept.length) {
      return transferredFiles;
    }
    const acceptedTypes = new Set(accept);
    return transferredFiles.reduce((acc, curr) => {
      const { name, type: mimeType = '' } = curr;
      const fileExtensionRegExp = new RegExp(/\.[0-9a-z]+$/, 'i');
      const hasFileExtension = fileExtensionRegExp.test(name);
      if (!hasFileExtension) {
        return acc;
      }
      const [fileExtension] = name.match(fileExtensionRegExp);
      if (acceptedTypes.has(mimeType) || acceptedTypes.has(fileExtension)) {
        return acc.concat([curr]);
      }
      curr.invalidFileType = true;
      return acc.concat([curr]);
    }, []);
  }

  function handleChange(event) {
    const addedFiles = validateFiles(event);
    return onAddFiles(event, { addedFiles });
  }

  return (
    <div
      className={`${prefix}--file`}
      onDragOver={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        if (disabled) {
          return;
        }
        setActive(true);
        evt.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        if (disabled) {
          return;
        }
        setActive(false);
        evt.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        if (disabled) {
          return;
        }
        setActive(false);
        handleChange(evt);
      }}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <label
        className={labelClasses}
        htmlFor={uid}
        tabIndex={tabIndex || 0}
        onKeyDown={(evt) => {
          if (matches(evt, [keys.Enter, keys.Space])) {
            inputRef.current.click();
          }
        }}
        {...rest}>
        <div className={dropareaClasses} role={role || 'button'}>
          {labelText}
        </div>
        <input
          type="file"
          id={uid}
          className={`${prefix}--file-input`}
          ref={inputRef}
          tabIndex="-1"
          disabled={disabled}
          accept={accept}
          name={name}
          multiple={multiple}
          onChange={handleChange}
          onClick={(evt) => {
            evt.target.value = null;
          }}
        />
      </label>
    </div>
  );
}

FileUploaderDropContainer.propTypes = {
  /**
   * Specify the types of files that this input should be able to receive
   */
  accept: PropTypes.arrayOf(PropTypes.string),

  /**
   * Provide a custom className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify whether file input is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide a unique id for the underlying `<input>` node
   */
  id: PropTypes.string,

  /**
   * Provide the label text to be read by screen readers when interacting with
   * this control
   */
  labelText: PropTypes.string.isRequired,

  /**
   * Specify if the component should accept multiple files to upload
   */
  multiple: PropTypes.bool,

  /**
   * Provide a name for the underlying `<input>` node
   */
  name: PropTypes.string,

  /**
   * Event handler that is called after files are added to the uploader
   * The event handler signature looks like `onAddFiles(evt, { addedFiles })`
   */
  onAddFiles: PropTypes.func,

  /**
   * Provide an accessibility role for the <FileUploaderButton>
   */
  role: PropTypes.string,

  /**
   * Specify the size of the uploaded items, from a list of available
   * sizes. For `default` buttons, this prop can remain unspecified.
   * V11: `default`, `field`, and `small` will be removed
   */
  size: PropTypes.oneOf(['default', 'field', 'small', 'sm', 'md', 'lg']),

  /**
   * Provide a custom tabIndex value for the <FileUploaderButton>
   */
  tabIndex: PropTypes.number,
};

FileUploaderDropContainer.defaultProps = {
  tabIndex: 0,
  labelText: 'Add file',
  multiple: false,
  onAddFiles: () => {},
  accept: [],
};

export default FileUploaderDropContainer;
