/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { Close20 } from '@carbon/icons-react';
import toggleClass from '../../tools/toggleClass';
import Button from '../Button';
import ButtonSet from '../ButtonSet';
import deprecate from '../../prop-types/deprecate';
import requiredIfGivenPropIsTruthy from '../../prop-types/requiredIfGivenPropIsTruthy';
import wrapFocus, {
  elementOrParentIsFloatingMenu,
} from '../../internal/wrapFocus';
import setupGetInstanceId from '../../tools/setupGetInstanceId';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();

export default class Modal extends Component {
  static propTypes = {
    /**
     * Specify whether the Modal is displaying an alert, error or warning
     * Should go hand in hand with the danger prop.
     */
    alert: PropTypes.bool,

    /**
     * Required props for the accessibility label of the header
     */
    ['aria-label']: requiredIfGivenPropIsTruthy(
      'hasScrollingContent',
      PropTypes.string
    ),

    /**
     * Provide the contents of your Modal
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the modal root node
     */
    className: PropTypes.string,

    /**
     * Specify whether the Modal is for dangerous actions
     */
    danger: PropTypes.bool,

    /**
     * Deprecated; Used for advanced focus-wrapping feature using 3rd party library,
     * but it's now achieved without a 3rd party library.
     */
    focusTrap: deprecate(
      PropTypes.bool,
      `\nThe prop \`focusTrap\` for Modal has been deprecated, as the feature of \`focusTrap\` runs by default.`
    ),

    /**
     * Deprecated: Used to determine whether the modal content has a form element to adjust spacing,
     * but now spacing styles account for all types of elements
     */
    hasForm: deprecate(
      PropTypes.bool,
      `\nThe prop \`hasForm\` for Modal has been deprecated, as the feature of \`hasForm\` runs by default.`
    ),

    /**
     * Specify whether the modal contains scrolling content
     */
    hasScrollingContent: PropTypes.bool,

    /**
     * Provide a description for "close" icon that can be read by screen readers
     */
    iconDescription: PropTypes.string,

    /**
     * Specify the DOM element ID of the top-level node.
     */
    id: PropTypes.string,

    /**
     * Specify a label to be read by screen readers on the modal root node
     */
    modalAriaLabel: PropTypes.string,

    /**
     * Specify the content of the modal header title.
     */
    modalHeading: PropTypes.node,

    /**
     * Specify the content of the modal header label.
     */
    modalLabel: PropTypes.node,

    /**
     * Specify a handler for keypresses.
     */
    onKeyDown: PropTypes.func,

    /**
     * Specify a handler for closing modal.
     * The handler should care of closing modal, e.g. changing `open` prop.
     */
    onRequestClose: PropTypes.func,

    /**
     * Specify a handler for "submitting" modal.
     * The handler should care of closing modal, e.g. changing `open` prop, if necessary.
     */
    onRequestSubmit: PropTypes.func,

    /**
     * Specify a handler for the secondary button.
     * Useful if separate handler from `onRequestClose` is desirable
     */
    onSecondarySubmit: PropTypes.func,

    /**
     * Specify whether the Modal is currently open
     */
    open: PropTypes.bool,

    /**
     * Specify whether the modal should be button-less
     */
    passiveModal: PropTypes.bool,

    /**
     * Prevent closing on click outside of modal
     */
    preventCloseOnClickOutside: PropTypes.bool,

    /**
     * Specify whether the Button should be disabled, or not
     */
    primaryButtonDisabled: PropTypes.bool,

    /**
     * Specify the text for the primary button
     */
    primaryButtonText: PropTypes.node,

    /**
     * Specify the text for the secondary button
     */
    secondaryButtonText: PropTypes.node,

    /**
     * Specify an array of config objects for secondary buttons
     * (`Array<{
     *   buttonText: string,
     *   onClick: function,
     * }>`).
     */
    secondaryButtons: (props, propName, componentName) => {
      if (props.secondaryButtons) {
        if (
          !Array.isArray(props.secondaryButtons) ||
          props.secondaryButtons.length !== 2
        ) {
          return new Error(
            `${propName} needs to be an array of two button config objects`
          );
        }

        const shape = {
          buttonText: PropTypes.node,
          onClick: PropTypes.func,
        };

        props[propName].forEach((secondaryButton) => {
          PropTypes.checkPropTypes(
            shape,
            secondaryButton,
            propName,
            componentName
          );
        });
      }

      return null;
    },

    /**
     * Specify a CSS selector that matches the DOM element that should
     * be focused when the Modal opens
     */
    selectorPrimaryFocus: PropTypes.string,

    /**
     * Specify CSS selectors that match DOM elements working as floating menus.
     * Focusing on those elements won't trigger "focus-wrap" behavior
     */
    selectorsFloatingMenus: PropTypes.arrayOf(PropTypes.string),

    /**
     * Specify if Enter key should be used as "submit" action
     */
    shouldSubmitOnEnter: PropTypes.bool,

    /**
     * Specify the size variant.
     */
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  };

