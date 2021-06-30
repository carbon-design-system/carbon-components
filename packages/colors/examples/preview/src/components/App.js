import React from 'react';
import { colors, unstable_hoverColors } from '@carbon/colors';

function getHoverColor(swatch, grade) {
  for (const [key, value] of Object.entries(unstable_hoverColors)) {
    if (!key.includes(swatch)) {
      continue;
    }

    if (value[grade]) {
      return value[grade];
    }

    return value;
  }

  throw new Error(`Unable to find hover color for: ${swatch}-${grade}`);
}

function Table({ children }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Hover</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Code({ children }) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}

export default function App() {
  return (
    <main>
      <h1>Preview</h1>
      <section>
        <header>
          <h1>Colors</h1>
        </header>
        <Table>
          {Object.keys(colors).map(swatch => {
            return (
              <React.Fragment key={swatch}>
                {Object.keys(colors[swatch]).map(grade => {
                  const hoverColor = getHoverColor(swatch, grade);
                  return (
                    <tr key={`${swatch}-${grade}`}>
                      <td>
                        <Code>{`${swatch}-${grade}`}</Code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: colors[swatch][grade],
                              marginRight: '0.5rem',
                              outline: '1px solid #8a3ffc',
                            }}
                          />
                          {colors[swatch][grade]}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: hoverColor,
                              marginRight: '0.5rem',
                              outline: '1px solid #8a3ffc',
                            }}
                          />
                          {hoverColor}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Table>
      </section>
    </main>
  );
  return 'App!';
}

// <Table>
// {Object.keys(colors).map(key => (
// <tr key={key}>
// <td>
// <Code>{key}</Code>
// </td>
// <td>
// <div style={{ display: 'flex', alignItems: 'center' }}>
// <div
// style={{
// width: 50,
// height: 50,
// backgroundColor: colors[key],
// marginRight: '0.5rem',
// outline: '1px solid #8a3ffc',
// }}
// />
// {colors[key]}
// </div>
// </td>
// </tr>
// ))}
// </Table>
