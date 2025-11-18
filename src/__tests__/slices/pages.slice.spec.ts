import { describe, it, expect } from 'vitest';
import { pagesActions as a } from '../../slices/pages.slice';
import store from '../../state';

const { dispatch } = store;

describe('pagesSlice', () => {

  it('pagesAddMultiple', () => {
    dispatch(a.pagesAddMultiple({}));
    expect(store.getState().pages).toEqual({});
  });

  it('pagesAdd', () => {
    dispatch(a.pagesAdd({ route: '', page: {} }));
    expect(store.getState().pages).toEqual({});
  });

  it('pagesRemove', () => {
    dispatch(a.pagesRemove(''));
    expect(store.getState().pages).toEqual({});
  });

});