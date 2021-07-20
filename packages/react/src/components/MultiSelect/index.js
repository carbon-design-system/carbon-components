/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { deprecateFieldOnObject } from '../../internal/deprecateFieldOnObject';

import MultiSelect from './MultiSelect';
import FilterableMultiSelect from './FilterableMultiSelect';

FilterableMultiSelect.displayName = 'MultiSelect.Filterable';
MultiSelect.Filterable = FilterableMultiSelect;

if (__DEV__ && !process.env.JEST_WORKER_ID) {
  deprecateFieldOnObject(MultiSelect, 'Filterable', FilterableMultiSelect);
}

export default MultiSelect;
