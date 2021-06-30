/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash.isequal';
import getDerivedStateFromProps from './state/getDerivedStateFromProps';
import { getNextSortState } from './state/sorting';
import { getCellId } from './tools/cells';
import denormalize from './tools/denormalize';
import { composeEventHandlers } from '../../tools/events';
import { defaultFilterRows } from './tools/filter';
import { defaultSortRow } from './tools/sorting';
import setupGetInstanceId from './tools/instanceId';

const getInstanceId = setupGetInstanceId();

const translationKeys = {
  expandRow: 'carbon.table.row.expand',
  collapseRow: 'carbon.table.row.collapse',
  expandAll: 'carbon.table.all.expand',
  collapseAll: 'carbon.table.all.collapse',
  selectAll: 'carbon.table.all.select',
  unselectAll: 'carbon.table.all.unselect',
  selectRow: 'carbon.table.row.select',
  unselectRow: 'carbon.table.row.unselect',
};

const defaultTranslations = {
  [translationKeys.expandAll]: 'Expand all rows',
  [translationKeys.collapseAll]: 'Collapse all rows',
  [translationKeys.expandRow]: 'Expand current row',
  [translationKeys.collapseRow]: 'Collapse current row',
  [translationKeys.selectAll]: 'Select all rows',
  [translationKeys.unselectAll]: 'Unselect all rows',
  [translationKeys.selectRow]: 'Select row',
  [translationKeys.unselectRow]: 'Unselect row',
};

const translateWithId = (id) => defaultTranslations[id];

/**
 * Data Tables are used to represent a collection of resources, displaying a
 * subset of their fields in columns, or headers. We prioritize direct updates
 * to the state of what we're rendering, so internally we end up normalizing the
 * given data and then denormalizing it when rendering.
 *
 * As a result, each part of the DataTable is accessible through look-up by id,
 * and updating the state of the single entity will cascade updates to the
 * consumer.
 */
