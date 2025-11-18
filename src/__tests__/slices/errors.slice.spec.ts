import { describe, it, expect } from 'vitest';
import { errorsActions as a } from '../../slices/errors.slice';
import store from '../../state';

const { dispatch } = store;

describe('errorsSlice', () => {

  it('errorsClear', () => {
    dispatch(a.errorsClear());
    expect(store.getState().errors).toEqual([]);
  });

  it('errorsAdd', () => {
    dispatch(a.errorsClear());
    dispatch(a.errorsAdd({
      code: 'INTERNAL_ERROR',
      title: 'test',
    }));
    expect(store.getState().errors[0]).toBeDefined();
  });

  it('errorsRemove', () => {
    // First clear and add an error with a known ID
    dispatch(a.errorsClear());
    dispatch(a.errorsAdd({
      id: 'test-error-id',
      code: 'INTERNAL_ERROR',
      title: 'test error',
    }));
    
    // Verify the error was added
    expect(store.getState().errors).toHaveLength(1);
    expect(store.getState().errors[0].id).toBe('test-error-id');
    
    // Remove the error by ID
    dispatch(a.errorsRemove('test-error-id'));
    
    // Verify the error was removed
    expect(store.getState().errors).toHaveLength(0);
  });

});