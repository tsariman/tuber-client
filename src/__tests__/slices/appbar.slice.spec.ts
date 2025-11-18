import { describe, it, expect } from 'vitest';
import { appActions } from '../../slices/app.slice';
import store from '../../state';

const { dispatch } = store;

describe('appSlice', () => {
  it('should update status to APP_IS_FETCHING', () => {
    dispatch(appActions.appRequestStart());
    expect(store.getState().app.status).toBe('APP_IS_FETCHING');
  });

  it('should update status to APP_REQUEST_SUCCESS', () => {
    dispatch(appActions.appRequestSuccess());
    expect(store.getState().app.status).toBe('APP_REQUEST_SUCCESS');
  });

  it('should update status to APP_REQUEST_FAILED', () => {
    dispatch(appActions.appRequestFailed());
    expect(store.getState().app.status).toBe('APP_REQUEST_FAILED');
  });

  it('should update status to APP_IS_BOOTSTRAPPED 1', () => {
    dispatch(appActions.appRequestEnd());
    expect(store.getState().app.status).toBe('APP_IS_BOOTSTRAPPED');
  });

  it('should update status to APP_IS_BOOTSTRAPPED 2', () => {
    dispatch(appActions.appRequestProcessEnd());
    expect(store.getState().app.status).toBe('APP_IS_BOOTSTRAPPED');
  });

  it('should update showSpinner to true', () => {
    dispatch(appActions.appShowSpinner());
    expect(store.getState().app.showSpinner).toBe(true);
  });

  it('should update showSpinner to false', () => {
    dispatch(appActions.appHideSpinner());
    expect(store.getState().app.showSpinner).toBe(false);
  });
});