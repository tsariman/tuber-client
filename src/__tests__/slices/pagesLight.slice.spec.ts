import { describe, it, expect } from 'vitest';
import { pagesLightActions } from '../../slices/pagesLight.slice';
import store from '../../state';

const { dispatch } = store;

describe('pagesLightSlice', () => {

  it('pagesLightClear', () => {
    dispatch(pagesLightActions.pagesLightClear());
    expect(store.getState().pagesLight).toEqual({});
  });

});