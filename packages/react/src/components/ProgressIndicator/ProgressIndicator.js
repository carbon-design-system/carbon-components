/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { settings } from 'carbon-components';
import {
  CheckmarkOutline,
  Warning,
  RadioButton,
  CircleFilled,
} from '@carbon/icons-react/next';
import { keys, matches } from '../../internal/keyboard';

const { prefix } = settings;

const defaultRenderLabel = (props) => <p {...props} />;

const defaultTranslations = {
  'carbon.progress-step.complete': 'Complete',
  'carbon.progress-step.incomplete': 'Incomplete',
  'carbon.progress-step.current': 'Current',
  'carbon.progress-step.invalid': 'Invalid',
};

function translateWithId(messageId) {
  return defaultTranslations[messageId];
}

export function ProgressStep({
  label,
  description,
  className,
  current,
  complete,
  invalid,
  secondaryLabel,
  disabled,
  onClick,
  renderLabel: ProgressStepLabel,
  translateWithId: t,
  ...rest
}) {
  const classes = classnames({
    [`${prefix}--progress-step`]: true,
    [`${prefix}--progress-step--current`]: current,
    [`${prefix}--progress-step--complete`]: complete,
    [`${prefix}--progress-step--incomplete`]: !complete && !current,
    [`${prefix}--progress-step--disabled`]: disabled,
    [className]: className,
  });

  const handleKeyDown = (e) => {
    if (matches(e, [keys.Enter, keys.Space])) {
      onClick();
    }
  };

  // eslint-disable-next-line react/prop-types
  const SVGIcon = ({ complete, current, description, invalid, prefix }) => {
    if (invalid) {
      return (
        <Warning className={`${prefix}--progress__warning`}>
          <title>{description}</title>
        </Warning>
      );
    }
    if (current) {
      return (
        <CircleFilled>
          <title>{description}</title>
        </CircleFilled>
      );
    }
    if (complete) {
      return (
        <CheckmarkOutline>
          <title>{description}</title>
        </CheckmarkOutline>
      );
    }
    return (
      <RadioButton>
        <title>{description}</title>
      </RadioButton>
    );
  };

  let message = t('carbon.progress-step.incomplete');

  if (current) {
    message = t('carbon.progress-step.current');
  }

  if (complete) {
    message = t('carbon.progress-step.complete');
  }

  if (invalid) {
    message = t('carbon.progress-step.invalid');
  }

  return (
    <li className={classes}>
      <button
        type="button"
        className={classnames(`${prefix}--progress-step-button`, {
          [`${prefix}--progress-step-button--unclickable`]: !onClick || current,
        })}
        disabled={disabled}
        aria-disabled={disabled}
        tabIndex={!current && onClick && !disabled ? 0 : -1}
        onClick={!current ? onClick : undefined}
        onKeyDown={handleKeyDown}
        title={label}
        {...rest}>
        <span className={`${prefix}--assistive-text`}>{message}</span>
        <SVGIcon
          complete={complete}
          current={current}
          description={description}
          invalid={invalid}
          prefix={prefix}
        />
        <ProgressStepLabel className={`${prefix}--progress-label`}>
          {label}
        </ProgressStepLabel>
        {secondaryLabel !== null && secondaryLabel !== undefined ? (
          <p className={`${prefix}--progress-optional`}>{secondaryLabel}</p>
        ) : null}
        <span className={`${prefix}--progress-line`} />
      </button>
    </li>
  );
}

ProgressStep.propTypes = {
  /**
   * Provide an optional className to be applied to the containing `<li>` node
   */
  className: PropTypes.string,

  /**
   * Specify whether the step has been completed
   */
  complete: PropTypes.bool,

  /**
   * Specify whether the step is the current step
   */
  current: PropTypes.bool,

  /**
   * Provide a description for the <ProgressStep>
   */
  description: PropTypes.string,

  /**
   * Specify whether the step is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Index of the current step within the ProgressIndicator
   */
  index: PropTypes.number,

  /**
   * Specify whether the step is invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the label for the <ProgressStep>
   */
  label: PropTypes.node.isRequired,

  /**
   * A callback called if the step is clicked or the enter key is pressed
   */
  onClick: PropTypes.func,

  /**
   * Provide the props that describe a progress step tooltip
   */
  overflowTooltipProps: PropTypes.object,

  /*
   * An optional parameter to allow for overflow content to be rendered in a
   * tooltip.
   */
  renderLabel: PropTypes.func,

  /**
   * Provide an optional secondary label
   */
  secondaryLabel: PropTypes.string,

  /**
   * The ID of the tooltip content.
   */
  tooltipId: PropTypes.string,

  /**
   * Optional method that takes in a message id and returns an
   * internationalized string.
   */
  translateWithId: PropTypes.func,
};

ProgressStep.defaultProps = {
  renderLabel: defaultRenderLabel,
  translateWithId,
};

export class ProgressIndicator extends Component {
  state = {};

  static propTypes = {
    /**
     * Provide <ProgressStep> components to be rendered in the
     * <ProgressIndicator>
     */
    children: PropTypes.node,

    /**
     * Provide an optional className to be applied to the containing node
     */
    className: PropTypes.string,

    /**
     * Optionally specify the current step array index
     */
    currentIndex: PropTypes.number,

    /**
     * Optional callback called if a ProgressStep is clicked on.  Returns the index of the step.
     */
    onChange: PropTypes.func,

    /**
     * Specify whether the progress steps should be split equally in size in the div
     */
    spaceEqually: PropTypes.bool,
    /**
     * Determines whether or not the ProgressIndicator should be rendered vertically.
     */
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    currentIndex: 0,
  };

  static getDerivedStateFromProps({ currentIndex }, state) {
    const { prevCurrentIndex } = state;
    return prevCurrentIndex === currentIndex
      ? null
      : {
          currentIndex,
          prevCurrentIndex: currentIndex,
        };
  }

  renderSteps = () => {
    const { onChange } = this.props;

    return React.Children.map(this.props.children, (child, index) => {
      // only setup click handlers if onChange event is passed
      const onClick = onChange ? () => onChange(index) : undefined;
      if (index === this.state.currentIndex) {
        return React.cloneElement(child, {
          current: true,
          index,
          onClick,
        });
      }
      if (index < this.state.currentIndex) {
        return React.cloneElement(child, {
          complete: true,
          index,
          onClick,
        });
      }
      if (index > this.state.currentIndex) {
        return React.cloneElement(child, {
          complete: child.props.complete || false,
          index,
          onClick,
        });
      }
      return null;
    });
  };

  render() {
    const {
      className,
      currentIndex, // eslint-disable-line no-unused-vars
      vertical,
      spaceEqually,
      ...other
    } = this.props;
    const classes = classnames({
      [`${prefix}--progress`]: true,
      [`${prefix}--progress--vertical`]: vertical,
      [`${prefix}--progress--space-equal`]: spaceEqually && !vertical,
      [className]: className,
    });
    return (
      <ul className={classes} {...other}>
        {this.renderSteps()}
      </ul>
    );
  }
}
