import { describe, it, expect } from 'vitest';
import { formsDarkActions } from '../../slices/formsDark.slice';
import store from '../../state';

const { dispatch } = store;

describe('formsDarkSlice', () => {

  it('formsDarkClear', () => {
    dispatch(formsDarkActions.formsDarkClear());
    expect(store.getState().formsDark).toEqual({});
  });

});