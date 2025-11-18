import { describe, it, expect } from 'vitest';
import { themeLightActions } from '../../slices/themeLight.slice';
import store from '../../state';

const { dispatch } = store;

describe('themeLightSlice', () => {

  it('themeLightClear', () => {
    dispatch(themeLightActions.themeLightClear());
    expect(store.getState().themeLight).toEqual({});
  });

});