/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'carbon-components/scss/components/button/_button.scss';

import React from 'react';
import { mount } from '@cypress/react';
import { default as Button } from './Button';
import { Add16 } from '@carbon/icons-react';

describe('Button', () => {
  beforeEach(() => {
    mount(
      <>
        <Button>button</Button>
        <Button size="sm">size-sm</Button>
        <Button size="md">size-md</Button>
        <Button size="lg">size-lg</Button>
        <Button size="xl">size-xl</Button>
        <Button size="sm" expressive>
          expressive size-sm
        </Button>
        <Button size="md" expressive>
          expressive size-md
        </Button>
        <Button size="lg" expressive>
          expressive size-lg
        </Button>
        <Button size="xl" expressive>
          expressive size-xl
        </Button>
        <Button kind="secondary">secondary</Button>
        <Button kind="tertiary">tertiary</Button>
        <Button kind="ghost">ghost</Button>
        <Button kind="danger" dangerDescription="sample">
          danger
        </Button>
        <Button kind="danger--tertiary" dangerDescription="sample">
          danger--tertiary
        </Button>
        <Button kind="danger--ghost" dangerDescription="sample">
          danger--ghost
        </Button>
        <Button hasIconOnly renderIcon={Add16} data-testid="icon-only" />
      </>
    );
  });

  it('should render', () => {
    // full string match regex syntax ^string$ to prevent collisions
    cy.findByText(/^button$/).should('be.visible');
    cy.findByText(/^size-sm$/).should('be.visible');
    cy.findByText(/^size-md$/).should('be.visible');
    cy.findByText(/^size-lg$/).should('be.visible');
    cy.findByText(/^size-xl$/).should('be.visible');
    cy.findByText(/^expressive size-sm$/).should('be.visible');
    cy.findByText(/^expressive size-md$/).should('be.visible');
    cy.findByText(/^expressive size-lg$/).should('be.visible');
    cy.findByText(/^expressive size-xl$/).should('be.visible');
    cy.findByText(/^secondary$/).should('be.visible');
    cy.findByText(/^tertiary$/).should('be.visible');
    cy.findByText(/^ghost$/).should('be.visible');
    cy.findByText(/^danger$/).should('be.visible');
    cy.findByText(/^danger--tertiary$/).should('be.visible');
    cy.findByText(/^danger--ghost$/).should('be.visible');
    cy.findByTestId('icon-only').should('be.visible');

    // snapshots should always be taken _after_ an assertion that
    // a element/component should be visible. This is to ensure
    // the DOM has settled and the element has fully loaded.
    cy.percySnapshot();
  });
});
