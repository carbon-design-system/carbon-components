/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { WarningFilled, WarningAltFilled } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import cx from 'classnames';
import Downshift, { useSelect } from 'downshift';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import ListBox, { PropTypes as ListBoxPropTypes } from '../ListBox';
import { sortingPropTypes } from './MultiSelectPropTypes';
import { defaultItemToString } from './tools/itemToString';
import { defaultSortItems, defaultCompareItems } from './tools/sorting';
import { useSelection } from '../../internal/Selection';
import setupGetInstanceId from '../../tools/setupGetInstanceId';
import { mapDownshiftProps } from '../../tools/createPropAdapter';
import mergeRefs from '../../tools/mergeRefs';
import { keys, match } from '../../internal/keyboard';

const { prefix } = settings;
const noop = () => {};
const getInstanceId = setupGetInstanceId();
const {
  ItemClick,
  MenuBlur,
  MenuKeyDownArrowDown,
  MenuKeyDownArrowUp,
  MenuKeyDownEnter,
  MenuKeyDownEscape,
  MenuKeyDownSpaceButton,
  ToggleButtonClick,
} = useSelect.stateChangeTypes;

const MultiSelect = React.forwardRef(function MultiSelect(
  {
    className: containerClassName,
    id,
    items,
    itemToString,
    titleText,
    helperText,
    label,
    type,
    size,
    disabled,
    initialSelectedItems,
    sortItems,
    compareItems,
    clearSelectionText,
    clearSelectionDescription,
    light,
    invalid,
    invalidText,
    warn,
    warnText,
    useTitleInItem,
    translateWithId,
    downshiftProps,
    open,
    selectionFeedback,
    onChange,
    onMenuChange,
    direction,
  },
  ref
) {
  const { current: multiSelectInstanceId } = useRef(getInstanceId());
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(open);
  const [prevOpenProp, setPrevOpenProp] = useState(open);
  const [topItems, setTopItems] = useState([]);
  const {
    selectedItems: controlledSelectedItems,
    onItemChange,
    clearSelection,
  } = useSelection({
    disabled,
    initialSelectedItems,
    onChange,
  });

  const {
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    selectedItem: selectedItems,
  } = useSelect(
    mapDownshiftProps({
      ...downshiftProps,
      highlightedIndex,
      isOpen,
      itemToString: (items) => {
        return items.map((item) => itemToString(item)).join(', ');
      },
      onStateChange,
      selectedItem: controlledSelectedItems,
      items,
    })
  );

  /**
   * wrapper function to forward changes to consumer
   */
  const setIsOpenWrapper = (open) => {
    setIsOpen(open);
    if (onMenuChange) {
      onMenuChange(open);
    }
  };

  /**
   * programmatically control this `open` prop
   */
  if (prevOpenProp !== open) {
    setIsOpenWrapper(open);
    setPrevOpenProp(open);
  }

  const inline = type === 'inline';
  const showWarning = !invalid && warn;

  const wrapperClasses = cx(
    `${prefix}--multi-select__wrapper`,
    `${prefix}--list-box__wrapper`,
    {
      [`${prefix}--multi-select__wrapper--inline`]: inline,
      [`${prefix}--list-box__wrapper--inline`]: inline,
      [`${prefix}--multi-select__wrapper--inline--invalid`]: inline && invalid,
      [`${prefix}--list-box__wrapper--inline--invalid`]: inline && invalid,
    }
  );
  const titleClasses = cx(`${prefix}--label`, {
    [`${prefix}--label--disabled`]: disabled,
  });
  const helperId = !helperText
    ? undefined
    : `multiselect-helper-text-${multiSelectInstanceId}`;
  const fieldLabelId = `multiselect-field-label-${multiSelectInstanceId}`;
  const helperClasses = cx(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: disabled,
  });

  const className = cx(`${prefix}--multi-select`, containerClassName, {
    [`${prefix}--multi-select--invalid`]: invalid,
    [`${prefix}--multi-select--warning`]: showWarning,
    [`${prefix}--multi-select--inline`]: inline,
    [`${prefix}--multi-select--selected`]:
      selectedItems && selectedItems.length > 0,
    [`${prefix}--list-box--up`]: direction === 'top',
  });

  const sortOptions = {
    selectedItems: controlledSelectedItems,
    itemToString,
    compareItems,
    locale: 'en',
  };

  if (selectionFeedback === 'fixed') {
    sortOptions.selectedItems = [];
  } else if (selectionFeedback === 'top-after-reopen') {
    sortOptions.selectedItems = topItems;
  }

  function onStateChange(changes) {
    if (changes.isOpen && !isOpen) {
      setTopItems(controlledSelectedItems);
    }

    const { type } = changes;
    switch (type) {
      case ItemClick:
      case MenuKeyDownSpaceButton:
      case MenuKeyDownEnter:
        onItemChange(changes.selectedItem);
        break;
      case MenuKeyDownArrowDown:
      case MenuKeyDownArrowUp:
        setHighlightedIndex(changes.highlightedIndex);
        break;
      case MenuBlur:
      case MenuKeyDownEscape:
        setIsOpenWrapper(false);
        setHighlightedIndex(changes.highlightedIndex);
        break;
      case ToggleButtonClick:
        setIsOpenWrapper(changes.isOpen || false);
        setHighlightedIndex(changes.highlightedIndex);
        break;
    }
  }

  const onKeyDown = (e) => {
    if (match(e, keys.Delete) && !disabled) {
      clearSelection();
      e.stopPropagation();
    }
  };

  const toggleButtonProps = getToggleButtonProps();

  return (
    <div className={wrapperClasses}>
      <label className={titleClasses} {...getLabelProps()}>
        {titleText && titleText}
        {selectedItems.length > 0 && (
          <span className={`${prefix}--visually-hidden`}>
            {clearSelectionDescription} {selectedItems.length},
            {clearSelectionText}
          </span>
        )}
      </label>
      <ListBox
        type={type}
        size={size}
        className={className}
        disabled={disabled}
        light={light}
        invalid={invalid}
        invalidText={invalidText}
        warn={warn}
        warnText={warnText}
        isOpen={isOpen}
        id={id}>
        {invalid && (
          <WarningFilled className={`${prefix}--list-box__invalid-icon`} />
        )}
        {showWarning && (
          <WarningAltFilled
            className={`${prefix}--list-box__invalid-icon ${prefix}--list-box__invalid-icon--warning`}
          />
        )}
        <button
          type="button"
          className={`${prefix}--list-box__field`}
          disabled={disabled}
          aria-disabled={disabled}
          {...toggleButtonProps}
          ref={mergeRefs(toggleButtonProps.ref, ref)}
          onKeyDown={onKeyDown}>
          {selectedItems.length > 0 && (
            <ListBox.Selection
              clearSelection={!disabled ? clearSelection : noop}
              selectionCount={selectedItems.length}
              translateWithId={translateWithId}
              disabled={disabled}
            />
          )}
          <span id={fieldLabelId} className={`${prefix}--list-box__label`}>
            {label}
          </span>
          <ListBox.MenuIcon isOpen={isOpen} translateWithId={translateWithId} />
        </button>
        <ListBox.Menu aria-multiselectable="true" {...getMenuProps()}>
          {isOpen &&
            sortItems(items, sortOptions).map((item, index) => {
              const itemProps = getItemProps({
                item,
                // we don't want Downshift to set aria-selected for us
                // we also don't want to set 'false' for reader verbosity's sake
                ['aria-selected']: isChecked ? true : null,
              });
              const itemText = itemToString(item);
              const isChecked =
                selectedItems.filter((selected) => isEqual(selected, item))
                  .length > 0;
              return (
                <ListBox.MenuItem
                  key={itemProps.id}
                  isActive={isChecked}
                  aria-label={itemText}
                  isHighlighted={highlightedIndex === index}
                  title={itemText}
                  {...itemProps}>
                  <div className={`${prefix}--checkbox-wrapper`}>
                    <span
                      title={useTitleInItem ? itemText : null}
                      className={`${prefix}--checkbox-label`}
                      data-contained-checkbox-state={isChecked}
                      id={`${itemProps.id}__checkbox`}>
                      {itemText}
                    </span>
                  </div>
                </ListBox.MenuItem>
              );
            })}
        </ListBox.Menu>
      </ListBox>
      {!inline && !invalid && !warn && helperText && (
        <div id={helperId} className={helperClasses}>
          {helperText}
        </div>
      )}
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';
MultiSelect.propTypes = {
  ...sortingPropTypes,

  /**
   * Specify the text that should be read for screen readers that describes total items selected
   */
  clearSelectionDescription: PropTypes.string,

  /**
   * Specify the text that should be read for screen readers to clear selection.
   */
  clearSelectionText: PropTypes.string,

  /**
   * Specify the direction of the multiselect dropdown. Can be either top or bottom.
   */
  direction: PropTypes.oneOf(['top', 'bottom']),

  /**
   * Disable the control
   */
  disabled: PropTypes.bool,

  /**
   * Additional props passed to Downshift
   */
  downshiftProps: PropTypes.shape(Downshift.propTypes),

  /**
   * Specify a custom `id`
   */
  id: PropTypes.string.isRequired,

  /**
   * Allow users to pass in arbitrary items from their collection that are
   * pre-selected
   */
  initialSelectedItems: PropTypes.array,

  /**
   * Is the current selection invalid?
   */
  invalid: PropTypes.bool,

  /**
   * If invalid, what is the error?
   */
  invalidText: PropTypes.node,

  /**
   * Helper function passed to downshift that allows the library to render a
   * given item to a string label. By default, it extracts the `label` field
   * from a given item to serve as the item label in the list.
   */
  itemToString: PropTypes.func,

  /**
   * We try to stay as generic as possible here to allow individuals to pass
   * in a collection of whatever kind of data structure they prefer
   */
  items: PropTypes.array.isRequired,

  /**
   * Generic `label` that will be used as the textual representation of what
   * this field is for
   */
  label: PropTypes.node.isRequired,

  /**
   * `true` to use the light version.
   */
  light: PropTypes.bool,

  /**
   * Specify the locale of the control. Used for the default `compareItems`
   * used for sorting the list of items in the control.
   */
  locale: PropTypes.string,

  /**
   * `onChange` is a utility for this controlled component to communicate to a
   * consuming component what kind of internal state changes are occuring.
   */
  onChange: PropTypes.func,

  /**
   * `onMenuChange` is a utility for this controlled component to communicate to a
   * consuming component that the menu was opend(`true`)/closed(`false`).
   */
  onMenuChange: PropTypes.func,

  /**
   * Initialize the component with an open(`true`)/closed(`false`) menu.
   */
  open: PropTypes.bool,

  /**
   * Specify feedback (mode) of the selection.
   * `top`: selected item jumps to top
   * `fixed`: selected item stays at it's position
   * `top-after-reopen`: selected item jump to top after reopen dropdown
   */
  selectionFeedback: PropTypes.oneOf(['top', 'fixed', 'top-after-reopen']),

  /**
   * Specify the size of the ListBox. Currently supports either `sm`, `md` or `lg` as an option.
   */
  size: ListBoxPropTypes.ListBoxSize,

  /**
   * Provide text to be used in a `<label>` element that is tied to the
   * multiselect via ARIA attributes.
   */
  titleText: PropTypes.node,

  /**
   * Callback function for translating ListBoxMenuIcon SVG title
   */
  translateWithId: PropTypes.func,

  /**
   * Specify 'inline' to create an inline multi-select.
   */
  type: PropTypes.oneOf(['default', 'inline']),

  /**
   * Specify title to show title on hover
   */
  useTitleInItem: PropTypes.bool,

  /**
   * Specify whether the control is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText: PropTypes.node,
};

MultiSelect.defaultProps = {
  compareItems: defaultCompareItems,
  disabled: false,
  locale: 'en',
  itemToString: defaultItemToString,
  initialSelectedItems: [],
  sortItems: defaultSortItems,
  type: 'default',
  light: false,
  title: false,
  open: false,
  selectionFeedback: 'top-after-reopen',
  direction: 'bottom',
  clearSelectionText: 'To clear selection, press Delete or Backspace,',
  clearSelectionDescription: 'Total items selected: ',
};

export default MultiSelect;
