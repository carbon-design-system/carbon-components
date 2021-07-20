/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { screen, render } from '@testing-library/react';
import React from 'react';
import { Layer } from '../Layer';

describe('Layer', () => {
  it('should render the children passed in as a prop', () => {
    render(
      <Layer>
        <span data-testid="test">test</span>
      </Layer>
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should spread any additional props onto the top-level element', () => {
    render(
      <Layer data-testid="test">
        <span>test</span>
      </Layer>
    );

    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should accept a custom class name', () => {
    render(
      <Layer className="custom-class" data-testid="test">
        <span>test</span>
      </Layer>
    );
    expect(screen.getByTestId('test')).toHaveClass('custom-class');
  });
});
