/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './story.scss';
import {
  CaretDown32,
  CaretLeft32,
  CaretRight32,
  CaretUp32,
} from '@carbon/icons-react';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';
import React from 'react';
import { Popover, PopoverContent } from '../Popover';
import Button from '../Button';
import mdx from './Popover.mdx';
import { useOutsideClick } from '../../internal/useOutsideClick';

export default {
  title: 'Experimental/unstable_Popover',
  component: Popover,
  subcomponents: {
    PopoverContent,
  },
  decorators: [withKnobs],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  includeStories: ['Playground'],
};

export const Default = () => {
  function PopoverDemo() {
    const [align, setAlign] = React.useState('top');
    const [open, setOpen] = React.useState(true);
    const choices = [
      'top',
      'top-left',
      'top-right',

      'bottom',
      'bottom-left',
      'bottom-right',

      'left',
      'left-bottom',
      'left-top',

      'right',
      'right-bottom',
      'right-top',
    ];

    return (
      <>
        <section>
          <h2>Caret Position</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gridGap: 8,
            }}>
            {choices.map((choice) => {
              return (
                <label key={choice}>
                  <input
                    type="radio"
                    name="align"
                    value={choice}
                    checked={choice === align}
                    onChange={() => {
                      setAlign(choice);
                    }}
                  />
                  {choice}
                </label>
              );
            })}
          </div>
        </section>
        <section>
          <h2>Popover Visibility</h2>
          <div>
            <label>
              <input
                type="checkbox"
                value={open}
                checked={open}
                onChange={() => {
                  setOpen(!open);
                }}
              />
              Open
            </label>
          </div>
        </section>
        <div style={{ marginTop: '2rem' }}>
          <Popover open={open} align={align} relative>
            <PopoverContent className="p-3">Hello</PopoverContent>
          </Popover>
        </div>
      </>
    );
  }

  return <PopoverDemo />;
};

export const Playground = () => {
  const options = [
    'top',
    'top-left',
    'top-right',

    'bottom',
    'bottom-left',
    'bottom-right',

    'left',
    'left-bottom',
    'left-top',

    'right',
    'right-bottom',
    'right-top',
  ];

  return (
    <Popover
      align={select('Specify the caret alignment (align)', options, 'top')}
      caret={boolean(
        'Specify whether the caret should be visible (caret)',
        true
      )}
      highContrast={boolean(
        'Specify whether the high-contrast variant should render (highContrast)',
        false
      )}
      light={boolean(
        'Specify whether the light variant should render (light)',
        false
      )}
      open={boolean(
        'Specify whether the popover is open or closed (open)',
        true
      )}>
      <PopoverContent className="p-3">Sample content</PopoverContent>
    </Popover>
  );
};

Playground.story = {
  decorators: [
    (story) => (
      <div className="mt-9">
        <div className="position-relative">{story()}</div>
      </div>
    ),
  ],
};

export const Examples = () => {
  function Example({
    children,
    align,
    relative = false,
    icon,
    size,
    flip = false,
    ...rest
  }) {
    const ref = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    useOutsideClick(ref, () => {
      if (open === true) {
        setOpen(false);
      }
    });

    if (flip) {
      return (
        <div ref={ref} {...rest}>
          <Popover align={align} open={open} relative={relative}>
            <PopoverContent className="p-3">{children}</PopoverContent>
          </Popover>
          <Button
            iconDescription="Toggle"
            hasIconOnly
            onClick={() => {
              setOpen(!open);
            }}
            renderIcon={icon}
            size={size}
          />
        </div>
      );
    }

    return (
      <div ref={ref} {...rest}>
        <Button
          iconDescription="Toggle"
          hasIconOnly
          onClick={() => {
            setOpen(!open);
          }}
          renderIcon={icon}
          size={size}
        />
        <Popover align={align} open={open} relative={relative}>
          <PopoverContent className="p-3">{children}</PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <>
      <Example
        className="position-relative mb-3"
        icon={CaretDown32}
        align="bottom-left">
        This is some text
      </Example>

      <Example
        className="position-relative mb-3"
        icon={CaretDown32}
        align="bottom-left"
        size="sm">
        This is some text
      </Example>

      <Example
        className="flex justify-center position-relative mb-3"
        icon={CaretDown32}
        align="top">
        This is some text
      </Example>

      <Example
        className="flex justify-center position-relative mb-3"
        icon={CaretDown32}
        align="top"
        size="sm">
        This is some text
      </Example>

      <Example
        className="flex justify-end position-relative mb-3"
        icon={CaretDown32}
        align="bottom-right">
        This is some text
      </Example>

      <Example
        className="flex justify-end position-relative mb-3"
        icon={CaretDown32}
        align="bottom-right"
        size="sm">
        This is some text
      </Example>

      <Example
        className="position-relative mb-3"
        icon={CaretUp32}
        align="top-left">
        This is some text
      </Example>

      <Example
        className="position-relative mb-3"
        icon={CaretUp32}
        align="top-left"
        size="sm">
        This is some text
      </Example>

      <Example
        className="flex justify-center position-relative mb-3"
        icon={CaretUp32}
        align="top">
        This is some text
      </Example>

      <Example
        className="flex justify-center position-relative mb-3"
        icon={CaretUp32}
        align="top"
        size="sm">
        This is some text
      </Example>

      <Example
        className="flex justify-end position-relative mb-3"
        icon={CaretUp32}
        align="top-right">
        This is some text
      </Example>

      <Example
        className="flex justify-end position-relative mb-3"
        icon={CaretUp32}
        align="top-right"
        size="sm">
        This is some text
      </Example>

      <div className="grid grid-cols-3 mb-3">
        <div>
          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretRight32}
            align="right"
            relative>
            This is some text
          </Example>

          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretRight32}
            align="right"
            size="sm"
            relative>
            This is some text
          </Example>
        </div>

        <div>
          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretRight32}
            align="right-top"
            relative>
            This is some text
          </Example>

          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretRight32}
            align="right-top"
            size="sm"
            relative>
            This is some text
          </Example>
        </div>

        <div>
          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretRight32}
            align="right-bottom"
            relative>
            This is some text
          </Example>

          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretRight32}
            align="right-bottom"
            size="sm"
            relative>
            This is some text
          </Example>
        </div>
      </div>

      <div className="grid grid-cols-3 justify-items-end mb-3">
        <div>
          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretLeft32}
            align="left"
            relative
            flip>
            This is some text
          </Example>

          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretLeft32}
            align="left"
            size="sm"
            relative
            flip>
            This is some text
          </Example>
        </div>

        <div>
          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretLeft32}
            align="left-top"
            relative
            flip>
            This is some text
          </Example>

          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretLeft32}
            align="left-top"
            size="sm"
            relative
            flip>
            This is some text
          </Example>
        </div>

        <div>
          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretLeft32}
            align="left-bottom"
            relative
            flip>
            This is some text
          </Example>

          <Example
            className="position-relative flex align-center mb-3"
            icon={CaretLeft32}
            align="left-bottom"
            size="sm"
            relative
            flip>
            This is some text
          </Example>
        </div>
      </div>

      <Example
        className="position-relative mb-3"
        icon={CaretDown32}
        align="bottom-left">
        Consectetur et sit accusamus laboriosam pariatur. Asperiores eius
        expedita eligendi beatae vero commodi harum Illo hic accusamus fugit
        commodi cupiditate Explicabo distinctio quisquam culpa fugit eius
        Provident voluptatum ipsam quo.
      </Example>
    </>
  );
};