  static defaultProps = {
    onRequestClose: () => {},
    onRequestSubmit: () => {},
    primaryButtonDisabled: false,
    onKeyDown: () => {},
    passiveModal: false,
    iconDescription: 'Close',
    modalHeading: '',
    modalLabel: '',
    preventCloseOnClickOutside: false,
    selectorPrimaryFocus: '[data-modal-primary-focus]',
    hasScrollingContent: false,
  };

  button = React.createRef();
  outerModal = React.createRef();
  innerModal = React.createRef();
  startTrap = React.createRef();
  endTrap = React.createRef();
  modalInstanceId = `modal-${getInstanceId()}`;
  modalLabelId = `${prefix}--modal-header__label--${this.modalInstanceId}`;
  modalHeadingId = `${prefix}--modal-header__heading--${this.modalInstanceId}`;
  modalBodyId = `${prefix}--modal-body--${this.modalInstanceId}`;

  handleKeyDown = (evt) => {
    if (this.props.open) {
      if (evt.which === 27) {
        this.props.onRequestClose(evt);
      }
      if (evt.which === 13 && this.props.shouldSubmitOnEnter) {
        this.props.onRequestSubmit(evt);
      }
    }
  };

  handleMousedown = (evt) => {
    if (
      this.innerModal.current &&
      !this.innerModal.current.contains(evt.target) &&
      !elementOrParentIsFloatingMenu(
        evt.target,
        this.props.selectorsFloatingMenus
      ) &&
      !this.props.preventCloseOnClickOutside
    ) {
      this.props.onRequestClose(evt);
    }
  };

