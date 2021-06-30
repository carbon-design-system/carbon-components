/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'carbon-components/scss/components/breadcrumb/_breadcrumb.scss';

import React from 'react';
import { mount } from '@cypress/react';
import { Breadcrumb, BreadcrumbItem } from '../index';

describe('Breadcrumb', () => {
  beforeEach(() => {
    mount(
      <Breadcrumb>
        <BreadcrumbItem>
          <a href="/#">Breadcrumb 1</a>
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
      </Breadcrumb>
    );
  });

  it('should render', () => {
    cy.findByText(/Breadcrumb 1/).should('be.visible');
    cy.findByText(/Breadcrumb 2/).should('be.visible');
    cy.findByText(/Breadcrumb 3/).should('be.visible');

    // snapshots should always be taken _after_ an assertion that
    // a element/component should be visible. This is to ensure
    // the DOM has settled and the element has fully loaded.
    cy.percySnapshot();
  });
});
