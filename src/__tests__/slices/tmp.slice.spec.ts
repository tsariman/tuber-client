import { describe, it, expect } from 'vitest';
import { tmpActions } from '../../slices/tmp.slice';
import store from '../../state';

const { dispatch } = store;

describe('tmpSlice', () => {

  it('tmpAdd', () => {
    dispatch(tmpActions.tmpAdd({ id: 'id1', name: 'name1', value: 'value1' }));
    expect(store.getState().tmp).toEqual({});
  });

  it('tmpRemove', () => {
    dispatch(tmpActions.tmpRemove('id1'));
    expect(store.getState().tmp).toEqual({});
  });

});