/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ProgressBar from './ProgressBar';
import { render } from '@testing-library/react';
import { settings } from 'carbon-components';

const { prefix } = settings;

describe('ProgressBar', () => {
  const props = {
    label: 'ProgressBar label',
  };
  let wrapper;

  beforeEach(() => {
    wrapper = render(<ProgressBar {...props} />);
  });

  describe('renders as expected', () => {
    it('progress bar and label ids match', () => {
      const bar = wrapper.getByRole('progressbar');
      const label = wrapper.container.querySelector('label');
      expect(bar.id).toBe(label.htmlFor);
    });

    it('renders helper text when passed', () => {
      const text = 'ProgressBar helper text';
      wrapper.rerender(<ProgressBar {...props} helperText={text} />);
      const helperText = wrapper.container.querySelector(
        `.${prefix}--progress-bar__helper-text`
      );

      expect(helperText.textContent).toBe(text);
      expect(
        wrapper.getByRole('progressbar').getAttribute('aria-describedby')
      ).toBe(helperText.id);
    });

    it('still renders accessible when hideLabel is passed', () => {
      wrapper.rerender(<ProgressBar {...props} hideLabel />);
      const label = wrapper.container.querySelector('label');

      expect(label.textContent).toBe(props.label);
      expect(label.classList.contains(`${prefix}--visually-hidden`)).toBe(true);
    });

    it('renders as indeterminate when no value is passed', () => {
      const bar = wrapper.getByRole('progressbar');

      expect(bar.getAttribute('aria-valuenow')).toBe(null);
      expect(bar.getAttribute('aria-valuemax')).toBe(null);
      expect(bar.getAttribute('aria-valuemin')).toBe(null);
      expect(
        wrapper.container
          .querySelector(`.${prefix}--progress-bar`)
          .classList.contains(`${prefix}--progress-bar--indeterminate`)
      ).toBe(true);
    });

    it('sets aria-valuenow correctly', () => {
      const value = 42;
      wrapper.rerender(<ProgressBar {...props} value={value} />);

      expect(
        wrapper.getByRole('progressbar').getAttribute('aria-valuenow')
      ).toBe(value.toString());
    });

    it('sets aria-valuemax correctly', () => {
      const max = 84;
      wrapper.rerender(<ProgressBar {...props} value={0} max={max} />);

      expect(
        wrapper.getByRole('progressbar').getAttribute('aria-valuemax')
      ).toBe(max.toString());
    });

    it('supports additional css class names', () => {
      const className = 'some-class';
      wrapper.rerender(<ProgressBar {...props} className={className} />);

      expect(
        wrapper.container
          .querySelector(`.${prefix}--progress-bar`)
          .classList.contains(className)
      ).toBe(true);
    });
  });

  describe('behaves as expected', () => {
    it('limits value to max', () => {
      const value = 200;
      const max = 50;
      wrapper.rerender(<ProgressBar {...props} value={value} max={max} />);

      expect(
        wrapper.getByRole('progressbar').getAttribute('aria-valuenow')
      ).toBe(max.toString());
    });

    it('ensures a positive value', () => {
      const value = -10;
      wrapper.rerender(<ProgressBar {...props} value={value} />);

      expect(
        wrapper.getByRole('progressbar').getAttribute('aria-valuenow')
      ).toBe('0');
    });
  });
});
