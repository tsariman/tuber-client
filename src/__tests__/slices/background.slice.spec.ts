import { describe, it, expect } from 'vitest';
import { backgroundActions as a } from '../../slices/background.slice';
import store from '../../state';

const { dispatch } = store;

describe('backgroundSlice', () => {
  it('should update status to APP_IS_FETCHING', () => {
    dispatch(a.backgroundSet({ color: 'red', image: 'test', repeat: 'repeat' }));
    expect(store.getState().background.color).toBe('red');
  });
});