export default class DataTable extends React.Component {
  static propTypes = {
    /**
     * Optional hook to manually control filtering of the rows from the
     * TableToolbarSearch component
     */
    filterRows: PropTypes.func,

    /**
     * The `headers` prop represents the order in which the headers should
     * appear in the table. We expect an array of objects to be passed in, where
     * `key` is the name of the key in a row object, and `header` is the name of
     * the header.
     */
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        header: PropTypes.node.isRequired,
      })
    ).isRequired,

    /**
     * Specify whether the table should be able to be sorted by its headers
     */
    isSortable: PropTypes.bool,

    /**
     * Provide a string for the current locale
     */
    locale: PropTypes.string,

    /**
     * Specify whether the overflow menu (if it exists) should be shown always, or only on hover
     */
    overflowMenuOnHover: PropTypes.bool,

    /**
     * Specify whether the control should be a radio button or inline checkbox
     */
    radio: PropTypes.bool,

    /**
     * The `rows` prop is where you provide us with a list of all the rows that
     * you want to render in the table. The only hard requirement is that this
     * is an array of objects, and that each object has a unique `id` field
     * available on it.
     */
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        isSelected: PropTypes.bool,
        isExpanded: PropTypes.bool,
      })
    ).isRequired,

    /**
     * `false` If true, will remove the table border
     */
    shouldShowBorder: PropTypes.bool,

    /**
     *  Change the row height of table. Currently supports `xs`, `sm`, `md`, `lg`, and `xl`.
     *  The previous terms (`compact`, `short`, `normal`, and `tall`) will be removed in the next major release.
     */
    size: PropTypes.oneOf([
      'compact',
      'short',
      'normal',
      'tall',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ]),

    /**
     * Optional hook to manually control sorting of the rows.
     */
    sortRow: PropTypes.func,

    /**
     * Specify whether the header should be sticky.
     * Still experimental: may not work with every combination of table props
     */
    stickyHeader: PropTypes.bool,

    /**
     * Optional method that takes in a message id and returns an
     * internationalized string. See `DataTable.translationKeys` for all
     * available message ids.
     */
    translateWithId: PropTypes.func,

    /**
     * `false` If true, will use a width of 'auto' instead of 100%
     */
    useStaticWidth: PropTypes.bool,

    /**
     * `true` to add useZebraStyles striping.
     */
    useZebraStyles: PropTypes.bool,
  };

  static defaultProps = {
    sortRow: defaultSortRow,
    filterRows: defaultFilterRows,
    locale: 'en',
    size: 'normal',
    overflowMenuOnHover: true,
    translateWithId,
  };

  static translationKeys = Object.values(translationKeys);

  constructor(props) {
    super(props);
    this.state = {
      ...getDerivedStateFromProps(props, {}),
      isExpandedAll: false, // Start with collapsed state, treat `undefined` as neutral state
    };
    this.instanceId = getInstanceId();
  }

  componentDidUpdate(prevProps) {
    if (prevProps === this.props) {
      return;
    }

    const prevRowIds = prevProps.rows.map((row) => row.id);
    const rowIds = this.props.rows.map((row) => row.id);

    if (!isEqual(prevRowIds, rowIds)) {
      this.setState((state) => getDerivedStateFromProps(this.props, state));
      return;
    }

    const prevHeaders = prevProps.headers.map((header) => header.key);
    const headers = this.props.headers.map((header) => header.key);

    if (!isEqual(prevHeaders, headers)) {
      this.setState((state) => getDerivedStateFromProps(this.props, state));
      return;
    }

    if (!isEqual(prevProps.rows, this.props.rows)) {
      this.setState((state) => getDerivedStateFromProps(this.props, state));
      return;
    }
  }

  /**
   * Get the props associated with the given header. Mostly used for adding in
   * sorting behavior.
   *
   * @param {object} config
   * @param {string} config.header the header we want the props for
   * @param {Function} config.onClick a custom click handler for the header
   * @param {boolean} config.isSortable
   * @returns {object}
   */
  getHeaderProps = ({
    header,
    onClick,
    isSortable = this.props.isSortable,
    ...rest
  }) => {
    const { sortDirection, sortHeaderKey } = this.state;
    return {
      ...rest,
      key: header.key,
      sortDirection,
      isSortable,
      isSortHeader: sortHeaderKey === header.key,
      onClick: (event) => {
        const nextSortState = getNextSortState(this.props, this.state, {
          key: header.key,
        });
        this.setState(nextSortState, () => {
          onClick &&
            this.handleOnHeaderClick(onClick, {
              sortHeaderKey: header.key,
              sortDirection: nextSortState.sortDirection,
            })(event);
        });
      },
    };
  };

  /**
   * Get the props associated with the given expand header.
   *
   * @param {object} config
   * @param {Function} config.onClick a custom click handler for the expand header
   * @returns {object}
   */
  getExpandHeaderProps = ({ onClick, ...rest } = {}) => {
    const { translateWithId: t } = this.props;
    const { isExpandedAll, rowIds, rowsById } = this.state;
    const isExpanded =
      isExpandedAll || rowIds.every((id) => rowsById[id].isExpanded);
    const translationKey = !isExpanded
      ? translationKeys.collapseAll
      : translationKeys.expandAll;
    return {
      ...rest,
      ariaLabel: t(translationKey),
      isExpanded,
      // Compose the event handlers so we don't overwrite a consumer's `onClick`
      // handler
      onExpand: composeEventHandlers([
        this.handleOnExpandAll,
        onClick
          ? this.handleOnExpandHeaderClick(onClick, {
              isExpanded,
            })
          : null,
      ]),
    };
  };

  /**
   * Decorate consumer's `onClick` event handler with sort parameters
   *
   * @param {Function} onClick
   * @param {object} sortParams
   * @returns {Function}
   */
  handleOnHeaderClick = (onClick, sortParams) => {
    return (e) => onClick(e, sortParams);
  };

  /**
   * Decorate consumer's `onClick` event handler with sort parameters
   *
   * @param {Function} onClick
   * @param {object} expandParams
   * @returns {Function}
   */
  handleOnExpandHeaderClick = (onClick, expandParams) => {
    return (e) => onClick(e, expandParams);
  };

  /**
   * Get the props associated with the given row. Mostly used for expansion.
   *
   * @param {object} config
   * @param {object} config.row the row we want the props for
   * @param {Function} config.onClick a custom click handler for the header
   * @returns {object}
   */
  getRowProps = ({ row, onClick, ...rest }) => {
    const { translateWithId: t } = this.props;
    const translationKey = row.isExpanded
      ? translationKeys.collapseRow
      : translationKeys.expandRow;
    return {
      ...rest,
      key: row.id,
      // Compose the event handlers so we don't overwrite a consumer's `onClick`
      // handler
      onExpand: composeEventHandlers([this.handleOnExpandRow(row.id), onClick]),
      isExpanded: row.isExpanded,
      ariaLabel: t(translationKey),
      isSelected: row.isSelected,
      disabled: row.disabled,
    };
  };

  /**
   * Gets the props associated with selection for a header or a row, where
   * applicable. Most often used to indicate selection status of the table or
   * for a specific row.
   *
   * @param {object} [row] an optional row that we want to access the props for
   * @param {Function} row.onClick
   * @param {object} row.row
   * @returns {object}
   */
  getSelectionProps = ({ onClick, row, ...rest } = {}) => {
    const { translateWithId: t } = this.props;

    // If we're given a row, return the selection state values for that row
    if (row) {
      const translationKey = row.isSelected
        ? translationKeys.unselectRow
        : translationKeys.selectRow;
      return {
        ...rest,
        checked: row.isSelected,
        onSelect: composeEventHandlers([
          this.handleOnSelectRow(row.id),
          onClick,
        ]),
        id: `${this.getTablePrefix()}__select-row-${row.id}`,
        name: `select-row-${row.id}`,
        ariaLabel: t(translationKey),
        disabled: row.disabled,
        radio: this.props.radio || null,
      };
    }

    // Otherwise, we're working on `TableSelectAll` which handles toggling the
    // selection state of all rows.
    const rowCount = this.state.rowIds.length;
    const selectedRowCount = this.getSelectedRows().length;
    const checked = rowCount > 0 && selectedRowCount === rowCount;
    const indeterminate =
      rowCount > 0 && selectedRowCount > 0 && selectedRowCount !== rowCount;
    const translationKey =
      checked || indeterminate
        ? translationKeys.unselectAll
        : translationKeys.selectAll;

    return {
      ...rest,
      ariaLabel: t(translationKey),
      checked,
      id: `${this.getTablePrefix()}__select-all`,
      indeterminate,
      name: 'select-all',
      onSelect: composeEventHandlers([this.handleSelectAll, onClick]),
    };
  };

  getToolbarProps = (props = {}) => {
    const { size } = this.props;
    // Remove compact, short in V11
    let isSmall =
      size === 'compact' || size === 'short' || size === 'xs' || size === 'sm';
    return {
      ...props,
      size: isSmall ? 'small' : 'normal',
    };
  };

  getBatchActionProps = (props = {}) => {
    const { shouldShowBatchActions } = this.state;
    const totalSelected = this.getSelectedRows().length;
    return {
      ...props,
      shouldShowBatchActions,
      totalSelected,
      onCancel: this.handleOnCancel,
    };
  };
  /**
   * Helper utility to get the Table Props.
   */
  getTableProps = () => {
    const {
      useZebraStyles,
      size,
      isSortable,
      useStaticWidth,
      shouldShowBorder,
      stickyHeader,
      overflowMenuOnHover,
    } = this.props;
    return {
      useZebraStyles,
      size,
      isSortable,
      useStaticWidth,
      shouldShowBorder,
      stickyHeader,
      overflowMenuOnHover,
    };
  };

  /**
   * Helper utility to get the TableContainer Props.
   */
  getTableContainerProps = () => {
    const { stickyHeader } = this.props;

    return {
      stickyHeader,
    };
  };

  /**
   * Helper utility to get all the currently selected rows
   * @returns {Array<string>} the array of rowIds that are currently selected
   */
  getSelectedRows = () =>
    this.state.rowIds.filter((id) => {
      const row = this.state.rowsById[id];
      return row.isSelected && !row.disabled;
    });

  /**
   * Helper utility to get all of the available rows after applying the filter
   * @returns {Array<string>} the array of rowIds that are currently included through the filter
   *  */
  getFilteredRowIds = () => {
    const filteredRowIds =
      typeof this.state.filterInputValue === 'string'
        ? this.props.filterRows({
            rowIds: this.state.rowIds,
            headers: this.props.headers,
            cellsById: this.state.cellsById,
            inputValue: this.state.filterInputValue,
            getCellId,
          })
        : this.state.rowIds;
    if (filteredRowIds.length == 0) {
      return [];
    }
    return filteredRowIds;
  };

  /**
   * Helper for getting the table prefix for elements that require an
   * `id` attribute that is unique.
   *
   * @returns {string}
   */
  getTablePrefix = () => `data-table-${this.instanceId}`;

  /**
   * Helper for toggling all selected items in a state. Does not call
   * setState, so use it when setting state.
   * @param {object} initialState
   * @returns {object} object to put into this.setState (use spread operator)
   */
  setAllSelectedState = (initialState, isSelected, filteredRowIds) => {
    const { rowIds } = initialState;
    return {
      rowsById: rowIds.reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...initialState.rowsById[id],
            ...(!initialState.rowsById[id].disabled && {
              isSelected: filteredRowIds.includes(id) && isSelected,
            }),
          },
        }),
        {}
      ),
    };
  };

  /**
   * Handler for the `onCancel` event to hide the batch action bar and
   * deselect all selected rows
   */
  handleOnCancel = () => {
    this.setState((state) => {
      return {
        shouldShowBatchActions: false,
        ...this.setAllSelectedState(state, false, this.getFilteredRowIds()),
      };
    });
  };

  /**
   * Handler for toggling the selection state of all rows in the database
   */
  handleSelectAll = () => {
    this.setState((state) => {
      const filteredRowIds = this.getFilteredRowIds();
      const { rowsById } = state;
      const isSelected = !(
        Object.values(rowsById).filter((row) => row.isSelected && !row.disabled)
          .length > 0
      );
      return {
        shouldShowBatchActions: isSelected,
        ...this.setAllSelectedState(state, isSelected, filteredRowIds),
      };
    });
  };

  /**
   * Handler for toggling the selection state of a given row.
   *
   * @param {string} rowId
   * @returns {Function}
   */
  handleOnSelectRow = (rowId) => () => {
    this.setState((state) => {
      const row = state.rowsById[rowId];
      if (this.props.radio) {
        // deselect all radio buttons
        const rowsById = Object.entries(state.rowsById).reduce((p, c) => {
          const [key, val] = c;
          val.isSelected = false;
          p[key] = val;
          return p;
        }, {});
        return {
          shouldShowBatchActions: false,
          rowsById: {
            ...rowsById,
            [rowId]: {
              ...row,
              isSelected: !row.isSelected,
            },
          },
        };
      }
      const selectedRows = state.rowIds.filter(
        (id) => state.rowsById[id].isSelected
      ).length;
      // Predict the length of the selected rows after this change occurs
      const selectedRowsCount = !row.isSelected
        ? selectedRows + 1
        : selectedRows - 1;
      return {
        // Basic assumption here is that we want to show the batch action bar if
        // the row is being selected. If it's being unselected, then see if we
        // have a non-zero number of selected rows that batch actions could
        // still apply to
        shouldShowBatchActions: !row.isSelected || selectedRowsCount > 0,
        rowsById: {
          ...state.rowsById,
          [rowId]: {
            ...row,
            isSelected: !row.isSelected,
          },
        },
      };
    });
  };

  /**
   * Handler for toggling the expansion state of a given row.
   *
   * @param {string} rowId
   * @returns {Function}
   */
  handleOnExpandRow = (rowId) => () => {
    this.setState((state) => {
      const row = state.rowsById[rowId];
      const { isExpandedAll } = state;
      return {
        isExpandedAll: row.isExpanded ? false : isExpandedAll,
        rowsById: {
          ...state.rowsById,
          [rowId]: {
            ...row,
            isExpanded: !row.isExpanded,
          },
        },
      };
    });
  };

  /**
   * Handler for changing the expansion state of all rows.
   */
  handleOnExpandAll = () => {
    this.setState((state) => {
      const { rowIds, isExpandedAll } = state;
      return {
        isExpandedAll: !isExpandedAll,
        rowsById: rowIds.reduce(
          (acc, id) => ({
            ...acc,
            [id]: {
              ...state.rowsById[id],
              isExpanded: !isExpandedAll,
            },
          }),
          {}
        ),
      };
    });
  };

  /**
   * Handler for transitioning to the next sort state of the table
   *
   * @param {string} headerKey the field for the header that we are sorting by
   * @returns {Function}
   */
  handleSortBy = (headerKey) => () => {
    this.setState((state) =>
      getNextSortState(this.props, state, { key: headerKey })
    );
  };

  /**
   * Event handler for transitioning input value state changes for the table
   * filter component.
   *
   * @param {Event} event
   */
  handleOnInputValueChange = (event, defaultValue) => {
    if (event.target) {
      this.setState({ filterInputValue: event.target.value });
    }

    if (defaultValue) {
      this.setState({ filterInputValue: defaultValue });
    }
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { children, filterRows, headers, render } = this.props;
    const { filterInputValue, rowIds, rowsById, cellsById } = this.state;
    const filteredRowIds =
      typeof filterInputValue === 'string'
        ? filterRows({
            rowIds,
            headers,
            cellsById,
            inputValue: filterInputValue,
            getCellId,
          })
        : rowIds;
    const renderProps = {
      // Data derived from state
      rows: denormalize(filteredRowIds, rowsById, cellsById),
      headers: this.props.headers,
      selectedRows: denormalize(this.getSelectedRows(), rowsById, cellsById),

      // Prop accessors/getters
      getHeaderProps: this.getHeaderProps,
      getExpandHeaderProps: this.getExpandHeaderProps,
      getRowProps: this.getRowProps,
      getSelectionProps: this.getSelectionProps,
      getToolbarProps: this.getToolbarProps,
      getBatchActionProps: this.getBatchActionProps,
      getTableProps: this.getTableProps,
      getTableContainerProps: this.getTableContainerProps,

      // Custom event handlers
      onInputChange: this.handleOnInputValueChange,

      // Expose internal state change actions
      sortBy: (headerKey) => this.handleSortBy(headerKey)(),
      selectAll: this.handleSelectAll,
      selectRow: (rowId) => this.handleOnSelectRow(rowId)(),
      expandRow: (rowId) => this.handleOnExpandRow(rowId)(),
      expandAll: this.handleOnExpandAll,
      radio: this.props.radio,
    };

    if (render !== undefined) {
      return render(renderProps);
    }

    if (children !== undefined) {
      return children(renderProps);
    }

    return null;
  }
}
