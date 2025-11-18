import { describe, it, expect } from 'vitest';
import { formsLightActions } from '../../slices/formsLight.slice';
import store from '../../state';

const { dispatch } = store;

describe('formsLightSlice', () => {

  it('formsLightClear', () => {
    dispatch(formsLightActions.formsLightClear());
    expect(store.getState().formsLight).toEqual({});
  });

});