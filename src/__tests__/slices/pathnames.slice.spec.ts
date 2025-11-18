import { describe, it, expect } from 'vitest';
import { pathnamesActions } from '../../slices/pathnames.slice';
import store from '../../state';

const { dispatch } = store;

describe('pathnamesSlice', () => {

  it('setDialogsPath', () => {
    dispatch(pathnamesActions.setDialogsPath('test'));
    expect(store.getState().pathnames.dialogs).toEqual('test');
  });

  it('setFormsPath', () => {
    dispatch(pathnamesActions.setFormsPath('test'));
    expect(store.getState().pathnames.forms).toEqual('test');
  });

  it('setPagesPath', () => {
    dispatch(pathnamesActions.setPagesPath('test'));
    expect(store.getState().pathnames.pages).toEqual('test');
  });

});