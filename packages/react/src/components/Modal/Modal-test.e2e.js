/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'carbon-components/scss/components/modal/_modal.scss';

import React from 'react';
import { mount } from '@cypress/react';
import Modal from '../Modal';
import Select from '../Select';
import SelectItem from '../SelectItem';
import TextInput from '../TextInput';
import { breakpoints, baseFontSize } from '@carbon/layout';

describe('Modal', () => {
  beforeEach(() => {
    mount(
      <Modal
        open
        modalHeading="Add a custom domain"
        modalLabel="Account resources"
        primaryButtonText="Add"
        secondaryButtonText="Cancel">
        <p style={{ marginBottom: '1rem' }}>
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
        <TextInput
          data-modal-primary-focus
          id="text-input-1"
          labelText="Domain name"
          placeholder="e.g. github.com"
          style={{ marginBottom: '1rem' }}
        />
        <Select id="select-1" defaultValue="us-south" labelText="Region">
          <SelectItem value="us-south" text="US South" />
          <SelectItem value="us-east" text="US East" />
        </Select>
      </Modal>
    );
  });

  Object.keys(breakpoints).forEach((breakpoint) => {
    // make assertions on the modal using
    // the array of different breakpoints
    it(`should render at ${breakpoint} breakpoint`, () => {
      // convert rem value from breakpoints into a raw number representation of pixels.
      // cy.viewport() only accepts numbers that equate to pixel values
      const width =
        parseInt(breakpoints[breakpoint].width.replace('rem', '')) *
        baseFontSize;
      cy.viewport(width, 500);

      cy.findByText(/Add a custom domain/).should('be.visible');
      cy.findByText(/Account resources/).should('be.visible');
      cy.findByText(/^Add$/).should('be.visible'); // full string match to prevent collisions
      cy.findByText(/Cancel/).should('be.visible');
      cy.findByLabelText(/Domain name/).should('be.visible');
      cy.findByLabelText(/Region/).should('be.visible');

      // snapshots should always be taken _after_ an assertion that
      // a element/component should be visible. This is to ensure
      // the DOM has settled and the element has fully loaded.
      //
      // only take snapshots at two primary widths to be mindful of our snapshot quota limit
      if (breakpoint === 'sm' || breakpoint === 'lg') {
        cy.percySnapshot();
      }
    });
  });
});
