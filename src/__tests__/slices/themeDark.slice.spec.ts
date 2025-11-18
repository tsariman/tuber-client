import { describe, it, expect } from 'vitest';
import { themeDarkActions } from '../../slices/themeDark.slice';
import store from '../../state';

const { dispatch } = store;

describe('themeDarkSlice', () => {

  it('themeDarkClear', () => {
    dispatch(themeDarkActions.themeDarkClear());
    expect(store.getState().themeDark).toEqual({});
  });

});