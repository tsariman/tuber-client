import { describe, it, expect } from 'vitest';
import { snackbarActions } from '../../slices/snackbar.slice';
import store from '../../state';

const { dispatch } = store;

describe('snackbarSlice', () => {

  it('snackbAranchorOriginUpdate', () => {
    dispatch(snackbarActions.snackbarAnchorOriginUpdate({ vertical: 'top', horizontal: 'center' }));
    expect(store.getState().snackbar.anchorOrigin).toEqual({ vertical: 'top', horizontal: 'center' });
  });

  it('snackbarAutoHideDurationUpdate', () => {
    dispatch(snackbarActions.snackbarAutoHideDurationUpdate(1000));
    expect(store.getState().snackbar.autoHideDuration).toEqual(1000);
  });

  it('snackbarDefaultIdUpdate', () => {
    dispatch(snackbarActions.snackbarDefaultIdUpdate('defaultId'));
    expect(store.getState().snackbar.defaultId).toEqual('defaultId');
  });

  it('snackarClear', () => {
    dispatch(snackbarActions.snackbarClear());
    expect(store.getState().snackbar).toEqual({
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      autoHideDuration: 6000,
      defaultId: 'defaultId',
      id: 'defaultId',
      message: '',
      open: false,
      severity: 'info',
    });
  });

  it('snackbarClose', () => {
    dispatch(snackbarActions.snackbarClose());
    expect(store.getState().snackbar.open).toEqual(false);
  });

  it('snackbarOpen', () => {
    dispatch(snackbarActions.snackbarOpen());
    expect(store.getState().snackbar.open).toEqual(true);
  });

  it('snackbarTypeUpdate', () => {
    dispatch(snackbarActions.snackbarTypeUpdate('success'));
    expect(store.getState().snackbar.type).toEqual('success');
  });

  it('snackbarVariantUpdate', () => {
    dispatch(snackbarActions.snackbarVariantUpdate('success'));
    expect(store.getState().snackbar.variant).toEqual('success');
  });

  it('snackbarWriteInfo', () => {
    dispatch(snackbarActions.snackbarWriteInfo('test'));
    expect(store.getState().snackbar).toEqual({
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      autoHideDuration: 6000,
      defaultId: 'defaultId',
      id: 'defaultId',
      message: 'test',
      open: true,
      severity: 'info',
    });
  });

  it('snackbarWriteSuccess', () => {
    dispatch(snackbarActions.snackbarWriteSuccess('test'));
    expect(store.getState().snackbar).toEqual({
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      autoHideDuration: 6000,
      defaultId: 'defaultId',
      id: 'defaultId',
      message: 'test',
      open: true,
      severity: 'success',
    });
  });

  it('snackbarWriteWarning', () => {
    dispatch(snackbarActions.snackbarWriteWarning('test'));
    expect(store.getState().snackbar).toEqual({
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      autoHideDuration: 6000,
      defaultId: 'defaultId',
      id: 'defaultId',
      message: 'test',
      open: true,
      severity: 'warning',
    });
  });

});