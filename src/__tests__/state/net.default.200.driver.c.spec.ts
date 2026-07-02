import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { IJsonapiResponse, IJsonapiResponseResource } from '@tuber/shared';
import { APP_REQUEST_SUCCESS, EP_BOOKMARKS } from '@tuber/shared';
import store from '../../state';
import { state_reset } from '../../state/actions';
import net_default_200_driver from '../../state/net.default.200.driver.c';

const createBookmark = (id: string): IJsonapiResponseResource => ({
  id,
  type: 'bookmarks',
  attributes: {
    title: `Bookmark ${id}`,
    name: `Bookmark ${id}`,
    url: `https://example.com/${id}`,
  },
});

const createResponse = (
  pageNumber: number,
  ids: string[],
  maxLoadedPages = 2,
  pageSize = 2,
): IJsonapiResponse => ({
  meta: {
    max_loaded_pages: String(maxLoadedPages),
  },
  links: {
    self: `https://example.com/${EP_BOOKMARKS}?page[number]=${pageNumber}&page[size]=${pageSize}`,
    first: `https://example.com/${EP_BOOKMARKS}?page[number]=1&page[size]=${pageSize}`,
    last: `https://example.com/${EP_BOOKMARKS}?page[number]=10&page[size]=${pageSize}`,
    prev: pageNumber > 1
      ? `https://example.com/${EP_BOOKMARKS}?page[number]=${pageNumber - 1}&page[size]=${pageSize}`
      : undefined,
    next: `https://example.com/${EP_BOOKMARKS}?page[number]=${pageNumber + 1}&page[size]=${pageSize}`,
  },
  data: ids.map(createBookmark),
});

describe('src/state/net.default.200.driver.c.ts', () => {
  beforeEach(() => {
    store.dispatch(state_reset());
  });

  afterEach(() => {
    store.dispatch(state_reset());
  });

  describe('net_default_200_driver', () => {
    it('updates pagination state across sequential loads and ignores duplicate loaded pages', () => {
      const pageTwoResponse = createResponse(2, ['3', '4']);
      const pageThreeResponse = createResponse(3, ['5', '6']);

      net_default_200_driver(store.dispatch, store.getState, EP_BOOKMARKS, pageTwoResponse);

      expect(store.getState().app.status).toBe(APP_REQUEST_SUCCESS);
      expect(store.getState().dataPagesRange[EP_BOOKMARKS]).toEqual({ first: '2', last: '2' });
      expect(store.getState().data[EP_BOOKMARKS]).toEqual(pageTwoResponse.data);

      net_default_200_driver(store.dispatch, store.getState, EP_BOOKMARKS, pageThreeResponse);

      expect(store.getState().dataPagesRange[EP_BOOKMARKS]).toEqual({ first: '2', last: '3' });
      expect(store.getState().data[EP_BOOKMARKS]).toEqual([
        ...(pageTwoResponse.data as IJsonapiResponseResource[]),
        ...(pageThreeResponse.data as IJsonapiResponseResource[]),
      ]);
      expect(store.getState().topLevelLinks[EP_BOOKMARKS]).toEqual(pageThreeResponse.links);

      net_default_200_driver(store.dispatch, store.getState, EP_BOOKMARKS, pageThreeResponse);

      expect(store.getState().dataPagesRange[EP_BOOKMARKS]).toEqual({ first: '2', last: '3' });
      expect(store.getState().data[EP_BOOKMARKS]).toEqual([
        ...(pageTwoResponse.data as IJsonapiResponseResource[]),
        ...(pageThreeResponse.data as IJsonapiResponseResource[]),
      ]);
      expect(store.getState().topLevelLinks[EP_BOOKMARKS]).toEqual(pageThreeResponse.links);
    });

    it('drops the oldest page when a sequential load exceeds the max loaded pages limit', () => {
      const pageTwoResponse = createResponse(2, ['3', '4']);
      const pageThreeResponse = createResponse(3, ['5', '6']);
      const pageFourResponse = createResponse(4, ['7', '8']);

      net_default_200_driver(store.dispatch, store.getState, EP_BOOKMARKS, pageTwoResponse);
      net_default_200_driver(store.dispatch, store.getState, EP_BOOKMARKS, pageThreeResponse);
      net_default_200_driver(store.dispatch, store.getState, EP_BOOKMARKS, pageFourResponse);

      expect(store.getState().dataPagesRange[EP_BOOKMARKS]).toEqual({ first: '3', last: '4' });
      expect(store.getState().data[EP_BOOKMARKS]).toEqual([
        ...(pageThreeResponse.data as IJsonapiResponseResource[]),
        ...(pageFourResponse.data as IJsonapiResponseResource[]),
      ]);
      expect(store.getState().topLevelLinks[EP_BOOKMARKS]).toEqual(pageFourResponse.links);
      expect(store.getState().app.status).toBe(APP_REQUEST_SUCCESS);
    });
  });
});