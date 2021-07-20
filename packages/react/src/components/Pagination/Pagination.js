/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { CaretRight16, CaretLeft16 } from '@carbon/icons-react';
import { settings } from 'carbon-components';
import Select from '../Select';
import SelectItem from '../SelectItem';
import { equals } from '../../tools/array';
import Button from '../Button';

const { prefix } = settings;

let instanceId = 0;

const mapPageSizesToObject = (sizes) => {
  return typeof sizes[0] === 'object' && sizes[0] !== null
    ? sizes
    : sizes.map((size) => ({ text: size, value: size }));
};

export default class Pagination extends Component {
  constructor(props) {
    super(props);
    const { pageSizes: _pageSizes, page, pageSize } = this.props;

    const pageSizes = mapPageSizesToObject(_pageSizes);

    this.state = {
      page: page,
      pageSize:
        pageSize && pageSizes.some((sizeObj) => pageSize === sizeObj.value)
          ? pageSize
          : pageSizes[0].value,
      prevPageSizes: pageSizes,
      prevPage: page,
      prevPageSize: pageSize,
    };
    this.uniqueId = ++instanceId;
  }

  static propTypes = {
    /**
     * The description for the backward icon.
     */
    backwardText: PropTypes.string,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * `true` if the backward/forward buttons, as well as the page select elements,  should be disabled.
     */
    disabled: PropTypes.bool,

    /**
     * The description for the forward icon.
     */
    forwardText: PropTypes.string,

    /**
     * The unique ID of this component instance.
     */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    // TODO: remove when v9 is deprecated
    /**
     * `true` if the current page should be the last page.
     */
    isLastPage: PropTypes.bool,

    /**
     * The function returning a translatable text showing where the current page is,
     * in a manner of the range of items.
     */
    itemRangeText: PropTypes.func,

    /**
     * A variant of `itemRangeText`, used if the total number of items is unknown.
     */
    itemText: PropTypes.func,

    /**
     * The translatable text indicating the number of items per page.
     */
    itemsPerPageText: PropTypes.string,

    /**
     * The callback function called when the current page changes.
     */
    onChange: PropTypes.func,

    /**
     * The current page.
     */
    page: PropTypes.number,

    /**
     * `true` if the select box to change the page should be disabled.
     */
    pageInputDisabled: PropTypes.bool,

    pageNumberText: PropTypes.string,

    /**
     * A function returning PII showing where the current page is.
     */
    pageRangeText: PropTypes.func,

    /**
     * The number dictating how many items a page contains.
     */
    pageSize: PropTypes.number,

    /**
     * `true` if the select box to change the items per page should be disabled.
     */
    pageSizeInputDisabled: PropTypes.bool,

    /**
     * The choices for `pageSize`.
     */
    pageSizes: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.text,
          value: PropTypes.number,
        })
      ),
    ]).isRequired,

    /**
     * The translatable text showing the current page.
     */
    pageText: PropTypes.func,

    /**
     * `true` if the total number of items is unknown.
     */
    pagesUnknown: PropTypes.bool,

    /**
     * Specify the size of the Pagination. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg']),

    /**
     * The total number of items.
     */
    totalItems: PropTypes.number,
  };

  static defaultProps = {
    backwardText: 'Previous page',
    itemRangeText: (min, max, total) => `${min}–${max} of ${total} items`,
    forwardText: 'Next page',
    itemsPerPageText: 'Items per page:',
    pageNumberText: 'Page Number',
    pageRangeText: (current, total) =>
      `of ${total} ${total === 1 ? 'page' : 'pages'}`,
    disabled: false,
    page: 1,
    pagesUnknown: false,
    isLastPage: false,
    itemText: (min, max) => `${min}–${max} items`,
    pageText: (page) => `page ${page}`,
  };

  static getDerivedStateFromProps(
    { pageSizes: _pageSizes, page, pageSize },
    state
  ) {
    const {
      prevPageSizes,
      prevPage,
      prevPageSize,
      page: currentPage,
      pageSize: currentPageSize,
    } = state;

    const pageSizes = mapPageSizesToObject(_pageSizes);
    const pageSizesValues = pageSizes.map((sizeObj) => sizeObj.value);
    const prevPageSizesValues = prevPageSizes.map((sizeObj) => sizeObj.value);

    const pageSizesChanged = !equals(pageSizesValues, prevPageSizesValues);
    if (
      pageSizesChanged &&
      !pageSizes.some((sizeObj) => pageSize === sizeObj.value)
    ) {
      pageSize = pageSizes[0].value;
    }
    const pageChanged = page !== prevPage;
    const pageSizeChanged = pageSize !== prevPageSize;
    return !pageSizesChanged && !pageChanged && !pageSizeChanged
      ? null
      : {
          page: (pageSizeChanged && 1) || (pageChanged && page) || currentPage,
          pageSize: pageSizeChanged ? pageSize : currentPageSize,
          prevPageSizes: pageSizes,
          prevPage: page,
          prevPageSize: pageSize,
        };
  }

  handleSizeChange = (evt) => {
    const pageSize = Number(evt.target.value);
    this.setState({ pageSize, page: 1 });
    this.props.onChange({ page: 1, pageSize });
  };

  handlePageChange = (evt) => {
    this.setState({ page: evt.target.value });
  };

  handlePageInputChange = (evt) => {
    const page = Number(evt.target.value);
    if (
      page > 0 &&
      page <=
        Math.max(Math.ceil(this.props.totalItems / this.state.pageSize), 1)
    ) {
      this.setState({ page });
      this.props.onChange({
        page,
        pageSize: this.state.pageSize,
      });
    }
  };

  incrementPage = () => {
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.onChange({ page, pageSize: this.state.pageSize });
  };

  decrementPage = () => {
    const page = this.state.page - 1;
    this.setState({ page });
    this.props.onChange({ page, pageSize: this.state.pageSize });
  };

  renderSelectItems = (total) => {
    let counter = 1;
    let itemArr = [];
    while (counter <= total) {
      itemArr.push(
        <SelectItem key={counter} value={counter} text={String(counter)} />
      );
      counter++;
    }
    return itemArr;
  };

  render() {
    const {
      backwardText,
      className,
      forwardText,
      id,
      itemsPerPageText,
      itemRangeText,
      pageRangeText,
      pageSize, // eslint-disable-line no-unused-vars
      pageSizes: _pageSizes,
      itemText,
      pageText,
      pageNumberText, // eslint-disable-line no-unused-vars
      pagesUnknown,
      isLastPage,
      disabled,
      pageInputDisabled,
      pageSizeInputDisabled,
      totalItems,
      onChange, // eslint-disable-line no-unused-vars
      page: pageNumber, // eslint-disable-line no-unused-vars
      size,
      ...other
    } = this.props;

    const classNames = classnames(`${prefix}--pagination`, className, {
      [`${prefix}--pagination--${size}`]: size,
    });
    const inputId = id || this.uniqueId;
    const { page: statePage, pageSize: statePageSize } = this.state;
    const totalPages = Math.max(Math.ceil(totalItems / statePageSize), 1);
    const backButtonDisabled = disabled || statePage === 1;
    const backButtonClasses = classnames(
      `${prefix}--pagination__button`,
      `${prefix}--pagination__button--backward`,
      {
        [`${prefix}--pagination__button--no-index`]: backButtonDisabled,
      }
    );
    const forwardButtonDisabled = disabled || statePage === totalPages;
    const forwardButtonClasses = classnames(
      `${prefix}--pagination__button`,
      `${prefix}--pagination__button--forward`,
      {
        [`${prefix}--pagination__button--no-index`]: forwardButtonDisabled,
      }
    );
    const selectItems = this.renderSelectItems(totalPages);
    const pageSizes = mapPageSizesToObject(_pageSizes);

    return (
      <div className={classNames} {...other}>
        <div className={`${prefix}--pagination__left`}>
          <label
            id={`${prefix}-pagination-select-${inputId}-count-label`}
            className={`${prefix}--pagination__text`}
            htmlFor={`${prefix}-pagination-select-${inputId}`}>
            {itemsPerPageText}
          </label>
          <Select
            id={`${prefix}-pagination-select-${inputId}`}
            className={`${prefix}--select__item-count`}
            labelText=""
            hideLabel
            noLabel
            inline
            onChange={this.handleSizeChange}
            disabled={pageSizeInputDisabled || disabled}
            value={statePageSize}>
            {pageSizes.map((sizeObj) => (
              <SelectItem
                key={sizeObj.value}
                value={sizeObj.value}
                text={String(sizeObj.text)}
              />
            ))}
          </Select>
          <span
            className={`${prefix}--pagination__text ${prefix}--pagination__items-count`}>
            {pagesUnknown
              ? itemText(
                  statePageSize * (statePage - 1) + 1,
                  statePage * statePageSize
                )
              : itemRangeText(
                  Math.min(statePageSize * (statePage - 1) + 1, totalItems),
                  Math.min(statePage * statePageSize, totalItems),
                  totalItems
                )}
          </span>
        </div>
        <div className={`${prefix}--pagination__right`}>
          <Select
            id={`${prefix}-pagination-select-${inputId}-right`}
            className={`${prefix}--select__page-number`}
            labelText={`Page number, of ${totalPages} pages`}
            inline
            hideLabel
            onChange={this.handlePageInputChange}
            value={statePage}
            disabled={pageInputDisabled || disabled}>
            {selectItems}
          </Select>
          <span className={`${prefix}--pagination__text`}>
            {pagesUnknown
              ? pageText(statePage)
              : pageRangeText(statePage, totalPages)}
          </span>
          <div className={`${prefix}--pagination__control-buttons`}>
            <Button
              kind="ghost"
              className={backButtonClasses}
              hasIconOnly
              renderIcon={CaretLeft16}
              iconDescription={backwardText}
              tooltipAlignment="center"
              tooltipPosition="top"
              onClick={this.decrementPage}
              disabled={backButtonDisabled}
            />
            <Button
              kind="ghost"
              className={forwardButtonClasses}
              hasIconOnly
              renderIcon={CaretRight16}
              iconDescription={forwardText}
              tooltipAlignment="end"
              tooltipPosition="top"
              onClick={this.incrementPage}
              disabled={forwardButtonDisabled || isLastPage}
            />
          </div>
        </div>
      </div>
    );
  }
}
