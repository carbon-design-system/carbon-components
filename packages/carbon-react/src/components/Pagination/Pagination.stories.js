/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Pagination } from 'carbon-components-react';

export default {
  title: 'Components/Pagination',
  decorators: [(story) => <div style={{ maxWidth: '800px' }}>{story()}</div>],

  parameters: {
    component: Pagination,
  },
};

export const _Default = () => (
  <Pagination
    id="pagination-1"
    pageSize={10}
    pageSizes={[10, 20, 30, 40, 50]}
    itemsPerPageText="Items per page:"
    totalItems={103}
  />
);

export const MultiplePaginationComponents = () => {
  return (
    <div>
      <Pagination
        id="pagination-2"
        pageSize={10}
        pageSizes={[10, 20, 30, 40, 50]}
        itemsPerPageText="Items per page:"
        totalItems={103}
      />
      <Pagination
        id="pagination-3"
        pageSize={10}
        pageSizes={[10, 20, 30, 40, 50]}
        itemsPerPageText="Items per page:"
        totalItems={103}
      />
    </div>
  );
};

export const PaginationWithCustomPageSizesLabel = () => {
  return (
    <div>
      <Pagination
        pageSizes={[
          { text: 'Ten', value: 10 },
          { text: 'Twenty', value: 20 },
          { text: 'Thirty', value: 30 },
          { text: 'Fourty', value: 40 },
          { text: 'Fifty', value: 50 },
        ]}
        itemsPerPageText="Items per page:"
        totalItems={103}
      />
    </div>
  );
};
