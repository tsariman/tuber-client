import { describe, it, expect } from 'vitest';
import {
  APP_IS_BOOTSTRAPPED,
  APP_IS_FETCHING,
  APP_REQUEST_FAILED,
  APP_REQUEST_SUCCESS
} from '@tuber/shared';
import { appActions } from '../../slices/app.slice';
import { get_state, dispatch } from '../../state';

const {
  appHideSpinner,
  appRequestEnd,
  appRequestFailed,
  appRequestProcessEnd,
  appRequestStart,
  appRequestSuccess,
  appShowSpinner
} = appActions;

describe('appSlice', () => {
  it('should update status to APP_IS_FETCHING', () => {
    dispatch(appRequestStart());
    expect(get_state().app.status).toBe(APP_IS_FETCHING);
  });

  it('should update status to APP_REQUEST_SUCCESS', () => {
    dispatch(appRequestSuccess());
    expect(get_state().app.status).toBe(APP_REQUEST_SUCCESS);
  });

  it('should update status to APP_REQUEST_FAILED', () => {
    dispatch(appRequestFailed());
    expect(get_state().app.status).toBe(APP_REQUEST_FAILED);
  });

  it('should update status to APP_IS_BOOTSTRAPPED 1', () => {
    dispatch(appRequestEnd());
    expect(get_state().app.status).toBe(APP_IS_BOOTSTRAPPED);
  });

  it('should update status to APP_IS_BOOTSTRAPPED 2', () => {
    dispatch(appRequestProcessEnd());
    expect(get_state().app.status).toBe(APP_IS_BOOTSTRAPPED);
  });

  it('should update showSpinner to true', () => {
    dispatch(appShowSpinner());
    expect(get_state().app.showSpinner).toBe(true);
  });

  it('should update showSpinner to false', () => {
    dispatch(appHideSpinner());
    expect(get_state().app.showSpinner).toBe(false);
  });
});