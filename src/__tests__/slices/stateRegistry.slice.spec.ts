import { describe, it, expect } from 'vitest';
import { staticRegistryActions } from '../../slices/staticRegistry.slice';
import store from '../../state';

const { dispatch } = store;

describe('staticRegistryySlice', () => {

  it('staticRegistryClear', () => {
    dispatch(staticRegistryActions.staticRegistryClear());
    expect(store.getState().staticRegistry).toEqual({});
  });

});