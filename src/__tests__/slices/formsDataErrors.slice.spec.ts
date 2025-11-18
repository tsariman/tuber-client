import { describe, it, expect } from 'vitest';
import { formsDataErrorsActions } from '../../slices/formsDataErrors.slice';
import store from '../../state';

const { dispatch } = store;

describe('formsDataErrorsSlice', () => {

  it('formsDataErrorsUpdate', () => {
    dispatch(formsDataErrorsActions.formsDataErrorsUpdate({
      formName: 'test',
      name: 'test',
      error: true,
    }));
    expect(store.getState().formsDataErrors).toEqual({
      test: 'test',
    });
  });

  it('formsDataErrorsClear', () => {
    dispatch(formsDataErrorsActions.formsDataErrorsClear('test'));
    expect(store.getState().formsDataErrors).toEqual({});
  });

  it('formsDataErrorsClearAll', () => {
    dispatch(formsDataErrorsActions.formsDataErrorsClearAll());
    expect(store.getState().formsDataErrors).toEqual({});
  });

  it('formsDataErrorsRemove', () => {
    dispatch(formsDataErrorsActions.formsDataErrorsUpdate({
      formName: 'test',
      name: 'test',
      error: true,
    }));
    dispatch(formsDataErrorsActions.formsDataErrorsRemove({
      formName: 'test',
      name: 'test',
    }));
    expect(store.getState().formsDataErrors).toEqual({});
  });

});