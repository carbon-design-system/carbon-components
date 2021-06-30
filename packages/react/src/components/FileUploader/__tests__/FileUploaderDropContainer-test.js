/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getByText } from '@carbon/test-utils/dom';
import { render, cleanup } from '@carbon/test-utils/react';
import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { FileUploaderDropContainer } from '../';
import { uploadFiles } from '../test-helpers';

describe('FileUploaderDropContainer', () => {
  afterEach(cleanup);

  it('should not have axe violations', async () => {
    const { container } = render(<FileUploaderDropContainer />);
    await expect(container).toHaveNoAxeViolations();
  });

  it('should support a custom class name on the drop area', () => {
    const { container } = render(
      <FileUploaderDropContainer className="test" />
    );
    const dropArea = container.querySelector('[role="button"]');
    expect(dropArea.classList.contains('test')).toBe(true);
  });

  it('should have a unique id each time it is used', () => {
    const { container } = render(
      <>
        <FileUploaderDropContainer />
        <FileUploaderDropContainer />
      </>
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs[0].getAttribute('id')).not.toBe(inputs[1].getAttribute('id'));
  });

  it('should render with the default labelText prop', () => {
    const { container } = render(<FileUploaderDropContainer />);
    const label = getByText(container, 'Add file');
    expect(label).toBeInstanceOf(HTMLElement);
  });

  it('should render with multiple set to false by default', () => {
    const { container } = render(<FileUploaderDropContainer />);
    const input = container.querySelector('input');
    expect(input.getAttribute('multiple')).toBeFalsy();
  });

  it('should reset the value of the input when the drop area is clicked', () => {
    const { container } = render(
      <FileUploaderDropContainer labelText="test" />
    );
    const input = container.querySelector('input');

    uploadFiles(input, [
      new File(['content'], 'test.png', { type: 'image/png' }),
    ]);
    expect(input.files.length).toBe(1);
    Simulate.click(input);
    expect(input.files.length).toBe(0);
  });

  it('should call `onAddFiles` when a file is selected', () => {
    const onAddFiles = jest.fn();
    const { container } = render(
      <FileUploaderDropContainer onAddFiles={onAddFiles} />
    );
    const input = container.querySelector('input');
    const files = [
      new File(['foo'], 'foo.txt', { type: 'text/plain' }),
      new File(['bar'], 'bar.txt', { type: 'text/plain' }),
    ];

    uploadFiles(input, files);
    expect(onAddFiles).toHaveBeenCalledTimes(1);
    expect(onAddFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        target: {
          files,
        },
      }),
      { addedFiles: files }
    );
  });
});
