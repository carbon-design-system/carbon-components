/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { WarningFilled16, WarningAltFilled16 } from '@carbon/icons-react';
import { settings } from 'carbon-components';
import cx from 'classnames';
import Downshift from 'downshift';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import React from 'react';
import { defaultFilterItems } from '../ComboBox/tools/filter';
import { sortingPropTypes } from './MultiSelectPropTypes';
import ListBox, { PropTypes as ListBoxPropTypes } from '../ListBox';
import { ListBoxTrigger, ListBoxSelection } from '../ListBox/next';
import { match, keys } from '../../internal/keyboard';
import Selection from '../../internal/Selection';
import { mapDownshiftProps } from '../../tools/createPropAdapter';
import { defaultItemToString } from './tools/itemToString';
import mergeRefs from '../../tools/mergeRefs';
import setupGetInstanceId from '../../tools/setupGetInstanceId';
import { defaultSortItems, defaultCompareItems } from './tools/sorting';

const { prefix } = settings;

const getInstanceId = setupGetInstanceId();

export default class FilterableMultiSelect extends React.Component {
  static propTypes = {
    /**
     * 'aria-label' of the ListBox component.
     */
    ariaLabel: PropTypes.string,

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
     * consuming component that the menu was opened(`true`)/closed(`false`).
     */
    onMenuChange: PropTypes.func,

    /**
     * Initialize the component with an open(`true`)/closed(`false`) menu.
     */
    open: PropTypes.bool,

    /**
     * Generic `placeholder` that will be used as the textual representation of
     * what this field is for
     */
    placeholder: PropTypes.string.isRequired,

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

    ...sortingPropTypes,

    /**
     * Callback function for translating ListBoxMenuIcon SVG title
     */
    translateWithId: PropTypes.func,

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

  static getDerivedStateFromProps({ open }, state) {
    /**
     * programmatically control this `open` prop
     */
    const { prevOpen } = state;
    return prevOpen === open
      ? null
      : {
          isOpen: open,
          prevOpen: open,
        };
  }

  static defaultProps = {
    ariaLabel: 'Choose an item',
    compareItems: defaultCompareItems,
    disabled: false,
    filterItems: defaultFilterItems,
    initialSelectedItems: [],
    itemToString: defaultItemToString,
    locale: 'en',
    sortItems: defaultSortItems,
    light: false,
    open: false,
    selectionFeedback: 'top-after-reopen',
  };

  constructor(props) {
    super(props);
    this.filterableMultiSelectInstanceId = getInstanceId();
    this.state = {
      isOpen: props.open,
      inputValue: '',
      topItems: [],
      inputFocused: false,
      highlightedIndex: null,
    };
    this.textInput = React.createRef();
  }

  handleOnChange = (changes) => {
    if (this.props.onChange) {
      this.props.onChange(changes);
    }
  };

  handleOnMenuChange = (isOpen) => {
    this.setState((state) => ({
      isOpen: isOpen ?? !state.isOpen,
    }));
    if (this.props.onMenuChange) {
      this.props.onMenuChange(isOpen);
    }
  };

  handleOnOuterClick = () => {
    this.handleOnMenuChange(false);
  };

  handleOnStateChange = (changes, downshift) => {
    if (changes.isOpen && !this.state.isOpen) {
      this.setState({ topItems: downshift.selectedItem });
    }

    const { type } = changes;
    const { stateChangeTypes } = Downshift;

    switch (type) {
      case stateChangeTypes.keyDownArrowDown:
      case stateChangeTypes.keyDownArrowUp:
      case stateChangeTypes.keyDownHome:
      case stateChangeTypes.keyDownEnd:
        this.setState({
          highlightedIndex:
            changes.highlightedIndex !== undefined
              ? changes.highlightedIndex
              : null,
        });
        if (stateChangeTypes.keyDownArrowDown === type && !this.state.isOpen) {
          this.handleOnMenuChange(true);
        }
        break;
      case stateChangeTypes.keyDownEscape:
        this.handleOnMenuChange(false);
        break;
    }
  };

  handleOnInputKeyDown = (event) => {
    event.stopPropagation();
  };

  handleOnInputValueChange = (inputValue, { type }) => {
    if (type !== Downshift.stateChangeTypes.changeInput) {
      return;
    }

    this.setState(() => {
      if (Array.isArray(inputValue)) {
        return {
          inputValue: '',
        };
      }
      return {
        inputValue: inputValue || '',
      };
    });

    if (inputValue && !this.state.isOpen) {
      this.handleOnMenuChange(true);
    } else if (!inputValue && this.state.isOpen) {
      this.handleOnMenuChange(false);
    }
  };

  clearInputValue = () => {
    this.setState({ inputValue: '' }, () => {
      if (this.textInput.current) {
        this.textInput.current.focus();
      }
    });
  };

  render() {
    const { highlightedIndex, isOpen, inputValue } = this.state;
    const {
      ariaLabel,
      className: containerClassName,
      disabled,
      filterItems,
      items,
      itemToString,
      titleText,
      helperText,
      type,
      initialSelectedItems,
      id,
      locale,
      size,
      placeholder,
      sortItems,
      compareItems,
      light,
      invalid,
      invalidText,
      warn,
      warnText,
      useTitleInItem,
      translateWithId,
      downshiftProps,
    } = this.props;
    const inline = type === 'inline';
    const showWarning = !invalid && warn;

    const wrapperClasses = cx(
      `${prefix}--multi-select__wrapper`,
      `${prefix}--list-box__wrapper`,
      {
        [`${prefix}--multi-select__wrapper--inline`]: inline,
        [`${prefix}--list-box__wrapper--inline`]: inline,
        [`${prefix}--multi-select__wrapper--inline--invalid`]:
          inline && invalid,
        [`${prefix}--list-box__wrapper--inline--invalid`]: inline && invalid,
      }
    );
    const helperId = !helperText
      ? undefined
      : `filterablemultiselect-helper-text-${this.filterableMultiSelectInstanceId}`;
    const labelId = `${id}-label`;
    const titleClasses = cx({
      [`${prefix}--label`]: true,
      [`${prefix}--label--disabled`]: disabled,
    });
    const helperClasses = cx({
      [`${prefix}--form__helper-text`]: true,
      [`${prefix}--form__helper-text--disabled`]: disabled,
    });
    const inputClasses = cx({
      [`${prefix}--text-input`]: true,
      [`${prefix}--text-input--empty`]: !this.state.inputValue,
      [`${prefix}--text-input--light`]: light,
    });
    const helper = helperText ? (
      <div id={helperId} className={helperClasses}>
        {helperText}
      </div>
    ) : null;
    const menuId = `${id}__menu`;
    const inputId = `${id}-input`;

    return (
      <Selection
        disabled={disabled}
        onChange={this.handleOnChange}
        initialSelectedItems={initialSelectedItems}
        render={({ selectedItems, onItemChange, clearSelection }) => (
          <Downshift
            {...mapDownshiftProps(downshiftProps)}
            highlightedIndex={highlightedIndex}
            id={id}
            isOpen={isOpen}
            inputValue={inputValue}
            onInputValueChange={this.handleOnInputValueChange}
            onChange={(selectedItem) => {
              if (selectedItem !== null) {
                onItemChange(selectedItem);
              }
            }}
            itemToString={itemToString}
            onStateChange={this.handleOnStateChange}
            onOuterClick={this.handleOnOuterClick}
            selectedItem={selectedItems}
            labelId={labelId}
            menuId={menuId}
            inputId={inputId}>
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              getRootProps,
              getToggleButtonProps,
              isOpen,
              inputValue,
              selectedItem,
            }) => {
              const className = cx(
                `${prefix}--multi-select`,
                `${prefix}--combo-box`,
                `${prefix}--multi-select--filterable`,
                containerClassName,
                {
                  [`${prefix}--multi-select--invalid`]: invalid,
                  [`${prefix}--multi-select--open`]: isOpen,
                  [`${prefix}--multi-select--inline`]: inline,
                  [`${prefix}--multi-select--selected`]:
                    selectedItem.length > 0,
                  [`${prefix}--multi-select--filterable--input-focused`]: this
                    .state.inputFocused,
                }
              );
              const rootProps = getRootProps(
                {},
                {
                  suppressRefError: true,
                }
              );
              const labelProps = getLabelProps();
              const buttonProps = getToggleButtonProps({
                disabled,
                onClick: () => {
                  this.handleOnMenuChange(!this.state.isOpen);
                  if (this.textInput.current) {
                    this.textInput.current.focus();
                  }
                },
                // When we moved the "root node" of Downshift to the <input> for
                // ARIA 1.2 compliance, we unfortunately hit this branch for the
                // "mouseup" event that downshift listens to:
                // https://github.com/downshift-js/downshift/blob/v5.2.1/src/downshift.js#L1051-L1065
                //
                // As a result, it will reset the state of the component and so we
                // stop the event from propagating to prevent this. This allows the
                // toggleMenu behavior for the toggleButton to correctly open and
                // close the menu.
                onMouseUp(event) {
                  event.stopPropagation();
                },
              });
              const inputProps = getInputProps({
                'aria-controls': isOpen ? menuId : null,
                'aria-describedby': helperText ? helperId : null,
                // Remove excess aria `aria-labelledby`. HTML <label for>
                // provides this aria information.
                'aria-labelledby': null,
                disabled,
                placeholder,
                onClick: () => {
                  this.handleOnMenuChange(true);
                },
                onKeyDown: (event) => {
                  if (match(event, keys.Space)) {
                    event.stopPropagation();
                  }
                },
                onFocus: () => {
                  this.setState({ inputFocused: true });
                },
                onBlur: () => {
                  this.setState({ inputFocused: false });
                },
              });
              const menuProps = getMenuProps(
                {
                  'aria-label': ariaLabel,
                },
                {
                  suppressRefError: true,
                }
              );

              return (
                <div className={wrapperClasses}>
                  {titleText ? (
                    <label className={titleClasses} {...labelProps}>
                      {titleText}
                    </label>
                  ) : null}
                  <ListBox
                    className={className}
                    disabled={disabled}
                    light={light}
                    invalid={invalid}
                    invalidText={invalidText}
                    warn={warn}
                    warnText={warnText}
                    isOpen={isOpen}
                    size={size}>
                    <div className={`${prefix}--list-box__field`}>
                      {selectedItem.length > 0 && (
                        <ListBoxSelection
                          clearSelection={() => {
                            clearSelection();
                            if (this.textInput.current) {
                              this.textInput.current.focus();
                            }
                          }}
                          selectionCount={selectedItem.length}
                          translateWithId={translateWithId}
                          disabled={disabled}
                        />
                      )}
                      <input
                        className={inputClasses}
                        {...rootProps}
                        {...inputProps}
                        ref={mergeRefs(this.textInput, rootProps.ref)}
                      />
                      {invalid && (
                        <WarningFilled16
                          className={`${prefix}--list-box__invalid-icon`}
                        />
                      )}
                      {showWarning && (
                        <WarningAltFilled16
                          className={`${prefix}--list-box__invalid-icon ${prefix}--list-box__invalid-icon--warning`}
                        />
                      )}
                      {inputValue && (
                        <ListBoxSelection
                          clearSelection={this.clearInputValue}
                          disabled={disabled}
                          translateWithId={translateWithId}
                          onMouseUp={(event) => {
                            // If we do not stop this event from propagating,
                            // it seems like Downshift takes our event and
                            // prevents us from getting `onClick` /
                            // `clearSelection` from the underlying <button> in
                            // ListBoxSelection
                            event.stopPropagation();
                          }}
                        />
                      )}
                      <ListBoxTrigger
                        {...buttonProps}
                        isOpen={isOpen}
                        translateWithId={translateWithId}
                      />
                    </div>
                    {isOpen ? (
                      <ListBox.Menu {...menuProps}>
                        {sortItems(
                          filterItems(items, { itemToString, inputValue }),
                          {
                            selectedItems: {
                              top: selectedItems,
                              fixed: [],
                              'top-after-reopen': this.state.topItems,
                            }[this.props.selectionFeedback],
                            itemToString,
                            compareItems,
                            locale,
                          }
                        ).map((item, index) => {
                          const itemProps = getItemProps({ item });
                          const itemText = itemToString(item);
                          const isChecked =
                            selectedItem.filter((selected) =>
                              isEqual(selected, item)
                            ).length > 0;
                          return (
                            <ListBox.MenuItem
                              key={itemProps.id}
                              aria-label={itemText}
                              isActive={isChecked}
                              isHighlighted={highlightedIndex === index}
                              title={itemText}
                              {...itemProps}>
                              <div className={`${prefix}--checkbox-wrapper`}>
                                <span
                                  title={useTitleInItem ? itemText : null}
                                  className={`${prefix}--checkbox-label`}
                                  data-contained-checkbox-state={isChecked}
                                  id={`${itemProps.id}-item`}>
                                  {itemText}
                                </span>
                              </div>
                            </ListBox.MenuItem>
                          );
                        })}
                      </ListBox.Menu>
                    ) : null}
                  </ListBox>
                  {!inline && !invalid && !warn ? helper : null}
                </div>
              );
            }}
          </Downshift>
        )}
      />
    );
  }
}
