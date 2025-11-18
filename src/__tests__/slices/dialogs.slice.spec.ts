import { describe, it, expect } from 'vitest';
import { dialogsAction } from '../../slices/dialogs.slice';
import store from '../../state';

const { dispatch } = store;

describe('dialogsSlice', () => {

  it('dialogsAddMultiple', () => {
    dispatch(dialogsAction.dialogsAddMultiple({}));
    expect(store.getState().dialogs).toEqual({});
  });

  it('dialogsAdd', () => {
    dispatch(dialogsAction.dialogsAdd({
      name: 'test',
      dialog: {}
    }));
    expect(store.getState().dialogs.test).toBeDefined();
  });

  it('dialogsRemove', () => {
    dispatch(dialogsAction.dialogsRemove('test'));
    expect(store.getState().dialogs.test).toBeUndefined();
  });

  it('dialogsOpen', () => {
    dispatch(dialogsAction.dialogsOpen('test'));
    expect(store.getState().dialogs.test.open).toBe(true);
  });

  it('dialogsClose', () => {
    dispatch(dialogsAction.dialogsClose('test'));
    expect(store.getState().dialogs.test.open).toBe(false);
  });

});