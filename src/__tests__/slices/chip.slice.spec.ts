import { describe, it, expect } from 'vitest';
import { chipsActions as a } from '../../slices/chips.slice';
import store from '../../state';

const { dispatch } = store;

describe('chipSlice', () => {
  it('should update status to APP_IS_FETCHING', () => {
    dispatch(a.chipAdd({
      id: '1',
      route: 'home',
      chipState: { id: '1', label: 'Home' }
    }));
    expect(store.getState().chips.home).toBe('test');
  });

  it('should update status to APP_REQUEST_SUCCESS 1', () => {
    dispatch(a.chipRemove({ id: '2', route: 'home' }));
    expect(store.getState().chips.home).toBe('');
  });

  it('should update status to APP_REQUEST_SUCCESS 2', () => {
    dispatch(a.chipUpdate({
      id: '3',
      route: 'home',
      chipState: { id: '3', label: 'Home', content: 'test' }
    }));
    expect(store.getState().chips.home).toBe('home');
  });

});