import { describe, it, expect } from 'vitest';
import { appbarQueriesActions as a } from '../../slices/appbarQueries.slice';
import store from '../../state';

const { dispatch } = store;

describe('appbarQueriesSlice', () => {
  it('should update status to APP_IS_FETCHING', () => {
    dispatch(a.appbarQueriesSet({ route: 'home', value: 'test' }));
    expect(store.getState().appbarQueries.home).toBe('test');
  });

  it('should update status to APP_REQUEST_SUCCESS', () => {
    dispatch(a.appbarQueriesDelete('home'));
    expect(store.getState().appbarQueries.home).toBe('');
  });
});
