/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'carbon-components/scss/globals/grid/_grid.scss';

import React from 'react';
import { mount } from '@cypress/react';
import { default as AspectRatio } from '../AspectRatio';

describe('AspectRatio', () => {
  const style = { border: '1px solid black', margin: '1rem' };
  beforeEach(() => {
    mount(
      <>
        <AspectRatio ratio="16x9" style={style}>
          16x9
        </AspectRatio>
        <AspectRatio ratio="9x16" style={style}>
          9x16
        </AspectRatio>
        <AspectRatio ratio="2x1" style={style}>
          2x1
        </AspectRatio>
        <AspectRatio ratio="1x2" style={style}>
          1x2
        </AspectRatio>
        <AspectRatio ratio="4x3" style={style}>
          4x3
        </AspectRatio>
        <AspectRatio ratio="3x4" style={style}>
          3x4
        </AspectRatio>
        <AspectRatio ratio="1x1" style={style}>
          1x1
        </AspectRatio>
      </>
    );
  });

  it('should render', () => {
    cy.findByText(/16x9/).should('be.visible');
    cy.findByText(/9x16/).should('be.visible');
    cy.findByText(/2x1/).should('be.visible');
    cy.findByText(/1x2/).should('be.visible');
    cy.findByText(/4x3/).should('be.visible');
    cy.findByText(/3x4/).should('be.visible');
    cy.findByText(/1x1/).should('be.visible');

    // snapshots should always be taken _after_ an assertion that
    // a element/component should be visible. This is to ensure
    // the DOM has settled and the element has fully loaded.
    cy.percySnapshot();
  });
});
