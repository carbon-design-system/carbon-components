/**
 * Copyright IBM Corp. 2020, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * A collection of icons built up from a source directory of .svg assets
 * @typedef {Map<string, Icon>} Registry
 */

/**
 * An icon is defined by a unique name in "<name>.svg" that can have an optional
 * namespace and has multiple assets that detail the assets available in a
 * source directory of .svg assets
 * @typedef {object} Icon
 * @property {string} id
 * @property {Array<string>} namespace
 * @property {Array<Asset>} assets
 */

/**
 * An asset for an icon that details its size and filepath information
 * @typedef {object} Asset
 * @property {number|('glyph')} size
 * @property {string} filepath
 */

/**
 * Create a registry from the assets found within the given directory
 * @param {string} directory
 * @returns {Registry}
 */
async function create(directory) {
  const registry = new Map();
  const queue = await getFilepathsFromDirectory(directory);

  // Our queue is built up with filepaths that we need to process. Each
  // filepath can either be a directory or an asset corresponding to an icon.
  while (queue.length > 0) {
    const filepath = queue.shift();
    const stats = await fs.stat(filepath);

    // If we encounter a directory, then we append all of the filepaths we've
    // found to the queue to be processed
    if (await stats.isDirectory()) {
      const filepaths = await getFilepathsFromDirectory(filepath);
      queue.push(...filepaths);
      continue;
    }

    // When we have an asset for an icon, we need to build up information about
    // it and correctly assign, or update, the entry for this icon in the
    // registry.

    // We want to build up an array of the relative path from the SVG folder to
    // the asset that we've found. This relative path may contain size or
    // namespace information.
    const directories = path
      .relative(directory, path.dirname(filepath))
      .split(path.sep)
      .filter(Boolean);

    // Our namespace is generated from every directory that is not a size
    const namespace = directories.filter(directory => isNaN(directory));
    // Our size folder is generated from the first directory that is a number
    const sizeFolderName = directories.find(directory => !isNaN(directory));
    const asset = {
      id: path.basename(filepath, '.svg'),
      size: sizeFolderName ? parseInt(sizeFolderName, 10) : 'glyph',
      filepath,
      namespace,
    };

    if (!registry.has(asset.id)) {
      registry.set(asset.id, {
        id: asset.id,
        namespace: asset.namespace,
        assets: [],
      });
    }

    const entry = registry.get(asset.id);
    entry.assets.push({
      filepath: asset.filepath,
      size: asset.size,
    });
  }

  return registry;
}

const denylist = new Set(['.DS_Store']);

/**
 * Get all the filepaths from the given directory that are not contained in a
 * denylist.
 * @param {string} directory
 * @returns {Array<string>}
 */
async function getFilepathsFromDirectory(directory) {
  const files = await fs.readdir(directory);
  return files
    .filter(name => {
      return !denylist.has(name);
    })
    .map(filename => {
      return path.join(directory, filename);
    });
}

module.exports = {
  create,
};
