import { describe, it, expect } from 'vitest';
import { themeActions } from '../../slices/theme.slice';
import store from '../../state';

const { dispatch } = store;

describe('themeSlice', () => {

  it('themeSet', () => {
    dispatch(themeActions.themeSet({}));
    expect(store.getState().theme).toEqual({});
  });

  it('themeClear', () => {
    dispatch(themeActions.themeClear());
    expect(store.getState().theme).toEqual({});
  });

});