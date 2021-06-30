/**
 * Copyright IBM Corp. 2020, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { pascalCase } = require('change-case');
const path = require('path');
const parser = require('svgson');
const { svgo } = require('./output/optimizer');

/**
 * @type {Extension}
 */
const moduleInfo = () => {
  return {
    name: 'module-info',
    computed: true,
    async extend(metadata) {
      for (const icon of metadata.icons) {
        const local = getLocalName(icon.name);
        const global = getGlobalName(icon.name, icon.namespace);

        const moduleInfo = {
          local: safe(local),
          global: safe(global),
          filepath: path.join(...icon.namespace, `${local}.js`),
          sizes: await Promise.all(
            icon.assets.map(async (asset) => {
              const optimized = await svgo.optimize(asset.source, {
                path: asset.filepath,
              });
              const ast = parse(optimized.data);

              return {
                size: asset.size,
                ast,
              };
            })
          ),
        };

        icon.moduleInfo = moduleInfo;
      }
    },
  };
};

/**
 * Gets the global name for a module from a string. This name incorporates the
 * namespace to create a unique name that can be used in entrypoint (index.js)
 * files to prevent collision between namespaces
 * @param {string} name
 * @param {Array<string>} [namespace]
 * @returns {string}
 */
function getGlobalName(name, namespace = []) {
  let moduleName = namespace
    .filter((size) => isNaN(size))
    .map(pascalCase)
    .join('');

  moduleName = moduleName + getLocalName(name);

  return moduleName;
}

/**
 * Gets the local name for a module from a string. The local name is the
 * identifier used to refer to the Icon component in a JavaScript module. It
 * would not be used in an entrypoint (index.js) file, however, as names could
 * collide between namespaces.
 * @param {string} name
 * @returns {string}
 */
function getLocalName(name) {
  return pascalCase(name);
}

/**
 * Formats a given string to be valid in JavaScript. Often used to rename
 * modules that start with a number, for example `3DFilled` becomes `_3DFilled`
 * @param {string} name
 * @returns {string}
 */
function safe(name) {
  if (!isNaN(name[0])) {
    return '_' + name;
  }
  return name;
}

/**
 * Parses the input string into an SVG AST (Abstract Syntax Tree)
 * @param {string} input
 * @returns {object}
 */
function parse(input) {
  const root = parser.parseSync(input);

  function transform(node) {
    if (node.type === 'element') {
      if (node.name === 'svg') {
        return {
          type: node.type,
          tagName: node.name,
          attributes: {
            ...transformAttributes(node.attributes),
            fill: 'currentColor',
          },
          children: node.children.map(transform),
        };
      }

      return {
        type: node.type,
        tagName: node.name,
        attributes: transformAttributes(node.attributes),
        children: node.children.map(transform),
      };
    }

    throw new Error(`Unsupported node type: ${node.type}`);
  }

  function transformAttributes(attributes) {
    const result = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (typeof value === 'string') {
        // In our Adobe Illustrator exports, some attributes in the SVG contain
        // a \t sequence that is included in the parsed SVG ast. Here, we remove
        // it and replace it with a space as the whitespace character
        result[key] = value.replace(/\t/g, ' ');
      }
    }
    return result;
  }

  return transform(root);
}

module.exports = moduleInfo;
