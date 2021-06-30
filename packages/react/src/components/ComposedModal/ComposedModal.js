/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import ButtonSet from '../ButtonSet';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { Close } from '@carbon/icons-react/next';
import toggleClass from '../../tools/toggleClass';
import requiredIfGivenPropIsTruthy from '../../prop-types/requiredIfGivenPropIsTruthy';
import wrapFocus from '../../internal/wrapFocus';

const { prefix } = settings;

export default class ComposedModal extends Component {
  state = {};

  static defaultProps = {
    onKeyDown: () => {},
    selectorPrimaryFocus: '[data-modal-primary-focus]',
  };

  outerModal = React.createRef();
  innerModal = React.createRef();
  button = React.createRef();
  startSentinel = React.createRef();
  endSentinel = React.createRef();

  static propTypes = {
    /**
     * Specify the aria-label for bx--modal-container
     */
    ['aria-label']: PropTypes.string,

    /**
     * Specify the aria-labelledby for bx--modal-container
     */
    ['aria-labelledby']: PropTypes.string,

    /**
     * Specify the content to be placed in the ComposedModal
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the modal root node
     */
    className: PropTypes.string,

    /**
     * Specify an optional className to be applied to the modal node
     */
    containerClassName: PropTypes.string,

    /**
     * Specify whether the primary button should be replaced with danger button.
     * Note that this prop is not applied if you render primary/danger button by yourself
     */
    danger: PropTypes.bool,

    /**
     * Specify an optional handler for closing modal.
     * Returning `false` here prevents closing modal.
     */
    onClose: PropTypes.func,

    /**
     * Specify an optional handler for the `onKeyDown` event. Called for all
     * `onKeyDown` events that do not close the modal
     */
    onKeyDown: PropTypes.func,

    /**
     * Specify whether the Modal is currently open
     */
    open: PropTypes.bool,

    preventCloseOnClickOutside: PropTypes.bool,

    /**
     * Specify a CSS selector that matches the DOM element that should be
     * focused when the Modal opens
     */
    selectorPrimaryFocus: PropTypes.string,

    /**
     * Specify the CSS selectors that match the floating menus
     */
    selectorsFloatingMenus: PropTypes.string,

    /**
     * Specify the size variant.
     */
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  };

  static getDerivedStateFromProps({ open }, state) {
    const { prevOpen } = state;
    return prevOpen === open
      ? null
      : {
          open,
          prevOpen: open,
        };
  }

  handleKeyDown = (evt) => {
    // Esc key
    if (evt.which === 27) {
      this.closeModal(evt);
    }

    this.props.onKeyDown(evt);
  };

  handleClick = (evt) => {
    if (
      !this.innerModal.current.contains(evt.target) &&
      this.props.preventCloseOnClickOutside
    ) {
      return;
    }
    if (
      this.innerModal.current &&
      !this.innerModal.current.contains(evt.target)
    ) {
      this.closeModal(evt);
    }
  };

