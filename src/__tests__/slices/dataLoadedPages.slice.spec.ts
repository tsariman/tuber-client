import { describe, it, expect } from 'vitest';
import { dataLoadedPagesActions as a } from '../../slices/dataLoadedPages.slice';
import store from '../../state';

const { dispatch } = store;

describe('dataLoadedPagesSlice', () => {

  it('Insert or update the loaded page ranges of endpoint.', () => {
    dispatch(a.dataUpdateRange({
      endpoint: 'bookmark',
      pageNumbers: {
        first: '0',
        last: '10'
      }
    }));
    expect(store.getState().dataPagesRange.bookmark).toEqual({ start: 0, end: 10 });
  });

  it('Deletes all page number for an endpoint.', () => {
    dispatch(a.dataClearRange('bookmark'));
    expect(store.getState().dataPagesRange.bookmark).toBeUndefined();
  });

});