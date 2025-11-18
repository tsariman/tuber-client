import { describe, it, expect } from 'vitest';
import { dialogsDarkActions } from '../../slices/dialogsDark.slice';
import store from '../../state';

const { dispatch } = store;

describe('dialogsDarkSlice', () => {

  it('dialogsDarkClear', () => {
    dispatch(dialogsDarkActions.dialogsDarkClear());
    expect(store.getState().dialogsDark).toEqual({});
  });

});