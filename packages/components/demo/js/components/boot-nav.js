import 'core-js/modules/es.array.find';

import React from 'react';
import ReactDOM from 'react-dom';
import RootPage from './RootPage';

/**
 * Waits for BrowserSync JS code to be loaded, and calls the given callback after.
 * @param {Function} callback The callback.
 * @private
 */
const pollForBrowserSync = (callback) => {
  const bsScriptTag = Array.prototype.find.call(
    document.querySelectorAll('script'),
    (elem) => /browser-sync-client/i.test(elem.src)
  );
  // eslint-disable-next-line no-underscore-dangle
  if (!bsScriptTag || window.___browserSync___) {
    callback();
  } else {
    bsScriptTag.addEventListener('load', callback);
  }
};

/**
 * Normalize Fractal Component instance data so the data structure can be shared with non-Fractal environment.
 * @param {object} data The Fractal Component instance data
 * @param {Array} data.items
 * @param {string} [data.notes] The notes of the component.
 * @param {Array<object>} [data.variants] The variants of the component.
 * @returns {object} The normalized version of the Fractal Component instance data.
 */
const normalizeComponentItem = ({ notes, variants, items = [], ...other }) => ({
  ...other,
  notes,
  items: (!variants || !variants.items ? items : variants.items).map(
    (subItem) => ({
      ...subItem,
      // Avoid using notes copied from component to variant
      notes: notes === subItem.notes ? undefined : subItem.notes,
    })
  ),
});

pollForBrowserSync(() => {
  const renderRoot = document.querySelector('[data-renderroot]');
  if (renderRoot) {
    const props = {
      componentItems: window.componentItems.map(normalizeComponentItem),
      docItems: window.docItems,
      portSassBuild: window.portSassBuild,
      routeWithQueryArgs: window.routeWithQueryArgs,
      useStaticFullRenderPage: window.useStaticFullRenderPage,
    };
    ReactDOM.render(<RootPage {...props} />, renderRoot);
  }
});
