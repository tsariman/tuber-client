import { beforeEach, describe, it, expect } from 'vitest';
import {
  FORMS_DATA_HYDRATED_FLAG,
  FORMS_DATA_HYDRATION_KEY,
  formsDataActions as a
} from '../../slices/formsData.slice';
import store from '../../state';

const { dispatch } = store;

describe('formsDataSlice', () => {

  beforeEach(() => {
    dispatch(a.formsDataClear('test'));
  });

  it('formsDataUpdate', () => {
    dispatch(a.formsDataUpdate({
      formName: 'test',
      name: 'test',
      value: 'test',
    }));
    expect(store.getState().formsData).toEqual({
      test: {
        test: 'test',
      },
    });
  });

  it('formsDataClear', () => {
    dispatch(a.formsDataClear('test'));
    expect(store.getState().formsData).toEqual({});
  });

  it('formsDataMarkHydrated', () => {
    dispatch(a.formsDataMarkHydrated({
      formName: 'test',
      hydrationKey: '/forms/account:users:1'
    }));
    expect(store.getState().formsData).toEqual({
      test: {
        [FORMS_DATA_HYDRATED_FLAG]: true,
        [FORMS_DATA_HYDRATION_KEY]: '/forms/account:users:1',
      },
    });
  });

});