  handleBlur = ({
    target: oldActiveNode,
    relatedTarget: currentActiveNode,
  }) => {
    const { open, selectorsFloatingMenus } = this.props;
    if (open && currentActiveNode && oldActiveNode) {
      const { current: bodyNode } = this.innerModal;
      const { current: startSentinelNode } = this.startSentinel;
      const { current: endSentinelNode } = this.endSentinel;
      wrapFocus({
        bodyNode,
        startSentinelNode,
        endSentinelNode,
        currentActiveNode,
        oldActiveNode,
        selectorsFloatingMenus,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.open && this.state.open) {
      this.beingOpen = true;
    } else if (prevState.open && !this.state.open) {
      this.beingOpen = false;
    }

    if (prevState.open !== this.state.open) {
      toggleClass(
        document.body,
        `${prefix}--body--with-modal-open`,
        this.state.open
      );
    }
  }

  focusButton = (focusContainerElement) => {
    if (focusContainerElement) {
      const primaryFocusElement = focusContainerElement.querySelector(
        this.props.selectorPrimaryFocus
      );
      if (primaryFocusElement) {
        primaryFocusElement.focus();
        return;
      }
      if (this.button.current) {
        this.button.current.focus();
      }
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
    if (this.innerModal.current) {
      this.focusButton(this.innerModal.current);
    }
  }

  handleTransitionEnd = (evt) => {
    if (
      this.outerModal.current.offsetWidth &&
      this.outerModal.current.offsetHeight &&
      this.beingOpen
    ) {
      this.focusButton(evt.currentTarget);
      this.beingOpen = false;
    }
  };

  closeModal = (evt) => {
    const { onClose } = this.props;
    if (!onClose || onClose(evt) !== false) {
      this.setState({
        open: false,
      });
    }
  };

  render() {
    const { open } = this.state;
    const {
      ['aria-labelledby']: ariaLabelledBy,
      ['aria-label']: ariaLabel,
      className,
      containerClassName,
      children,
      danger,
      preventCloseOnClickOutside, // eslint-disable-line
      selectorPrimaryFocus, // eslint-disable-line
      size,
      ...other
    } = this.props;

    const modalClass = classNames({
      [`${prefix}--modal`]: true,
      'is-visible': open,
      [className]: className,
      [`${prefix}--modal--danger`]: danger,
    });

    const containerClass = classNames({
      [`${prefix}--modal-container`]: true,
      [`${prefix}--modal-container--${size}`]: size,
      [containerClassName]: containerClassName,
    });

    // Generate aria-label based on Modal Header label if one is not provided (L253)
    let generatedAriaLabel;
    const childrenWithProps = React.Children.toArray(children).map((child) => {
      switch (child.type) {
        case React.createElement(ModalHeader).type:
          generatedAriaLabel = child.props.label;
          return React.cloneElement(child, {
            closeModal: this.closeModal,
          });
        case React.createElement(ModalFooter).type:
          return React.cloneElement(child, {
            closeModal: this.closeModal,
            inputref: this.button,
          });
        default:
          return child;
      }
    });

    return (
      <div
        {...other}
        role="presentation"
        ref={this.outerModal}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onTransitionEnd={open ? this.handleTransitionEnd : undefined}
        className={modalClass}>
        {/* Non-translatable: Focus-wrap code makes this `<span>` not actually read by screen readers */}
        <span
          ref={this.startSentinel}
          tabIndex="0"
          role="link"
          className={`${prefix}--visually-hidden`}>
          Focus sentinel
        </span>
        <div
          ref={this.innerModal}
          className={containerClass}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel ? ariaLabel : generatedAriaLabel}
          aria-labelledby={ariaLabelledBy}>
          {childrenWithProps}
        </div>
        {/* Non-translatable: Focus-wrap code makes this `<span>` not actually read by screen readers */}
        <span
          ref={this.endSentinel}
          tabIndex="0"
          role="link"
          className={`${prefix}--visually-hidden`}>
          Focus sentinel
        </span>
      </div>
    );
  }
}

export class ModalHeader extends Component {
  static propTypes = {
    /**
     * Provide an optional function to be called when the close button is
     * clicked
     */
    buttonOnClick: PropTypes.func,

    /**
     * Specify the content to be placed in the ModalHeader
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the modal header
     */
    className: PropTypes.string,

    /**
     * Specify an optional className to be applied to the modal close node
     */
    closeClassName: PropTypes.string,

    /**
     * Specify an optional className to be applied to the modal close icon node
     */
    closeIconClassName: PropTypes.string,

    /**
     * Provide an optional function to be called when the modal is closed
     */
    closeModal: PropTypes.func,

    /**
     * Specify a description for the close icon that can be read by screen
     * readers
     */
    iconDescription: PropTypes.string,

    /**
     * Specify an optional label to be displayed
     */
    label: PropTypes.node,

    /**
     * Specify an optional className to be applied to the modal header label
     */
    labelClassName: PropTypes.string,

    /**
     * Specify an optional title to be displayed
     */
    title: PropTypes.node,

    /**
     * Specify an optional className to be applied to the modal heading
     */
    titleClassName: PropTypes.string,
  };

  static defaultProps = {
    iconDescription: 'Close',
    buttonOnClick: () => {},
  };

  handleCloseButtonClick = (evt) => {
    this.props.closeModal(evt);
    this.props.buttonOnClick();
  };

  render() {
    const {
      className,
      labelClassName,
      titleClassName,
      closeClassName,
      closeIconClassName,
      label,
      title,
      children,
      iconDescription,
      closeModal, // eslint-disable-line
      buttonOnClick, // eslint-disable-line
      preventCloseOnClickOutside, // eslint-disable-line
      ...other
    } = this.props;

    const headerClass = classNames({
      [`${prefix}--modal-header`]: true,
      [className]: className,
    });

    const labelClass = classNames({
      [`${prefix}--modal-header__label ${prefix}--type-delta`]: true,
      [labelClassName]: labelClassName,
    });

    const titleClass = classNames({
      [`${prefix}--modal-header__heading ${prefix}--type-beta`]: true,
      [titleClassName]: titleClassName,
    });

    const closeClass = classNames({
      [`${prefix}--modal-close`]: true,
      [closeClassName]: closeClassName,
    });

    const closeIconClass = classNames({
      [`${prefix}--modal-close__icon`]: true,
      [closeIconClassName]: closeIconClassName,
    });

    return (
      <div className={headerClass} {...other}>
        {label && <h2 className={labelClass}>{label}</h2>}

        {title && <h3 className={titleClass}>{title}</h3>}

        {children}

        <button
          onClick={this.handleCloseButtonClick}
          className={closeClass}
          title={iconDescription}
          aria-label={iconDescription}
          type="button">
          <Close size={20} className={closeIconClass} />
        </button>
      </div>
    );
  }
}

export function ModalBody(props) {
  const {
    className,
    children,
    hasForm,
    hasScrollingContent,
    preventCloseOnClickOutside, // eslint-disable-line
    ...other
  } = props;
  const contentClass = classNames({
    [`${prefix}--modal-content`]: true,
    [`${prefix}--modal-content--with-form`]: hasForm,
    [`${prefix}--modal-scroll-content`]: hasScrollingContent,
    [className]: className,
  });
  const hasScrollingContentProps = hasScrollingContent
    ? {
        tabIndex: 0,
        role: 'region',
      }
    : {};
  return (
    <>
      <div className={contentClass} {...hasScrollingContentProps} {...other}>
        {children}
      </div>
      {hasScrollingContent && (
        <div className={`${prefix}--modal-content--overflow-indicator`} />
      )}
    </>
  );
}
ModalBody.propTypes = {
  /**
   * Required props for the accessibility label of the header
   */
  ['aria-label']: requiredIfGivenPropIsTruthy(
    'hasScrollingContent',
    PropTypes.string
  ),

  /**
   * Specify the content to be placed in the ModalBody
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be added to the Modal Body node
   */
  className: PropTypes.string,

  /**
   * Provide whether the modal content has a form element.
   * If `true` is used here, non-form child content should have `bx--modal-content__regular-content` class.
   */
  hasForm: PropTypes.bool,

  /**
   * Specify whether the modal contains scrolling content
   */
  hasScrollingContent: PropTypes.bool,
};

export class ModalFooter extends Component {
  static propTypes = {
    /**
     * Pass in content that will be rendered in the Modal Footer
     */
    children: PropTypes.node,

    /**
     * Specify a custom className to be applied to the Modal Footer container
     */
    className: PropTypes.string,

    /**
     * Specify an optional function that is called whenever the modal is closed
     */
    closeModal: PropTypes.func,

    /**
     * Specify whether the primary button should be replaced with danger button.
     * Note that this prop is not applied if you render primary/danger button by yourself
     */
    danger: PropTypes.bool,

    /**
     * The `ref` callback for the primary button.
     */
    inputref: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        current: PropTypes.any,
      }),
    ]),

    /**
     * Specify an optional function for when the modal is requesting to be
     * closed
     */
    onRequestClose: PropTypes.func,

    /**
     * Specify an optional function for when the modal is requesting to be
     * submitted
     */
    onRequestSubmit: PropTypes.func,

    /**
     * Specify whether the primary button should be disabled
     */
    primaryButtonDisabled: PropTypes.bool,

    /**
     * Specify the text for the primary button
     */
    primaryButtonText: PropTypes.string,

    /**
     * Specify a custom className to be applied to the primary button
     */
    primaryClassName: PropTypes.string,

    /**
     * Specify the text for the secondary button
     */
    secondaryButtonText: PropTypes.string,

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
     * Specify a custom className to be applied to the secondary button
     */
    secondaryClassName: PropTypes.string,
  };

  static defaultProps = {
    onRequestClose: () => {},
    onRequestSubmit: () => {},
  };

  handleRequestClose = (evt) => {
    this.props.closeModal(evt);
    this.props.onRequestClose(evt);
  };

  render() {
    const {
      className,
      primaryClassName,
      secondaryButtons,
      secondaryClassName,
      secondaryButtonText,
      primaryButtonText,
      primaryButtonDisabled,
      closeModal, // eslint-disable-line
      onRequestClose, // eslint-disable-line
      onRequestSubmit, // eslint-disable-line
      children,
      danger,
      inputref,
      ...other
    } = this.props;

    const footerClass = classNames({
      [`${prefix}--modal-footer`]: true,
      [className]: className,
      [`${prefix}--modal-footer--three-button`]:
        Array.isArray(secondaryButtons) && secondaryButtons.length === 2,
    });

    const primaryClass = classNames({
      [primaryClassName]: primaryClassName,
    });

    const secondaryClass = classNames({
      [secondaryClassName]: secondaryClassName,
    });

    const SecondaryButtonSet = () => {
      if (Array.isArray(secondaryButtons) && secondaryButtons.length <= 2) {
        return secondaryButtons.map(
          ({ buttonText, onClick: onButtonClick }, i) => (
            <Button
              key={`${buttonText}-${i}`}
              className={secondaryClass}
              kind="secondary"
              onClick={onButtonClick || this.handleRequestClose}>
              {buttonText}
            </Button>
          )
        );
      }
      if (secondaryButtonText) {
        return (
          <Button
            className={secondaryClass}
            onClick={this.handleRequestClose}
            kind="secondary">
            {secondaryButtonText}
          </Button>
        );
      }
      return null;
    };

    return (
      <ButtonSet className={footerClass} {...other}>
        <SecondaryButtonSet />
        {primaryButtonText && (
          <Button
            onClick={onRequestSubmit}
            className={primaryClass}
            disabled={primaryButtonDisabled}
            kind={danger ? 'danger' : 'primary'}
            ref={inputref}>
            {primaryButtonText}
          </Button>
        )}

        {children}
      </ButtonSet>
    );
  }
}
