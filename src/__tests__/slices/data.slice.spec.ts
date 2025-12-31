import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import dataReducer, { dataActions } from '../../slices/data.slice';
import type { IJsonapiResource, IJsonapiResponseResource } from '@tuber/shared';

// Create a fresh store for each test to ensure isolation
const createTestStore = () => configureStore({
  reducer: {
    data: dataReducer
  }
});

// Test data helpers
const createBookmark = (id: string, title: string, name?: string): IJsonapiResponseResource => ({
  id,
  type: 'bookmarks',
  attributes: {
    title,
    name: name || title, // Use name if provided, otherwise default to title
    url: `https://example.com/${id}`,
    createdAt: new Date().toISOString()
  }
});

const createBookmarks = (count: number): IJsonapiResponseResource[] => 
  Array.from({ length: count }, (_, i) => createBookmark(`${i + 1}`, `Bookmark ${i + 1}`));

describe('dataSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('dataStack', () => {
    it('should insert element at the beginning of empty collection', () => {
      const bookmark = createBookmark('1', 'First Bookmark');
      
      store.dispatch(dataActions.dataStack({ 
        collectionName: 'bookmarks', 
        data: bookmark 
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(1);
      expect(state.bookmarks[0]).toEqual(bookmark);
    });

    it('should insert element at the beginning of existing collection', () => {
      const existing = createBookmarks(2);
      const newBookmark = createBookmark('3', 'New First');
      
      // Set up existing data
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      // Add new item at beginning
      store.dispatch(dataActions.dataStack({ 
        collectionName: 'bookmarks', 
        data: newBookmark 
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(3);
      expect(state.bookmarks[0]).toEqual(newBookmark);
      expect(state.bookmarks[1]).toEqual(existing[0]);
    });
  });

  describe('dataStoreCol', () => {
    it('should store collection and replace existing', () => {
      const initial = createBookmarks(3);
      const replacement = createBookmarks(2);
      
      // Store initial collection
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: initial 
      }));
      expect(store.getState().data.bookmarks).toHaveLength(3);
      
      // Replace with new collection
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: replacement 
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(2);
      expect(state.bookmarks).toEqual(replacement);
    });
  });

  describe('dataQueueCol', () => {
    it('should append collection to empty endpoint', () => {
      const bookmarks = createBookmarks(3);
      
      store.dispatch(dataActions.dataQueueCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      expect(store.getState().data.bookmarks).toEqual(bookmarks);
    });

    it('should append collection to existing data', () => {
      const existing = createBookmarks(2);
      const additional = createBookmarks(2).map(b => ({ ...b, id: `${parseInt(b.id!) + 10}` }));
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      store.dispatch(dataActions.dataQueueCol({ 
        endpoint: 'bookmarks', 
        collection: additional 
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(4);
      expect(state.bookmarks.slice(0, 2)).toEqual(existing);
      expect(state.bookmarks.slice(2)).toEqual(additional);
    });
  });

  describe('dataStackCol', () => {
    it('should prepend collection to existing data', () => {
      const existing = createBookmarks(2);
      const prepend = createBookmarks(2).map(b => ({ ...b, id: `${parseInt(b.id!) + 10}` }));
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      store.dispatch(dataActions.dataStackCol({ 
        endpoint: 'bookmarks', 
        collection: prepend 
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(4);
      expect(state.bookmarks.slice(0, 2)).toEqual(prepend);
      expect(state.bookmarks.slice(2)).toEqual(existing);
    });
  });

  describe('dataLimitQueueCol - Pagination Logic', () => {
    it('should queue collection without limit when under threshold', () => {
      const existing = createBookmarks(5); // 5 items, pageSize 3 = 2 pages
      const additional = createBookmarks(3).map(b => ({ ...b, id: `${parseInt(b.id!) + 10}` }));
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      store.dispatch(dataActions.dataLimitQueueCol({ 
        endpoint: 'bookmarks', 
        collection: additional,
        pageSize: 3,
        limit: 5  // 5 pages max, we're only at 2 pages
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(8); // All items kept
    });

    it('should remove old pages when exceeding limit', () => {
      const existing = createBookmarks(15); // 15 items, pageSize 3 = 5 pages
      const additional = createBookmarks(3).map(b => ({ ...b, id: `${parseInt(b.id!) + 20}` }));
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      store.dispatch(dataActions.dataLimitQueueCol({ 
        endpoint: 'bookmarks', 
        collection: additional,
        pageSize: 3,
        limit: 4  // 4 pages max, we have 5 pages
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(15); // Should drop 1 page (3 items) then add 3
      expect(state.bookmarks.slice(-3)).toEqual(additional); // New items at the end
    });
  });

  describe('dataLimitStackCol - Fixed Pagination Logic', () => {
    it('should stack collection without limit when under threshold', () => {
      const existing = createBookmarks(6); // 6 items, pageSize 3 = 2 pages
      const prepend = createBookmarks(3).map(b => ({ ...b, id: `${parseInt(b.id!) + 10}` }));
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      store.dispatch(dataActions.dataLimitStackCol({ 
        endpoint: 'bookmarks', 
        collection: prepend,
        pageSize: 3,
        limit: 5  // 5 pages max, we're at 2 pages
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(9); // All items kept
      expect(state.bookmarks.slice(0, 3)).toEqual(prepend); // New items at the beginning
    });

    it('should trim old data when exceeding limit (FIXED BUG)', () => {
      const existing = createBookmarks(15); // 15 items, pageSize 5 = 3 pages
      const prepend = createBookmarks(5).map(b => ({ ...b, id: `${parseInt(b.id!) + 20}` }));
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: existing 
      }));
      
      store.dispatch(dataActions.dataLimitStackCol({ 
        endpoint: 'bookmarks', 
        collection: prepend,
        pageSize: 5,
        limit: 3  // 3 pages max (15 items), we're adding 1 more page
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(20); // 5 prepended + 15 kept (within 4 pages worth)
      expect(state.bookmarks.slice(0, 5)).toEqual(prepend); // New items at the beginning
    });
  });

  describe('dataRemoveCol', () => {
    it('should clear collection', () => {
      const bookmarks = createBookmarks(5);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      expect(store.getState().data.bookmarks).toHaveLength(5);
      
      store.dispatch(dataActions.dataRemoveCol('bookmarks'));
      expect(store.getState().data.bookmarks).toEqual([]);
    });
  });

  describe('dataUpdateByIndex', () => {
    it('should update resource at specific index', () => {
      const bookmarks = createBookmarks(3);
      const updatedBookmark = createBookmark('99', 'Updated Title');
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      store.dispatch(dataActions.dataUpdateByIndex({
        endpoint: 'bookmarks',
        index: 1,
        resource: updatedBookmark
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks[1]).toEqual(updatedBookmark);
      expect(state.bookmarks[0]).toEqual(bookmarks[0]); // Others unchanged
      expect(state.bookmarks[2]).toEqual(bookmarks[2]);
    });
  });

  describe('dataDeleteByIndex', () => {
    it('should delete resource at specific index', () => {
      const bookmarks = createBookmarks(3);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      store.dispatch(dataActions.dataDeleteByIndex({
        endpoint: 'bookmarks',
        index: 1
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(2);
      expect(state.bookmarks[0]).toEqual(bookmarks[0]);
      expect(state.bookmarks[1]).toEqual(bookmarks[2]); // Third item moved to index 1
    });
  });

  describe('dataSetAttrByIndex - FIXED BUG', () => {
    it('should update attribute at index 0 (FIXED falsy check)', () => {
      const bookmarks = createBookmarks(3);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      store.dispatch(dataActions.dataSetAttrByIndex({
        endpoint: 'bookmarks',
        index: 0, // This was broken before - 0 is falsy!
        prop: 'title',
        val: 'Updated First Title'
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks[0].attributes?.title).toBe('Updated First Title');
    });

    it('should update attribute at non-zero index', () => {
      const bookmarks = createBookmarks(3);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      store.dispatch(dataActions.dataSetAttrByIndex({
        endpoint: 'bookmarks',
        index: 2,
        prop: 'title',
        val: 'Updated Third Title'
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks[2].attributes?.title).toBe('Updated Third Title');
    });

    it('should not crash with invalid index', () => {
      const bookmarks = createBookmarks(2);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      store.dispatch(dataActions.dataSetAttrByIndex({
        endpoint: 'bookmarks',
        index: 99, // Invalid index
        prop: 'title',
        val: 'Should not crash'
      }));
      
      // Should not throw and original data should be unchanged
      const state = store.getState().data;
      expect(state.bookmarks).toEqual(bookmarks);
    });
  });

  describe('dataUpdateByName', () => {
    it('should update resource by name attribute', () => {
      const bookmarks = [
        createBookmark('1', 'First', 'first-bookmark'),
        createBookmark('2', 'Target', 'target-bookmark'),
        createBookmark('3', 'Third', 'third-bookmark')
      ];
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      const updatedResource = createBookmark('2', 'Updated Target', 'target-bookmark');
      
      store.dispatch(dataActions.dataUpdateByName({
        collectionName: 'bookmarks',
        name: 'target-bookmark',
        resource: updatedResource
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks[1]).toEqual(updatedResource);
      expect(state.bookmarks[1].attributes?.title).toBe('Updated Target');
    });
  });

  describe('dataUpdateById - FIXED MAJOR BUG', () => {
    it('should update existing resource without creating duplicates', () => {
      const bookmarks = createBookmarks(3);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      const updatedBookmark = createBookmark('2', 'Updated Second');
      
      store.dispatch(dataActions.dataUpdateById({
        collectionName: 'bookmarks',
        id: '2',
        resource: updatedBookmark
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(3); // Should still be 3, not 4!
      expect(state.bookmarks[1]).toEqual(updatedBookmark);
    });

    it('should add resource if ID not found', () => {
      const bookmarks = createBookmarks(2);
      
      store.dispatch(dataActions.dataStoreCol({ 
        endpoint: 'bookmarks', 
        collection: bookmarks 
      }));
      
      const newBookmark = createBookmark('99', 'New Resource');
      
      store.dispatch(dataActions.dataUpdateById({
        collectionName: 'bookmarks',
        id: '99',
        resource: newBookmark
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(3); // Should be 3 now
      expect(state.bookmarks[2]).toEqual(newBookmark);
    });

    it('should handle empty collection', () => {
      const newBookmark = createBookmark('1', 'First Resource');
      
      store.dispatch(dataActions.dataUpdateById({
        collectionName: 'bookmarks',
        id: '1',
        resource: newBookmark
      }));
      
      const state = store.getState().data;
      expect(state.bookmarks).toHaveLength(1);
      expect(state.bookmarks[0]).toEqual(newBookmark);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle operations on non-existent endpoints', () => {
      store.dispatch(dataActions.dataDeleteByIndex({
        endpoint: 'nonexistent',
        index: 0
      }));
      
      // Should create empty array and not crash
      expect(store.getState().data.nonexistent).toEqual([]);
    });

    it('should handle undefined/null data gracefully', () => {
      expect(() => {
        store.dispatch(dataActions.dataSetAttrByIndex({
          endpoint: 'bookmarks',
          index: undefined,
          prop: 'title',
          val: 'test'
        }));
      }).not.toThrow();
    });
  });
});