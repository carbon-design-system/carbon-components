/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Link, { LinkPropTypes } from './Link';
import SideNavIcon from './SideNavIcon';
import SideNavItem from './SideNavItem';
import SideNavLinkText from './SideNavLinkText';

const { prefix } = settings;

const SideNavLink = React.forwardRef(function SideNavLink(
  {
    className: customClassName,
    children,
    renderIcon: IconElement,
    isActive,
    large,
    ...rest
  },
  ref
) {
  const className = cx({
    [`${prefix}--side-nav__link`]: true,
    [`${prefix}--side-nav__link--current`]: isActive,
    [customClassName]: !!customClassName,
  });

  return (
    <SideNavItem large={large}>
      <Link {...rest} className={className} ref={ref}>
        {IconElement && (
          <SideNavIcon small>
            <IconElement />
          </SideNavIcon>
        )}
        <SideNavLinkText>{children}</SideNavLinkText>
      </Link>
    </SideNavItem>
  );
});

SideNavLink.propTypes = {
  ...LinkPropTypes,

  /**
   * Specify the text content for the link
   */
  children: PropTypes.node.isRequired,

  /**
   * Provide an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Property to indicate if the side nav container is open (or not). Use to
   * keep local state and styling in step with the SideNav expansion state.
   */
  isSideNavExpanded: PropTypes.bool,

  /**
   * Specify if this is a large variation of the SideNavLink
   */
  large: PropTypes.bool,

  /**
   * Provide an icon to render in the side navigation link. Should be a React class.
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

SideNavLink.defaultProps = {
  element: 'a',
  large: false,
};

// eslint-disable-next-line react/display-name
export const createCustomSideNavLink = (element) => (props) => {
  return <SideNavLink element={element} {...props} />;
};

export default SideNavLink;
