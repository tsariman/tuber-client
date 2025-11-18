import { describe, it, expect } from 'vitest';
import { sessionActions } from '../../slices/session.slice';
import store from '../../state';

const { dispatch } = store;

describe('sessionSlice', () => {

  it('sessionUpdate', () => {
    dispatch(sessionActions.sessionUpdate({}));
    expect(store.getState().session).toEqual({});
  });

});