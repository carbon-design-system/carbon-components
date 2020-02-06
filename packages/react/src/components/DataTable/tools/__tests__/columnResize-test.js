/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRef } from 'react';
import {
  actionTypes,
  initialState,
  resizeReducer,
  getColRefs,
} from '../columnResize';

describe('column resizer reducer', () => {
  const key1 = 'aKey';
  const key2 = 'aKey2';
  const key3 = 'aKey3';
  const ref1 = createRef();
  const ref2 = createRef();
  const ref3 = createRef();

  function getAddAction(key = key1, ref = ref1, width = 100) {
    return {
      type: actionTypes.ADD_COLUMN,
      colKey: key,
      ref,
      colWidth: width,
    };
  }

  function getStateFor3Columns(w1 = 100, w2 = 100, w3 = 100) {
    const addAction1 = getAddAction(key1, ref1, w1);
    const addAction2 = getAddAction(key2, ref2, w2);
    const addAction3 = getAddAction(key3, ref3, w3);

    return resizeReducer(
      resizeReducer(resizeReducer(initialState, addAction1), addAction2),
      addAction3
    );
  }

  it('should handle ADD_COLUMN.', () => {
    const nextState = resizeReducer(initialState, getAddAction());
    expect(nextState).toEqual({
      allColumnKeys: [key1],
      columnsByKey: {
        [key1]: {
          ref: ref1,
          colWidth: 100,
          initialColWidth: 100,
        },
      },
      columnKeyResizeActive: null,
    });
  });

  it('should handle REMOVE_COLUMN.', () => {
    const removeAction = {
      type: actionTypes.REMOVE_COLUMN,
      colKey: key1,
    };
    const nextState = resizeReducer(
      resizeReducer(initialState, getAddAction()),
      removeAction
    );
    expect(nextState).toEqual(initialState);
  });

  it('should handle START_RESIZE_ACTION.', () => {
    const startAction = {
      type: actionTypes.START_RESIZE_ACTION,
      colKey: key1,
    };
    const nextState = resizeReducer(
      resizeReducer(initialState, getAddAction()),
      startAction
    );
    expect(nextState).toEqual({
      allColumnKeys: [key1],
      columnsByKey: {
        [key1]: {
          ref: ref1,
          colWidth: 100,
          initialColWidth: 100,
        },
      },
      columnKeyResizeActive: key1,
    });
  });

  it('should handle END_RESIZE_ACTION.', () => {
    const startAction = {
      type: actionTypes.START_RESIZE_ACTION,
      colKey: key1,
    };
    const endAction = {
      type: actionTypes.END_RESIZE_ACTION,
      colKey: key1,
    };
    const nextState = resizeReducer(
      resizeReducer(resizeReducer(initialState, getAddAction()), startAction),
      endAction
    );

    expect(nextState).toEqual({
      allColumnKeys: [key1],
      columnsByKey: {
        [key1]: {
          ref: ref1,
          colWidth: 100,
          initialColWidth: 100,
        },
      },
      columnKeyResizeActive: null,
    });
  });

  it('should handle single column UPDATE_COLWIDTH.', () => {
    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key1,
      incr: 50,
    };
    const nextState = resizeReducer(
      resizeReducer(initialState, getAddAction()),
      updateAction
    );
    expect(nextState).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 150,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle multi column UPDATE_COLWIDTH.', () => {
    const nextState = getStateFor3Columns();

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key1,
      incr: 51,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 151,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 74,
            initialColWidth: 100,
          },
          [key3]: {
            ref: ref1,
            colWidth: 75,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle UPDATE_COLWIDTH hitting min width.', () => {
    const nextState = getStateFor3Columns(100, 40, 100);

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key2,
      incr: -50,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 100,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 40,
            initialColWidth: 40,
          },
          [key3]: {
            ref: ref1,
            colWidth: 100,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle UPDATE_COLWIDTH hitting min width to the right.', () => {
    const nextState = getStateFor3Columns();

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key2,
      incr: 70,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 100,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 170,
            initialColWidth: 100,
          },
          [key3]: {
            ref: ref1,
            colWidth: 40,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle UPDATE_COLWIDTH modifying left columns.', () => {
    const nextState = getStateFor3Columns(100, 100, 40);

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key2,
      incr: 50,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 50,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 150,
            initialColWidth: 100,
          },
          [key3]: {
            ref: ref1,
            colWidth: 40,
            initialColWidth: 40,
          },
        },
      })
    );
  });

  it('should handle UPDATE_COLWIDTH modifying right most column.', () => {
    const nextState = getStateFor3Columns();

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key3,
      incr: 51,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 74,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 75,
            initialColWidth: 100,
          },
          [key3]: {
            ref: ref1,
            colWidth: 151,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle UPDATE_COLWIDTH only columns wider than min width to the right.', () => {
    const nextState = getStateFor3Columns(100, 40, 100);

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key1,
      incr: 51,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 151,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 40,
            initialColWidth: 40,
          },
          [key3]: {
            ref: ref1,
            colWidth: 49,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle UPDATE_COLWIDTH only columns wider than min width to the left.', () => {
    const nextState = getStateFor3Columns(100, 40, 100);

    const updateAction = {
      type: actionTypes.UPDATE_COLWIDTH,
      colKey: key3,
      incr: 51,
    };
    const nextState2 = resizeReducer(nextState, updateAction);

    expect(nextState2).toEqual(
      expect.objectContaining({
        columnsByKey: {
          [key1]: {
            ref: ref1,
            colWidth: 49,
            initialColWidth: 100,
          },
          [key2]: {
            ref: ref1,
            colWidth: 40,
            initialColWidth: 40,
          },
          [key3]: {
            ref: ref1,
            colWidth: 151,
            initialColWidth: 100,
          },
        },
      })
    );
  });

  it('should handle BATCH_SET_COLWIDTHS.', () => {
    const nextState = getStateFor3Columns();

    const setAction = {
      type: actionTypes.BATCH_SET_COLWIDTHS,
      colKey: key1,
      colWidths: {
        aKey: 150,
        aKey2: 200,
        aKey3: 250,
      },
    };
    const nextState2 = resizeReducer(nextState, setAction);

    expect(nextState2).toEqual({
      allColumnKeys: [key1, key2, key3],
      columnsByKey: {
        [key1]: {
          ref: ref1,
          colWidth: 150,
          initialColWidth: 150,
        },
        [key2]: {
          ref: ref2,
          colWidth: 200,
          initialColWidth: 200,
        },
        [key3]: {
          ref: ref3,
          colWidth: 250,
          initialColWidth: 250,
        },
      },
      columnKeyResizeActive: null,
    });
  });

  it('should return column refs.', () => {
    const nextState = getStateFor3Columns();

    expect(getColRefs(nextState)).toEqual([
      { key: key1, ref: ref1 },
      { key: key2, ref: ref2 },
      { key: key3, ref: ref3 },
    ]);
  });

  it('should not handle unkown actions.', () => {
    expect(() =>
      resizeReducer(initialState, { type: 'unkown' })
    ).toThrowError();
  });
});
