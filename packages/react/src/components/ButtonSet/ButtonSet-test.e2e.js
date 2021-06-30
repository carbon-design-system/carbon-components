/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'carbon-components/scss/components/button/_button.scss';

import React from 'react';
import { mount } from '@cypress/react';
import { default as Button } from '../Button';
import { default as ButtonSet } from './ButtonSet';

describe('ButtonSet', () => {
  beforeEach(() => {
    mount(
      <>
        <ButtonSet>
          <Button kind="secondary">set-secondary</Button>
          <Button kind="primary">set-primary</Button>
        </ButtonSet>
        <ButtonSet stacked>
          <Button kind="secondary">set-stacked-secondary</Button>
          <Button kind="primary">set-stacked-primary</Button>
        </ButtonSet>
        <ButtonSet>
          <Button kind="secondary" isExpressive>
            set-secondary-expressive
          </Button>
          <Button kind="primary" isExpressive>
            set-primary-expressive
          </Button>
        </ButtonSet>
      </>
    );
  });

  it('should render', () => {
    // full string match regex syntax ^string$ to prevent collisions
    cy.findByText(/^set-secondary$/).should('be.visible');
    cy.findByText(/^set-primary$/).should('be.visible');
    cy.findByText(/^set-stacked-secondary$/).should('be.visible');
    cy.findByText(/^set-stacked-primary$/).should('be.visible');
    cy.findByText(/^set-secondary-expressive$/).should('be.visible');
    cy.findByText(/^set-primary-expressive$/).should('be.visible');

    // snapshots should always be taken _after_ an assertion that
    // a element/component should be visible. This is to ensure
    // the DOM has settled and the element has fully loaded.
    cy.percySnapshot();
  });
});