  handleBlur = ({
    target: oldActiveNode,
    relatedTarget: currentActiveNode,
  }) => {
    const { open, selectorsFloatingMenus } = this.props;
    if (open && currentActiveNode && oldActiveNode) {
      const { current: bodyNode } = this.innerModal;
      const { current: startTrapNode } = this.startTrap;
      const { current: endTrapNode } = this.endTrap;
      wrapFocus({
        bodyNode,
        startTrapNode,
        endTrapNode,
        currentActiveNode,
        oldActiveNode,
        selectorsFloatingMenus,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.beingOpen = true;
    } else if (prevProps.open && !this.props.open) {
      this.beingOpen = false;
    }
    toggleClass(
      document.body,
      `${prefix}--body--with-modal-open`,
      this.props.open
    );
  }

  initialFocus = (focusContainerElement) => {
    const containerElement = focusContainerElement || this.innerModal.current;
    const primaryFocusElement = containerElement
      ? containerElement.querySelector(this.props.selectorPrimaryFocus)
      : null;

    if (primaryFocusElement) {
      return primaryFocusElement;
    }

    return this.button && this.button.current;
  };

  focusButton = (focusContainerElement) => {
    const target = this.initialFocus(focusContainerElement);
    if (target) {
      target.focus();
    }
  };

  componentWillUnmount() {
    toggleClass(document.body, `${prefix}--body--with-modal-open`, false);
  }

  componentDidMount() {
    toggleClass(
      document.body,
      `${prefix}--body--with-modal-open`,
      this.props.open
    );
    if (!this.props.open) {
      return;
    }
    this.focusButton(this.innerModal.current);
  }

  handleTransitionEnd = (evt) => {
    if (
      evt.target === evt.currentTarget && // Not to handle `onTransitionEnd` on child DOM nodes
      this.outerModal.current &&
      this.outerModal.current.offsetWidth &&
      this.outerModal.current.offsetHeight &&
      this.beingOpen
    ) {
      this.focusButton(evt.currentTarget);
      this.beingOpen = false;
    }
  };

  render() {
    const {
      modalHeading,
      modalLabel,
      modalAriaLabel,
      passiveModal,
      hasForm,
      secondaryButtonText,
      primaryButtonText,
      open,
      onRequestClose,
      onRequestSubmit,
      onSecondarySubmit,
      iconDescription,
      primaryButtonDisabled,
      danger,
      alert,
      secondaryButtons,
      selectorPrimaryFocus, // eslint-disable-line
      selectorsFloatingMenus, // eslint-disable-line
      shouldSubmitOnEnter, // eslint-disable-line
      size,
      hasScrollingContent,
      preventCloseOnClickOutside, // eslint-disable-line
      ...other
    } = this.props;

    const onSecondaryButtonClick = onSecondarySubmit
      ? onSecondarySubmit
      : onRequestClose;

    const modalClasses = classNames({
      [`${prefix}--modal`]: true,
      [`${prefix}--modal-tall`]: !passiveModal,
      'is-visible': open,
      [`${prefix}--modal--danger`]: this.props.danger,
      [this.props.className]: this.props.className,
    });

    const containerClasses = classNames(`${prefix}--modal-container`, {
      [`${prefix}--modal-container--${size}`]: size,
    });

    const contentClasses = classNames(`${prefix}--modal-content`, {
      [`${prefix}--modal-content--with-form`]: hasForm, //TO-DO: delete this line in v11 since hasForm is deprecated
      [`${prefix}--modal-scroll-content`]: hasScrollingContent,
    });

    const footerClasses = classNames(`${prefix}--modal-footer`, {
      [`${prefix}--modal-footer--three-button`]:
        Array.isArray(secondaryButtons) && secondaryButtons.length === 2,
    });

    const modalButton = (
      <button
        className={`${prefix}--modal-close`}
        type="button"
        onClick={onRequestClose}
        title={iconDescription}
        aria-label={iconDescription}
        ref={this.button}>
        <Close20
          aria-label={iconDescription}
          className={`${prefix}--modal-close__icon`}
        />
      </button>
    );

    const ariaLabel =
      modalLabel || this.props['aria-label'] || modalAriaLabel || modalHeading;
    const getAriaLabelledBy = modalLabel
      ? this.modalLabelId
      : this.modalHeadingId;

    const hasScrollingContentProps = hasScrollingContent
      ? {
          tabIndex: 0,
          role: 'region',
          'aria-label': ariaLabel,
          'aria-labelledby': getAriaLabelledBy,
        }
      : {};

    const alertDialogProps = {};
    if (alert && passiveModal) {
      alertDialogProps.role = 'alert';
    }
    if (alert && !passiveModal) {
      alertDialogProps.role = 'alertdialog';
      alertDialogProps['aria-describedby'] = this.modalBodyId;
    }

    const SecondaryButtonSet = () => {
      if (Array.isArray(secondaryButtons) && secondaryButtons.length <= 2) {
        return secondaryButtons.map(
          ({ buttonText, onClick: onButtonClick }, i) => (
            <Button
              key={`${buttonText}-${i}`}
              kind="secondary"
              onClick={onButtonClick}>
              {buttonText}
            </Button>
          )
        );
      }
      if (secondaryButtonText) {
        return (
          <Button kind="secondary" onClick={onSecondaryButtonClick}>
            {secondaryButtonText}
          </Button>
        );
      }
      return null;
    };

    const modalBody = (
      <div
        ref={this.innerModal}
        role="dialog"
        {...alertDialogProps}
        className={containerClasses}
        aria-label={ariaLabel}
        aria-modal="true"
        tabIndex="-1">
        <div className={`${prefix}--modal-header`}>
          {passiveModal && modalButton}
          {modalLabel && (
            <h2
              id={this.modalLabelId}
              className={`${prefix}--modal-header__label`}>
              {modalLabel}
            </h2>
          )}
          <h3
            id={this.modalHeadingId}
            className={`${prefix}--modal-header__heading`}>
            {modalHeading}
          </h3>
          {!passiveModal && modalButton}
        </div>
        <div
          id={this.modalBodyId}
          className={contentClasses}
          {...hasScrollingContentProps}
          aria-labelledby={getAriaLabelledBy}>
          {this.props.children}
        </div>
        {hasScrollingContent && (
          <div className={`${prefix}--modal-content--overflow-indicator`} />
        )}
        {!passiveModal && (
          <ButtonSet className={footerClasses}>
            <SecondaryButtonSet />
            <Button
              kind={danger ? 'danger' : 'primary'}
              disabled={primaryButtonDisabled}
              onClick={onRequestSubmit}
              ref={this.button}>
              {primaryButtonText}
            </Button>
          </ButtonSet>
        )}
      </div>
    );

    return (
      <div
        {...other}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleMousedown}
        onBlur={this.handleBlur}
        className={modalClasses}
        role="presentation"
        onTransitionEnd={this.props.open ? this.handleTransitionEnd : undefined}
        ref={this.outerModal}>
        {/* Non-translatable: Focus-wrap code makes this `<span>` not actually read by screen readers */}
        <span
          ref={this.startTrap}
          tabIndex="0"
          role="link"
          className={`${prefix}--visually-hidden`}>
          Focus sentinel
        </span>
        {modalBody}
        {/* Non-translatable: Focus-wrap code makes this `<span>` not actually read by screen readers */}
        <span
          ref={this.endTrap}
          tabIndex="0"
          role="link"
          className={`${prefix}--visually-hidden`}>
          Focus sentinel
        </span>
      </div>
    );
  }
}
