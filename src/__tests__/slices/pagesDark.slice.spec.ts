import { describe, it, expect } from 'vitest';
import { pagesDarkActions as a } from '../../slices/pagesDark.slice';
import store from '../../state';

const { dispatch } = store;

describe('pagesDarkSlice', () => {
  it('pagesDarkClear', () => {
    dispatch(a.pagesDarkClear());
    expect(store.getState().pagesDark).toEqual({});
  });
});