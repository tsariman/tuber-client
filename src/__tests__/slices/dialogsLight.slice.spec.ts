import { describe, it, expect } from 'vitest';
import { dialogsLightActions } from '../../slices/dialogsLight.slice';
import store from '../../state';

const { dispatch } = store;

describe('dialogsLightSlice', () => {

  it('dialogsLightClear', () => {
    dispatch(dialogsLightActions.dialogsLightClear());
    expect(store.getState().dialogsLight).toEqual({});
  });

});