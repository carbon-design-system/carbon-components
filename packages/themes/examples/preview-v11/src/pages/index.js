/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { colors, unstable_hoverColors } from '@carbon/colors';
import React from 'react';
import {
  themes,
  TokenFormat,
  group,
  set as tokenSet,
} from '../../../../src/next';

const tokens = group.getTokens();
const groups = group.getTokenGroups();
const properties = group.getTokenProperties();
const tokenSets = tokenSet.getTokenSets();

const colorsByValue = {};

function addColorByValue(value, name) {
  if (!colorsByValue[value]) {
    colorsByValue[value] = [];
  }
  colorsByValue[value].push(name);
}

function getColorByValue(value, swatchPreference) {
  if (!colorsByValue[value]) {
    return '—';
  }
  const names = colorsByValue[value];

  if (names.length === 1) {
    return names[0];
  }

  const match = names.find((name) => {
    return name.includes(swatchPreference);
  });
  if (match) {
    return match;
  }

  return names[0];
}

for (const [swatch, grades] of Object.entries(colors)) {
  for (const [grade, value] of Object.entries(grades)) {
    addColorByValue(
      value,
      TokenFormat.convert({
        name: `${swatch}-${grade}`,
        format: TokenFormat.formats.scss,
      })
    );
  }
}

for (const [swatch, grades] of Object.entries(unstable_hoverColors)) {
  if (typeof grades !== 'object') {
    addColorByValue(
      grades,
      TokenFormat.convert({
        name: swatch,
        format: TokenFormat.formats.scss,
      })
    );
    continue;
  }

  for (const [grade, value] of Object.entries(grades)) {
    addColorByValue(
      value,
      TokenFormat.convert({
        name: `${swatch}-${grade}`,
        format: TokenFormat.formats.scss,
      })
    );
  }
}

function getColorName(hex) {
  if (colorsByValue[hex]) {
    return colorsByValue[hex];
  }
  return '—';
}

export default function IndexPage() {
  const [activeGroup, setActiveGroup] = React.useState('All');
  const [activeProperty, setActiveProperty] = React.useState('All');
  const [activeSet, setActiveSet] = React.useState('All');

  return (
    <main>
      <section>
        <header className="flex items-center justify-between header">
          <h1 id="table-title">Tokens ({tokens.length})</h1>
          <ul className="grid grid-columns-4 gap">
            {activeGroup !== 'All' ||
            activeProperty !== 'All' ||
            activeSet !== 'All' ? (
              <li className="flex justify-end">
                <button
                  onClick={() => {
                    setActiveGroup('All');
                    setActiveProperty('All');
                    setActiveSet('All');
                  }}>
                  Reset
                </button>
              </li>
            ) : null}
            <li className="flex flex-col col-start-2">
              <label htmlFor="token-group">Token group</label>
              <select
                id="token-group"
                name="Token group"
                value={activeGroup}
                onChange={(event) => {
                  setActiveGroup(event.target.value);
                }}>
                {groups.map((group) => {
                  return <option key={group.name}>{group.name}</option>;
                })}
              </select>
            </li>
            <li className="flex flex-col">
              <label htmlFor="token-set">Token set</label>
              <select
                id="token-set"
                name="Token set"
                value={activeSet}
                onChange={(event) => {
                  setActiveSet(event.target.value);
                }}>
                {tokenSets.map((set) => {
                  return <option key={set.name}>{set.name}</option>;
                })}
              </select>
            </li>
            <li className="flex flex-col">
              <label htmlFor="property">Properties</label>
              <select
                id="property"
                name="Property"
                value={activeProperty}
                onChange={(event) => {
                  setActiveProperty(event.target.value);
                }}>
                <option>All</option>
                {properties.map((property) => {
                  return <option key={property}>{property}</option>;
                })}
              </select>
            </li>
          </ul>
        </header>
        <div className="content">
          <table aria-labelledby="table-title">
            <thead>
              <tr>
                <th>Token</th>
                <th>White</th>
                <th>g10</th>
                <th>g90</th>
                <th>g100</th>
                <th>Properties</th>
              </tr>
            </thead>
            <tbody>
              {tokens
                .filter((token) => {
                  const group = token.groups.find((group) => {
                    return group.name === activeGroup;
                  });

                  if (!group) {
                    return false;
                  }

                  if (
                    activeProperty !== 'All' &&
                    token.properties &&
                    !token.properties.includes(activeProperty)
                  ) {
                    return false;
                  }

                  if (activeSet !== 'All') {
                    const set = tokenSet.getTokenSet(activeSet);
                    if (!set.hasToken(token.name)) {
                      return false;
                    }
                  }

                  return true;
                })
                .map((token) => {
                  const exportName = TokenFormat.convert({
                    name: token.name,
                    format: TokenFormat.formats.js,
                  });
                  return (
                    <tr key={exportName} id={token.name}>
                      <td>
                        <a href={`#${token.name}`}>{token.name}</a>
                      </td>
                      <td>
                        <div className="theme-value">
                          <div
                            className="color-preview"
                            style={{
                              '--color-preview-color': themes.white[exportName],
                            }}
                          />
                          <div className="details">
                            <span>
                              {getColorByValue(
                                themes.white[exportName],
                                'white'
                              )}
                            </span>
                            <span className="hex-value">
                              {themes.white[exportName]}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="theme-value">
                          <div
                            className="color-preview"
                            style={{
                              '--color-preview-color': themes.g10[exportName],
                            }}
                          />
                          <div className="details">
                            <span>
                              {getColorByValue(themes.g10[exportName], 'gray')}
                            </span>
                            <span className="hex-value">
                              {themes.g10[exportName]}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="theme-value">
                          <div
                            className="color-preview"
                            style={{
                              '--color-preview-color': themes.g90[exportName],
                            }}
                          />
                          <div className="details">
                            <span>
                              {getColorByValue(themes.g90[exportName], 'gray')}
                            </span>
                            <span className="hex-value">
                              {themes.g90[exportName]}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="theme-value">
                          <div
                            className="color-preview"
                            style={{
                              '--color-preview-color': themes.g100[exportName],
                            }}
                          />
                          <div className="details">
                            <span>
                              {getColorByValue(themes.g90[exportName], 'gray')}
                            </span>
                            <span className="hex-value">
                              {themes.g100[exportName]}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {token.properties ? (
                          <ul>
                            {token.properties.map((property) => {
                              return <li key={property}>{property}</li>;
                            })}
                          </ul>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
