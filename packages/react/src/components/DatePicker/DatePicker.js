/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n/index';
import { settings } from 'carbon-components';
import DatePickerInput from '../DatePickerInput';
import carbonFlatpickrAppendToPlugin from './plugins/appendToPlugin';
import carbonFlatpickrFixEventsPlugin from './plugins/fixEventsPlugin';
import carbonFlatpickrRangePlugin from './plugins/rangePlugin';
import { match, keys } from '../../internal/keyboard';

const { prefix } = settings;

// Weekdays shorthand for english locale
l10n.en.weekdays.shorthand.forEach((day, index) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

const forEach = Array.prototype.forEach;

/**
 * @param {number} monthNumber The month number.
 * @param {boolean} shorthand `true` to use shorthand month.
 * @param {Locale} locale The Flatpickr locale data.
 * @returns {string} The month string.
 */
const monthToStr = (monthNumber, shorthand, locale) =>
  locale.months[shorthand ? 'shorthand' : 'longhand'][monthNumber];

/**
 * @param {object} config Plugin configuration.
 * @param {boolean} [config.shorthand] `true` to use shorthand month.
 * @param {string} config.selectorFlatpickrMonthYearContainer The CSS selector for the container of month/year selection UI.
 * @param {string} config.selectorFlatpickrYearContainer The CSS selector for the container of year selection UI.
 * @param {string} config.selectorFlatpickrCurrentMonth The CSS selector for the text-based month selection UI.
 * @param {string} config.classFlatpickrCurrentMonth The CSS class for the text-based month selection UI.
 * @returns {Plugin} A Flatpickr plugin to use text instead of `<select>` for month picker.
 */
const carbonFlatpickrMonthSelectPlugin = (config) => (fp) => {
  const setupElements = () => {
    if (!fp.monthElements) {
      return;
    }
    fp.monthElements.forEach((elem) => {
      if (!elem.parentNode) {
        return;
      }
      elem.parentNode.removeChild(elem);
    });
    fp.monthElements.splice(
      0,
      fp.monthElements.length,
      ...fp.monthElements.map(() => {
        // eslint-disable-next-line no-underscore-dangle
        const monthElement = fp._createElement(
          'span',
          config.classFlatpickrCurrentMonth
        );
        monthElement.textContent = monthToStr(
          fp.currentMonth,
          config.shorthand === true,
          fp.l10n
        );
        fp.yearElements[0]
          .closest(config.selectorFlatpickrMonthYearContainer)
          .insertBefore(
            monthElement,
            fp.yearElements[0].closest(config.selectorFlatpickrYearContainer)
          );
        return monthElement;
      })
    );
  };

  const updateCurrentMonth = () => {
    const monthStr = monthToStr(
      fp.currentMonth,
      config.shorthand === true,
      fp.l10n
    );
    fp.yearElements.forEach((elem) => {
      const currentMonthContainer = elem.closest(
        config.selectorFlatpickrMonthYearContainer
      );
      Array.prototype.forEach.call(
        currentMonthContainer.querySelectorAll('.cur-month'),
        (monthElement) => {
          monthElement.textContent = monthStr;
        }
      );
    });
  };

  const register = () => {
    fp.loadedPlugins.push('carbonFlatpickrMonthSelectPlugin');
  };

  return {
    onMonthChange: updateCurrentMonth,
    onValueUpdate: updateCurrentMonth,
    onOpen: updateCurrentMonth,
    onReady: [setupElements, updateCurrentMonth, register],
  };
};

export default class DatePicker extends Component {
  static propTypes = {
    /**
     * flatpickr prop passthrough. Allows the user to enter a date directly
     * into the input field
     */
    allowInput: PropTypes.bool,

    /**
     * The DOM element the Flatpicker should be inserted into. `<body>` by default.
     */
    appendTo: PropTypes.object,

    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * The date format.
     */
    dateFormat: PropTypes.string,

    /**
     * The type of the date picker:
     *
     * * `simple` - Without calendar dropdown.
     * * `single` - With calendar dropdown and single date.
     * * `range` - With calendar dropdown and a date range.
     */
    datePickerType: PropTypes.oneOf(['simple', 'single', 'range']),

    /**
     * The flatpickr `disable` option that allows a user to disable certain dates.
     */
    disable: PropTypes.array,

    /**
     * The flatpickr `enable` option that allows a user to enable certain dates.
     */
    enable: PropTypes.array,

    /**
     * `true` to use the light version.
     */
    light: PropTypes.bool,

    /**
     *  The language locale used to format the days of the week, months, and numbers. The full list of supported locales can be found here https://github.com/flatpickr/flatpickr/tree/master/src/l10n
     */
    locale: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.oneOf([
        'ar', // Arabic
        'at', // Austria
        'az', // Azerbaijan
        'be', // Belarusian
        'bg', // Bulgarian
        'bn', // Bangla
        'bs', // Bosnia
        'cat', // Catalan
        'cs', // Czech
        'cy', // Welsh
        'da', // Danish
        'de', // German
        'en', // English
        'eo', // Esperanto
        'es', // Spanish
        'et', // Estonian
        'fa', // Persian
        'fi', // Finnish
        'fo', // Faroese
        'fr', // French
        'ga', // Gaelic
        'gr', // Greek
        'he', // Hebrew
        'hi', // Hindi
        'hr', // Croatian
        'hu', // Hungarian
        'id', // Indonesian
        'is', // Icelandic
        'it', // Italian
        'ja', // Japanese
        'ka', // Georgian
        'km', // Khmer
        'ko', // Korean
        'kz', // Kazakh
        'lt', // Lithuanian
        'lv', // Latvian
        'mk', // Macedonian
        'mn', // Mongolian
        'ms', // Malaysian
        'my', // Burmese
        'nl', // Dutch
        'no', // Norwegian
        'pa', // Punjabi
        'pl', // Polish
        'pt', // Portuguese
        'ro', // Romanian
        'ru', // Russian
        'si', // Sinhala
        'sk', // Slovak
        'sl', // Slovenian
        'sq', // Albanian
        'sr', // Serbian
        'sv', // Swedish
        'th', // Thai
        'tr', // Turkish
        'uk', // Ukrainian
        'uz', // Uzbek
        'uz_latn', // Uzbek Latin
        'vn', // Vietnamese
        'zh_tw', // Mandarin Traditional
        'zh', // Mandarin
      ]),
    ]),

    /**
     * The maximum date that a user can pick to.
     */
    maxDate: PropTypes.string,

    /**
     * The minimum date that a user can start picking from.
     */
    minDate: PropTypes.string,

    /**
     * The `change` event handler.
     */
    onChange: PropTypes.func,

    /**
     * The `close` event handler.
     */
    onClose: PropTypes.func,

    /**
     * The `open` event handler.
     */
    onOpen: PropTypes.func,

    /**
     * `true` to use the short version.
     */
    short: PropTypes.bool,

    /**
     * The value of the date value provided to flatpickr, could
     * be a date, a date number, a date string, an array of dates.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.object,
        ])
      ),
      PropTypes.object,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    short: false,
    light: false,
    dateFormat: 'm/d/Y',
    locale: 'en',
  };

  componentDidMount() {
    const {
      allowInput,
      appendTo,
      datePickerType,
      dateFormat,
      locale,
      minDate,
      maxDate,
      value,
      onClose,
      disable,
      enable,
    } = this.props;
    if (datePickerType === 'single' || datePickerType === 'range') {
      const onHook = (electedDates, dateStr, instance) => {
        this.updateClassNames(instance);
      };

      // Logic to determine if `enable` or `disable` will be passed down. If neither
      // is provided, we return the default empty disabled array, allowing all dates.
      let enableOrDisable = enable ? 'enable' : 'disable';
      let enableOrDisableArr;
      if (!enable && !disable) {
        enableOrDisableArr = [];
      } else if (enable) {
        enableOrDisableArr = enable;
      } else {
        enableOrDisableArr = disable;
      }

      let localeData;
      if (typeof locale === 'object') {
        let location = locale.locale ? locale.locale : 'en';
        localeData = { ...l10n[location], ...locale };
      } else {
        localeData = l10n[locale];
      }

      // inputField ref might not be set in enzyme tests
      if (this.inputField) {
        this.cal = new flatpickr(this.inputField, {
          disableMobile: true,
          defaultDate: value,
          mode: datePickerType,
          allowInput: allowInput ?? true,
          dateFormat: dateFormat,
          locale: localeData,
          [enableOrDisable]: enableOrDisableArr,
          minDate: minDate,
          maxDate: maxDate,
          plugins: [
            datePickerType === 'range'
              ? new carbonFlatpickrRangePlugin({
                  input: this.toInputField,
                })
              : () => {},
            appendTo
              ? carbonFlatpickrAppendToPlugin({
                  appendTo,
                })
              : () => {},
            carbonFlatpickrMonthSelectPlugin({
              selectorFlatpickrMonthYearContainer: '.flatpickr-current-month',
              selectorFlatpickrYearContainer: '.numInputWrapper',
              selectorFlatpickrCurrentMonth: '.cur-month',
              classFlatpickrCurrentMonth: 'cur-month',
            }),
            carbonFlatpickrFixEventsPlugin({
              inputFrom: this.inputField,
              inputTo: this.toInputField,
            }),
          ],
          clickOpens: true,
          nextArrow: this.rightArrowHTML(),
          prevArrow: this.leftArrowHTML(),
          onChange: (...args) => {
            const { onChange } = this.props;
            if (onChange) {
              onChange(...args);
            }
          },
          onClose,
          onReady: onHook,
          onMonthChange: onHook,
          onYearChange: onHook,
          onOpen: (...args) => {
            const { onOpen } = this.props;
            onHook(...args);
            if (onOpen) {
              onOpen(...args);
            }
          },
          onValueUpdate: onHook,
        });
        this.addKeyboardEvents(this.cal);
        this.addRoleAttributeToDialog();
      }
    }
  }

  componentDidUpdate({
    dateFormat: prevDateFormat,
    minDate: prevMinDate,
    maxDate: prevMaxDate,
    value: prevValue,
    disable: prevDisable,
    enable: prevEnable,
  }) {
    const { dateFormat, minDate, maxDate, value, disable, enable } = this.props;
    if (this.cal) {
      if (prevDateFormat !== dateFormat) {
        this.cal.set({ dateFormat });
      }
      if (prevMinDate !== minDate) {
        this.cal.set('minDate', minDate);
      }
      if (prevMaxDate !== maxDate) {
        this.cal.set('maxDate', maxDate);
      }
      if (disable !== prevDisable) {
        this.cal.set('disable', disable);
      }
      if (enable !== prevEnable) {
        this.cal.set('enable', enable);
      }
    }

    // Coordinate when the given `value` prop changes. When this happens, we
    // should update the calendar to the new value.
    if (prevValue !== value) {
      if (this.cal) {
        this.cal.setDate(this.props.value);
        this.updateClassNames(this.cal);
      } else if (this.inputField) {
        this.inputField.value = this.props.value;
      }
    }
  }

  componentWillUnmount() {
    if (this.cal) {
      this.cal.destroy();
    }
    if (this.inputField) {
      this.inputField.removeEventListener('change', this.onChange);
    }
    if (this.toInputField) {
      this.toInputField.removeEventListener('change', this.onChange);
    }
  }

  onChange = () => {
    if (this.inputField.value === '' && this.cal?.selectedDates.length) {
      this.cal.clear();
      this.cal.input.focus();
    }
  };

  /**
   * Flatpickr's calendar dialog is not rendered in a landmark causing an
   * error with IBM Equal Access Accessibility Checker so we add an aria
   * role to the container div.
   */
  addRoleAttributeToDialog = () => {
    if (this.inputField) {
      this.cal.calendarContainer.setAttribute('role', 'region');
      // IBM EAAC requires an aria-label on a role='region'
      this.cal.calendarContainer.setAttribute(
        'aria-label',
        'calendar-container'
      );
    }
  };

  addKeyboardEvents = (cal) => {
    const initArrowDownListener = (element) => {
      if (element) {
        element.addEventListener('keydown', (e) => {
          if (match(e, keys.ArrowDown)) {
            const {
              calendarContainer,
              selectedDateElem: fpSelectedDateElem,
              todayDateElem: fptodayDateElem,
            } = cal;
            const selectedDateElem =
              calendarContainer.querySelector('.selected') &&
              fpSelectedDateElem;
            const todayDateElem =
              calendarContainer.querySelector('.today') && fptodayDateElem;
            (
              selectedDateElem ||
              todayDateElem ||
              calendarContainer.querySelector('.flatpickr-day[tabindex]') ||
              calendarContainer
            ).focus();
          }
        });
        element.addEventListener('change', this.onChange);
      }
    };
    initArrowDownListener(this.inputField);
    initArrowDownListener(this.toInputField);
  };

  rightArrowHTML() {
    return `
      <svg width="16px" height="16px" viewBox="0 0 16 16">
        <polygon points="11,8 6,13 5.3,12.3 9.6,8 5.3,3.7 6,3 "/>
        <rect width="16" height="16" style="fill:none" />
      </svg>`;
  }

  leftArrowHTML() {
    return `
      <svg width="16px" height="16px" viewBox="0 0 16 16">
        <polygon points="5,8 10,3 10.7,3.7 6.4,8 10.7,12.3 10,13 "/>
        <rect width="16" height="16" style="fill:none" />
      </svg>`;
  }

  openCalendar = () => {
    if (this.cal) {
      this.cal.open();
    }
  };

  updateClassNames = (calendar) => {
    const calendarContainer = calendar.calendarContainer;
    const daysContainer = calendar.days;
    if (calendarContainer && daysContainer) {
      // calendarContainer and daysContainer are undefined if flatpickr detects a mobile device
      calendarContainer.classList.add(`${prefix}--date-picker__calendar`);
      calendarContainer
        .querySelector('.flatpickr-month')
        .classList.add(`${prefix}--date-picker__month`);
      calendarContainer
        .querySelector('.flatpickr-weekdays')
        .classList.add(`${prefix}--date-picker__weekdays`);
      calendarContainer
        .querySelector('.flatpickr-days')
        .classList.add(`${prefix}--date-picker__days`);
      forEach.call(
        calendarContainer.querySelectorAll('.flatpickr-weekday'),
        (item) => {
          const currentItem = item;
          currentItem.innerHTML = currentItem.innerHTML.replace(/\s+/g, '');
          currentItem.classList.add(`${prefix}--date-picker__weekday`);
        }
      );
      forEach.call(daysContainer.querySelectorAll('.flatpickr-day'), (item) => {
        item.classList.add(`${prefix}--date-picker__day`);
        if (
          item.classList.contains('today') &&
          calendar.selectedDates.length > 0
        ) {
          item.classList.add('no-border');
        } else if (
          item.classList.contains('today') &&
          calendar.selectedDates.length === 0
        ) {
          item.classList.remove('no-border');
        }
      });
    }
  };

  assignInputFieldRef = (node) => {
    this.inputField = !node
      ? null
      : // Child is a regular DOM node, seen in tests
      node.nodeType === Node.ELEMENT_NODE
      ? node.querySelector(`.${prefix}--date-picker__input`)
      : // Child is a React component
      node.input && node.input.nodeType === Node.ELEMENT_NODE
      ? node.input
      : null;
  };

  assignToInputFieldRef = (node) => {
    this.toInputField = !node
      ? null
      : // Child is a regular DOM node, seen in tests
      node.nodeType === Node.ELEMENT_NODE
      ? node.querySelector(`.${prefix}--date-picker__input`)
      : // Child is a React component
      node.input && node.input.nodeType === Node.ELEMENT_NODE
      ? node.input
      : null;
  };

  isLabelTextEmpty = (children) =>
    children.every((child) => !child.props.labelText);

  render() {
    const {
      allowInput, // eslint-disable-line
      appendTo, // eslint-disable-line
      children,
      className,
      short,
      light,
      datePickerType,
      minDate, // eslint-disable-line
      maxDate, // eslint-disable-line
      dateFormat, // eslint-disable-line
      onChange, // eslint-disable-line
      locale, // eslint-disable-line
      value, // eslint-disable-line
      ...other
    } = this.props;

    const datePickerClasses = classNames(`${prefix}--date-picker`, className, {
      [`${prefix}--date-picker--short`]: short,
      [`${prefix}--date-picker--light`]: light,
      [`${prefix}--date-picker--simple`]: datePickerType === 'simple',
      [`${prefix}--date-picker--single`]: datePickerType === 'single',
      [`${prefix}--date-picker--range`]: datePickerType === 'range',
      [`${prefix}--date-picker--nolabel`]:
        datePickerType === 'range' && this.isLabelTextEmpty(children),
    });

    const childArray = React.Children.toArray(children);
    const childrenWithProps = childArray.map((child, index) => {
      if (
        index === 0 &&
        child.type === React.createElement(DatePickerInput, child.props).type
      ) {
        return React.cloneElement(child, {
          datePickerType,
          ref: this.assignInputFieldRef,
          openCalendar: this.openCalendar,
        });
      }
      if (
        index === 1 &&
        child.type === React.createElement(DatePickerInput, child.props).type
      ) {
        return React.cloneElement(child, {
          datePickerType,
          ref: this.assignToInputFieldRef,
          openCalendar: this.openCalendar,
        });
      }
      if (index === 0) {
        return React.cloneElement(child, {
          ref: this.assignInputFieldRef,
        });
      }
      if (index === 1) {
        return React.cloneElement(child, {
          ref: this.assignToInputFieldRef,
        });
      }
    });
    return (
      <div className={`${prefix}--form-item`}>
        <div className={datePickerClasses} {...other}>
          {childrenWithProps}
        </div>
      </div>
    );
  }
}
