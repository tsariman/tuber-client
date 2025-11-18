import { describe, it, expect } from 'vitest';
import { topLevelLinksActions } from '../../slices/topLevelLinks.slice';
import store from '../../state';

const { dispatch } = store;

describe('topLevelLinksSlice', () => {

  it('topLevelLinksStore', () => {
    dispatch(topLevelLinksActions.topLevelLinksStore({
      endpoint: '',
      links: { self: '' },
    }));
    expect(store.getState().topLevelLinks).toEqual({});
  });

  it('topLevelLinksRemove', () => {
    dispatch(topLevelLinksActions.topLevelLinksRemove({}));
    expect(store.getState().topLevelLinks).toEqual({});
  });

});