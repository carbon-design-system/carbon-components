/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { settings } from 'carbon-components';
import {
  FileUploaderItem,
  FileUploaderDropContainer,
  FormItem,
} from 'carbon-components-react';
// import uid from '../../../tools/uniqueId';
import '../FileUploader-story.scss';

const { prefix } = settings;

// -- copied from internal/tools/uniqueId.js
let lastId = 0;
function uid(prefix = 'id') {
  lastId++;
  return `${prefix}${lastId}`;
}
// -- end copied

const ExampleDropContainerApp = (props) => {
  const [files, setFiles] = useState([]);
  const handleDrop = (e) => {
    e.preventDefault();
  };

  const handleDragover = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragover);
    return () => {
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragover);
    };
  }, []);

  const uploadFile = async (fileToUpload) => {
    // file size validation
    if (fileToUpload.filesize > 512000) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'File size exceeds limit',
        errorBody: '500kb max file size. Select a new file and try again.',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }

    // file type validation
    if (fileToUpload.invalidFileType) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'Invalid file type',
        errorBody: `"${fileToUpload.name}" does not have a valid file type.`,
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }

    // simulate network request time
    const rand = Math.random() * 1000;
    setTimeout(() => {
      const updatedFile = {
        ...fileToUpload,
        status: 'complete',
        iconDescription: 'Upload complete',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
    }, rand);

    // show x icon after 1 second
    setTimeout(() => {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
    }, rand + 1000);
  };

  const onAddFiles = useCallback(
    (evt, { addedFiles }) => {
      evt.stopPropagation();
      const newFiles = addedFiles.map((file) => ({
        uuid: uid(),
        name: file.name,
        filesize: file.size,
        status: 'uploading',
        iconDescription: 'Uploading',
        invalidFileType: file.invalidFileType,
      }));
      // eslint-disable-next-line react/prop-types
      if (props.multiple) {
        setFiles([...files, ...newFiles]);
        newFiles.forEach(uploadFile);
      } else if (newFiles[0]) {
        setFiles([newFiles[0]]);
        uploadFile(newFiles[0]);
      }
    },
    // eslint-disable-next-line react/prop-types
    [files, props.multiple]
  );

  const handleFileUploaderItemClick = useCallback(
    (_, { uuid: clickedUuid }) =>
      setFiles(files.filter(({ uuid }) => clickedUuid !== uuid)),
    [files]
  );

  const labelClasses = classnames(`${prefix}--file--label`, {
    // eslint-disable-next-line react/prop-types
    [`${prefix}--file--label--disabled`]: props.disabled,
  });

  const helperTextClasses = classnames(`${prefix}--label-description`, {
    // eslint-disable-next-line react/prop-types
    [`${prefix}--label-description--disabled`]: props.disabled,
  });

  return (
    <FormItem>
      <p className={labelClasses}>Upload files</p>
      <p className={helperTextClasses}>
        Max file size is 500kb. Supported file types are .jpg and .png.
      </p>
      <FileUploaderDropContainer {...props} onAddFiles={onAddFiles} />
      <div className={`${prefix}--file-container`} style={{ width: '100%' }}>
        {files.map(
          ({
            uuid,
            name,
            filesize,
            status,
            iconDescription,
            invalid,
            ...rest
          }) => (
            <FileUploaderItem
              key={uid()}
              uuid={uuid}
              name={name}
              filesize={filesize}
              // eslint-disable-next-line react/prop-types
              size={props.size}
              status={status}
              iconDescription={iconDescription}
              invalid={invalid}
              onDelete={handleFileUploaderItemClick}
              {...rest}
            />
          )
        )}
      </div>
    </FormItem>
  );
};

export default ExampleDropContainerApp;
