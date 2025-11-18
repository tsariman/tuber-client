import { describe, it, expect } from 'vitest';
import { formsDataActions as a } from '../../slices/formsData.slice';
import store from '../../state';

const { dispatch } = store;

describe('formsDataSlice', () => {

  it('formsDataUpdate', () => {
    dispatch(a.formsDataUpdate({
      formName: 'test',
      name: 'test',
      value: 'test',
    }));
    expect(store.getState().formsData).toEqual({
      test: 'test',
    });
  });

  it('formsDataClear', () => {
    dispatch(a.formsDataClear('test'));
    expect(store.getState().formsData).toEqual({});
  });

});