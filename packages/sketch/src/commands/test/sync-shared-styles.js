/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Document,
  Rectangle,
  ShapePath,
  SharedStyle,
  Style,
  Text,
} from 'sketch/dom';
import { command } from '../command';
import { syncSharedStyle, syncColorStyle } from '../../tools/sharedStyles';

/**
 * Test strategy:
 *
 * Open up a blank Sketch document and run the following command. This command
 * will verify that we can create a layer with a shared style that is
 * correctly updated when the shared style changes. In addition, we are checking
 * that we aren't creating duplicate shared styles under the same name, and
 * instead are updating a named shared style (if it exists).
 */
export function testSyncSharedStyles() {
  command('commands/test/sync-shared-styles', () => {
    const document = Document.getSelectedDocument();
    const { selectedPage: page } = document;

    // Clear the current document and page
    function clear() {
      document.sharedLayerStyles = [];
      document.sharedTextStyles = [];
      page.layers = [];
    }

    clear();

    /**
     * Testing shared layer styles
     */
    const sharedStyle = syncColorStyle({
      document,
      name: 'black',
      color: '#000000',
    });

    if (document.sharedLayerStyles.length !== 1) {
      throw new Error('Expected sync command to generate a shared layer style');
    }

    syncColorStyle({ document, name: 'black', color: '#000000' });

    if (document.sharedLayerStyles.length !== 1) {
      throw new Error(
        'Expected sync command to generate only one shared layer style for ' +
          'the given name'
      );
    }

    const layer = new ShapePath({
      name: 'Rectangle',
      shapeType: ShapePath.ShapeType.Rectangle,
      frame: new Rectangle(0, 0, 100, 100),
      style: {
        fills: [
          {
            fillType: Style.FillType.Color,
            color: '#d8d8d8ff',
          },
        ],
      },
      points: [
        {
          type: 'CurvePoint',
          cornerRadius: 0,
          curveFrom: { x: 0, y: 0 },
          curveTo: { x: 0, y: 0 },
          point: { x: 0, y: 0 },
          pointType: 'Straight',
        },
        {
          type: 'CurvePoint',
          cornerRadius: 0,
          curveFrom: { x: 1, y: 0 },
          curveTo: { x: 1, y: 0 },
          point: { x: 1, y: 0 },
          pointType: 'Straight',
        },
        {
          type: 'CurvePoint',
          cornerRadius: 0,
          curveFrom: { x: 1, y: 1 },
          curveTo: { x: 1, y: 1 },
          point: { x: 1, y: 1 },
          pointType: 'Straight',
        },
        {
          type: 'CurvePoint',
          cornerRadius: 0,
          curveFrom: { x: 0, y: 1 },
          curveTo: { x: 0, y: 1 },
          point: { x: 0, y: 1 },
          pointType: 'Straight',
        },
      ],
      closed: true,
    });

    layer.sharedStyleId = sharedStyle.id;
    layer.style.syncWithSharedStyle(sharedStyle);
    page.layers.push(layer);

    function getLayerFillColor() {
      return layer.style.fills[0].color;
    }

    if (getLayerFillColor() !== '#000000ff') {
      throw new Error('The layer is not in sync with the shared style');
    }

    syncColorStyle({ document, name: 'black', color: '#dedede' });

    if (getLayerFillColor() !== '#dededeff') {
      throw new Error('The layer did not update to the new shared style');
    }

    /**
     * Testing shared text styles
     */
    clear();

    const textSharedStyle = syncSharedStyle({
      document,
      name: 'test-shared-text-style',
      style: {
        textColor: '#000000ff',
        fontSize: 16,
        textTransform: 'none',
        fontFamily: 'IBM Plex Sans',
        fontWeight: 5,
        paragraphSpacing: 0,
        lineHeight: null,
        kerning: 0.16,
        verticalAlignment: 'top',
        alignment: 'left',
        styleType: SharedStyle.StyleType.Text,
      },
      styleType: SharedStyle.StyleType.Text,
    });

    if (document.sharedTextStyles.length !== 1) {
      throw new Error('Expected sync command to generate a shared text style');
    }

    syncSharedStyle({
      document,
      name: 'test-shared-text-style',
      style: {},
      styleType: SharedStyle.StyleType.Text,
    });

    if (document.sharedTextStyles.length !== 1) {
      throw new Error(
        'Expected sync command to generate only one shared text style for ' +
          'the given name'
      );
    }

    const textLayer = new Text({
      name: 'Text',
      frame: new Rectangle(0, 0),
      style: textSharedStyle.style,
      text: 'Text sample',
      fixedWidth: false,
      sharedStyleId: textSharedStyle.id,
    });

    page.layers.push(textLayer);

    function getTextFillColor() {
      return textLayer.style.textColor;
    }

    if (getTextFillColor() !== '#000000ff') {
      throw new Error('Inserted layer is out of sync with shared text style');
    }

    syncSharedStyle({
      document,
      name: 'test-shared-text-style',
      style: {
        textColor: '#343434ff',
      },
      styleType: SharedStyle.StyleType.Text,
    });

    if (getTextFillColor() !== '#343434ff') {
      throw new Error('Shared text style textColor was not updated');
    }
  });
}
