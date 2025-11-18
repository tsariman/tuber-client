import { describe, it, expect } from 'vitest';
import { metaActions } from '../../slices/meta.slice';
import store from '../../state';

const { dispatch } = store;

describe('metaSlice', () => {
  
  it('metaAdd', () => {
    dispatch(metaActions.metaAdd({}));
    expect(store.getState().meta).toEqual({});
  });

  it('metaRemove', () => {
    dispatch(metaActions.metaRemove('test'));
    expect(store.getState().meta).toEqual({});
  });

});