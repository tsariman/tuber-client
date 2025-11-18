import { describe, it, expect } from 'vitest';
import { pagesDataActions as a } from '../../slices/pagesData.slice';
import store from '../../state';

const { dispatch } = store;

describe('pagesDataSlice', () => {

  it('pagesDataAdd', () => {
    dispatch(a.pagesDataAdd({ route: 'route', key: '', data: {} }));
    expect(store.getState().pagesData).toEqual({});
  });

  it('pagesDataRemove', () => {
    dispatch(a.pagesDataRemove({}));
    expect(store.getState().pagesData).toEqual({});
  });

});