import { describe, it, expect } from 'vitest';
import { netActions } from '../../slices/net.slice';
import store from '../../state';

const { dispatch } = store;

describe('netSlice', () => {

  it('netSet', () => {
    dispatch(netActions.netSet({}));
    expect(store.getState().net).toEqual({});
  });

  it('netClear', () => {
    dispatch(netActions.netClear());
    expect(store.getState().net).toEqual({});
  });

  it('netSetCsrfToken', () => {
    dispatch(netActions.netSetCsrfToken(''));
    expect(store.getState().net.csrfToken).toEqual('');
  });

  it('netSetCsrfTokenMethod', () => {
    dispatch(netActions.netSetCsrfTokenMethod(''));
    expect(store.getState().net.csrfTokenMethod).toEqual('');
  });

  it('netSetCsrfTokenName', () => {
    dispatch(netActions.netSetCsrfTokenName(''));
    expect(store.getState().net.csrfTokenName).toEqual('');
  });

  it('netSetHeaders', () => {
    dispatch(netActions.netSetHeaders({}));
    expect(store.getState().net.headers).toEqual({});
  });

});