/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  StructuredListWrapper as StructuredListWrapperNext,
  StructuredListHead as StructuredListHeadNext,
  StructuredListInput as StructuredListInputNext,
  StructuredListBody as StructuredListBodyNext,
  StructuredListRow as StructuredListRowNext,
  StructuredListCell as StructuredListCellNext,
} from './next/StructuredList';
import {
  StructuredListWrapper as StructuredListWrapperClassic,
  StructuredListHead as StructuredListHeadClassic,
  StructuredListInput as StructuredListInputClassic,
  StructuredListBody as StructuredListBodyClassic,
  StructuredListRow as StructuredListRowClassic,
  StructuredListCell as StructuredListCellClassic,
} from './StructuredList';
import { createComponentToggle } from '../../internal/ComponentToggle';

export const StructuredListWrapper = createComponentToggle({
  name: 'StructuredListWrapper',
  next: StructuredListWrapperNext,
  classic: StructuredListWrapperClassic,
});

export const StructuredListHead = createComponentToggle({
  name: 'StructuredListHead',
  next: StructuredListHeadNext,
  classic: StructuredListHeadClassic,
});

export const StructuredListInput = createComponentToggle({
  name: 'StructuredListInput',
  next: StructuredListInputNext,
  classic: StructuredListInputClassic,
});

export const StructuredListBody = createComponentToggle({
  name: 'StructuredListBody',
  next: StructuredListBodyNext,
  classic: StructuredListBodyClassic,
});

export const StructuredListRow = createComponentToggle({
  name: 'StructuredListRow',
  next: StructuredListRowNext,
  classic: StructuredListRowClassic,
});

export const StructuredListCell = createComponentToggle({
  name: 'StructuredListCell',
  next: StructuredListCellNext,
  classic: StructuredListCellClassic,
});

export { default as StructuredListSkeleton } from './StructuredList.Skeleton';
