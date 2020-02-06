/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import { Table, TableHead, TableRow } from '..';
import TableHeaderResizable from '../TableHeaderResizable';

describe('DataTable.TableHeaderResizable', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      isSortHeader: false,
      onClick: jest.fn(),
      sortDirection: 'NONE',
      colKey: 'aKey',
    };
  });

  it('should render', () => {
    const simpleHeader = mount(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderResizable {...mockProps}>Header</TableHeaderResizable>
          </TableRow>
        </TableHead>
      </Table>
    );
    expect(simpleHeader).toMatchSnapshot();

    const sortHeader = mount(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderResizable {...mockProps} isSortHeader>
              Header
            </TableHeaderResizable>
          </TableRow>
        </TableHead>
      </Table>
    );
    expect(sortHeader).toMatchSnapshot();
  });

  it('should have an active class if it is the sort header and the sort state is not NONE', () => {
    const wrapper = mount(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderResizable {...mockProps} isSortHeader>
              Header
            </TableHeaderResizable>
          </TableRow>
        </TableHead>
      </Table>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should have an active and ascending class if sorting by ASC', () => {
    const wrapper = mount(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderResizable
              {...mockProps}
              isSortHeader
              sortDirection="ASC">
              Header
            </TableHeaderResizable>
          </TableRow>
        </TableHead>
      </Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
