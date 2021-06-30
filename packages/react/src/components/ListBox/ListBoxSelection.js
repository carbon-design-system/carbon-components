/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '@carbon/icons-react/next';
import { settings } from 'carbon-components';
import { match, keys } from '../../internal/keyboard';

const { prefix } = settings;

/**
 * `ListBoxSelection` is used to provide controls for clearing a selection, in
 * addition to conditionally rendering a badge if the control has more than one
 * selection.
 */
const ListBoxSelection = ({
  clearSelection,
  selectionCount,
  translateWithId: t,
  disabled,
  onClearSelection,
}) => {
  const className = cx(`${prefix}--list-box__selection`, {
    [`${prefix}--tag--filter`]: selectionCount,
    [`${prefix}--list-box__selection--multi`]: selectionCount,
  });
  const handleOnClick = (event) => {
    event.stopPropagation();
    if (disabled) {
      return;
    }
    clearSelection(event);
    if (onClearSelection) {
      onClearSelection(event);
    }
  };
  const handleOnKeyDown = (event) => {
    event.stopPropagation();
    if (disabled) {
      return;
    }

    // When a user hits ENTER, we'll clear the selection
    if (match(event, keys.Enter)) {
      clearSelection(event);
      if (onClearSelection) {
        onClearSelection(event);
      }
    }
  };
  const description = selectionCount ? t('clear.all') : t('clear.selection');
  const tagClasses = cx(
    `${prefix}--tag`,
    `${prefix}--tag--filter`,
    `${prefix}--tag--high-contrast`,
    {
      [`${prefix}--tag--disabled`]: disabled,
    }
  );
  return selectionCount ? (
    <div className={tagClasses}>
      <span className={`${prefix}--tag__label`} title={selectionCount}>
        {selectionCount}
      </span>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`${prefix}--tag__close-icon`}
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
        disabled={disabled}
        aria-label={t('clear.all')}
        aria-hidden={true}
        title={description}>
        <Close />
      </div>
    </div>
  ) : (
    <div
      role="button"
      className={className}
      tabIndex={disabled ? -1 : 0}
      onClick={handleOnClick}
      onKeyDown={handleOnKeyDown}
      aria-label={description}
      aria-hidden={true}
      title={description}>
      {selectionCount}
      <Close />
    </div>
  );
};

export const translationIds = {
  'clear.all': 'clear.all',
  'clear.selection': 'clear.selection',
};

const defaultTranslations = {
  [translationIds['clear.all']]: 'Clear all selected items',
  [translationIds['clear.selection']]: 'Clear selected item',
};

ListBoxSelection.propTypes = {
  /**
   * Specify a function to be invoked when a user interacts with the clear
   * selection element.
   */
  clearSelection: PropTypes.func.isRequired,

  /**
   * Specify whether or not the clear selection element should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify an optional `onClearSelection` handler that is called when the underlying
   * element is cleared
   */
  onClearSelection: PropTypes.func,

  /**
   * Specify an optional `onClick` handler that is called when the underlying
   * clear selection element is clicked
   */
  onClick: PropTypes.func,

  /**
   * Specify an optional `onKeyDown` handler that is called when the underlying
   * clear selection element fires a keydown event
   */
  onKeyDown: PropTypes.func,

  /**
   * Specify an optional `selectionCount` value that will be used to determine
   * whether the selection should display a badge or a single clear icon.
   */
  selectionCount: PropTypes.number,

  /**
   * i18n hook used to provide the appropriate description for the given menu
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: PropTypes.func.isRequired,
};

ListBoxSelection.defaultProps = {
  translateWithId: (id) => defaultTranslations[id],
};

export default ListBoxSelection;
