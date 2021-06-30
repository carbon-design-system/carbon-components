/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Tooltip, Button } from 'carbon-components-react';
import { OverflowMenuVertical16 } from '@carbon/icons-react';
import React from 'react';
import { settings } from 'carbon-components';

export default { title: 'Components/Tooltip' };

const { prefix } = settings;

const containerStyles = {
  height: 'calc(100vh - 6rem)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const WithIcon = () => {
  return (
    <div style={containerStyles}>
      <Tooltip
        align="center"
        direction="bottom"
        triggerText="Tooltip label"
        tabIndex="0"
        selectorPrimaryFocus="">
        <p>
          This is some tooltip text. This box shows the maximum amount of text
          that should appear inside. If more room is needed please use a modal
          instead.
        </p>
        <div className={`${prefix}--tooltip__footer`}>
          <a href="/" className={`${prefix}--link`}>
            Learn More
          </a>
          <Button size="small">Create</Button>
        </div>
      </Tooltip>
    </div>
  );
};

export const WithoutIcon = () => {
  return (
    <div style={containerStyles}>
      <Tooltip
        showIcon={false}
        align="center"
        direction="bottom"
        triggerText="Tooltip label"
        tabIndex="0"
        selectorPrimaryFocus="">
        <p>
          This is some tooltip text. This box shows the maximum amount of text
          that should appear inside. If more room is needed please use a modal
          instead.
        </p>
        <div className={`${prefix}--tooltip__footer`}>
          <a href="/" className={`${prefix}--link`}>
            Learn More
          </a>
          <Button size="small">Create</Button>
        </div>
      </Tooltip>
    </div>
  );
};

export const CustomIcon = () => {
  return (
    <div style={containerStyles}>
      <Tooltip
        showIcon={true}
        align="center"
        direction="bottom"
        triggerText="Tooltip label"
        tabIndex="0"
        selectorPrimaryFocus=""
        renderIcon={() => (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path d="M8.5 11V6.5h-2v1h1V11H6v1h4v-1zM8 3.5c-.4 0-.8.3-.8.8s.4.7.8.7.8-.3.8-.8-.4-.7-.8-.7z" />
            <path d="M8 15c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7zM8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
            <path fill="none" d="M0 0h16v16H0z" />
          </svg>
        )}>
        <p>
          This is some tooltip text. This box shows the maximum amount of text
          that should appear inside. If more room is needed please use a modal
          instead.
        </p>
        <div className={`${prefix}--tooltip__footer`}>
          <a href="/" className={`${prefix}--link`}>
            Learn More
          </a>
          <Button size="small">Create</Button>
        </div>
      </Tooltip>
    </div>
  );
};

export const CustomIconOnly = () => {
  return (
    <div style={containerStyles}>
      <Tooltip
        showIcon={true}
        align="center"
        direction="bottom"
        iconDescription="Helpful information"
        tabIndex="0"
        selectorPrimaryFocus=""
        renderIcon={OverflowMenuVertical16}>
        <p>
          This is some tooltip text. This box shows the maximum amount of text
          that should appear inside. If more room is needed please use a modal
          instead.
        </p>
        <div className={`${prefix}--tooltip__footer`}>
          <a href="/" className={`${prefix}--link`}>
            Learn More
          </a>
          <Button size="small">Create</Button>
        </div>
      </Tooltip>
    </div>
  );
};
