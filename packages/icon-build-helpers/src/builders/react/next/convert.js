/**
 * Copyright IBM Corp. 2019, 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const t = require('@babel/types');

function jsToAST(value) {
  if (typeof value === 'string') {
    return t.stringLiteral(value);
  }

  if (typeof value === 'number') {
    return t.numericLiteral(value);
  }

  if (typeof value === 'boolean') {
    return t.booleanLiteral(value);
  }

  if (value === null) {
    return t.nullLiteral();
  }

  if (value === undefined) {
    return t.identifier('undefined');
  }

  if (Array.isArray(value)) {
    return t.arrayExpression(value.map(jsToAST));
  }

  if (typeof value === 'object') {
    return t.objectExpression(
      Object.entries(value).map(([key, value]) => {
        return t.objectProperty(t.identifier(key), jsToAST(value));
      })
    );
  }

  throw new Error(`Unexpected value: ${value}`);
}

function svgToJSX(node) {
  if (node.type === 'element') {
    if (node.tagName === 'svg') {
      return {
        svgProps: node.attributes,
        children: node.children.map(svgToJSX),
      };
    }

    const { tagName } = node;
    const attributeAllowlist = new Set(['data-icon-path']);
    const attributeDenylist = ['data', 'aria'];
    const attributes = Object.entries(node.attributes)
      .filter(([key]) => {
        if (attributeAllowlist.has(key)) {
          return true;
        }
        return attributeDenylist.every((prefix) => !key.startsWith(prefix));
      })
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return t.jSXAttribute(t.jSXIdentifier(key), t.stringLiteral(value));
        }
        return t.jSXAttribute(
          t.jSXIdentifier(key),
          t.jSXExpressionContainer(jsToAST(value))
        );
      });

    if (node.children.length > 0) {
      const children = node.children.map(svgToJSX);
      return t.jSXElement(
        t.jSXOpeningElement(t.jSXIdentifier(tagName), attributes, false),
        t.jSXClosingElement(t.jSXIdentifier(tagName)),
        children
      );
    }

    return t.jSXElement(
      t.jSXOpeningElement(t.jSXIdentifier(tagName), attributes, true),
      null,
      []
    );
  }

  throw new Error(`Unknown node type: ${node.type}`);
}

module.exports = {
  svgToJSX,
  jsToAST,
};
