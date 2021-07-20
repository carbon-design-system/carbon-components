/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './Theme-story.scss';
import React from 'react';
import { Theme, useTheme } from '../Theme';
import mdx from './Theme.mdx';

export default {
  title: 'Components/Theme',
  component: Theme,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    as: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
    theme: {
      defaultValue: 'g10',
    },
  },
};

export const Default = () => {
  return (
    <>
      <Theme theme="g100">
        <section className="theme-section">
          <p>g100 theme</p>
        </section>
      </Theme>
      <Theme theme="g90">
        <section className="theme-section">
          <p>g90 theme</p>
        </section>
      </Theme>
      <Theme theme="g10">
        <section className="theme-section">
          <p>g10 theme</p>
        </section>
      </Theme>
      <Theme theme="white">
        <section className="theme-section">
          <p>white theme</p>
        </section>
      </Theme>
    </>
  );
};

export const UseTheme = () => {
  function Example() {
    const { theme } = useTheme();
    return <div className="theme-section">The current theme is: {theme}</div>;
  }

  return (
    <div>
      <Example />
      <Theme theme="g100">
        <Example />
      </Theme>
    </div>
  );
};

UseTheme.storyName = 'useTheme';

const PlaygroundStory = (args) => {
  return (
    <Theme {...args}>
      <section className="theme-section">
        <p>{args.theme} theme</p>
      </section>
    </Theme>
  );
};

export const Playground = PlaygroundStory.bind({});
