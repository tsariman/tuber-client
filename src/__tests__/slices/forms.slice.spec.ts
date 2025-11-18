import { describe, it, expect } from 'vitest';
import { formsActions as a } from '../../slices/forms.slice';
import store from '../../state';

const { dispatch } = store;

describe('formsSlice', () => {

  it('formsAddMultiple', () => {
    dispatch(a.formsAddMultiple({
      '1': {
        items: []
      },
      '2': {
        items: [],
      },
    }));
    expect(store.getState().forms[0]).toBeDefined();
    expect(store.getState().forms[1]).toBeDefined();
  });

  it('formsAdd', () => {
    dispatch(a.formsAdd({
      name: 'test',
      form: {}
    }));
    expect(store.getState().forms[0]).toBeDefined();
  });

  it('formsRemove', () => {
    dispatch(a.formsRemove('test'));
    expect(store.getState().forms[0]).toBeUndefined();
  });

});