import { describe, it, expect } from 'vitest';
import { tmpActions } from '../../slices/tmp.slice';
import store from '../../state';

const { dispatch } = store;

describe('tmpSlice', () => {

  it('tmpAdd', () => {
    dispatch(tmpActions.tmpAdd({ id: '', name: '', value: '' }));
    expect(store.getState().tmp).toEqual({});
  });

  it('tmpRemove', () => {
    dispatch(tmpActions.tmpRemove({}));
    expect(store.getState().tmp).toEqual({});
  });

});