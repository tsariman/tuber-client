import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  index_by_id,
  drop_index,
  select_by_id
} from '../../business.logic/indexes';

// Mock the shared types
interface MockJsonapiResponseResource {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, unknown>;
}

// Mock error_id function from errors module
vi.mock('../../business.logic/errors', () => ({
  error_id: vi.fn(() => ({
    remember_error: vi.fn()
  }))
}));

describe('indexes.ts', () => {
  const mockUsers: MockJsonapiResponseResource[] = [
    {
      id: '1',
      type: 'user',
      attributes: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      id: '2',
      type: 'user',
      attributes: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    },
    {
      id: '3',
      type: 'user',
      attributes: {
        name: 'Bob Johnson',
        email: 'bob@example.com'
      }
    }
  ];

  const mockPosts: MockJsonapiResponseResource[] = [
    {
      id: 'post-1',
      type: 'post',
      attributes: {
        title: 'First Post',
        content: 'This is the first post'
      }
    },
    {
      id: 'post-2',
      type: 'post',
      attributes: {
        title: 'Second Post',
        content: 'This is the second post'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('index_by_id', () => {
    it('should create an index from array of resources', () => {
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      
      // Test that the index was created by checking select function
      const user1 = select_by_id<MockJsonapiResponseResource>('user', '1');
      const user2 = select_by_id<MockJsonapiResponseResource>('user', '2');
      
      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      expect(user1?.id).toBe('1');
      expect(user2?.id).toBe('2');
    });

    it('should handle multiple collections', () => {
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      index_by_id(mockPosts as Parameters<typeof index_by_id>[0]);
      
      const user = select_by_id<MockJsonapiResponseResource>('user', '1');
      const post = select_by_id<MockJsonapiResponseResource>('post', 'post-1');
      
      expect(user).toBeDefined();
      expect(post).toBeDefined();
      expect(user?.type).toBe('user');
      expect(post?.type).toBe('post');
    });

    it('should overwrite existing collection index', () => {
      // Create initial index
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      const initialUser = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(initialUser).toBeDefined();
      
      // Create new index with different data
      const newUsers: MockJsonapiResponseResource[] = [
        {
          id: '4',
          type: 'user',
          attributes: { name: 'New User' }
        }
      ];
      
      index_by_id(newUsers as Parameters<typeof index_by_id>[0]);
      
      // Old data should no longer be accessible
      const oldUser = select_by_id<MockJsonapiResponseResource>('user', '1');
      const newUser = select_by_id<MockJsonapiResponseResource>('user', '4');
      
      expect(oldUser).toBeUndefined();
      expect(newUser).toBeDefined();
    });

    it('should handle empty array', () => {
      index_by_id([]);
      
      const result = select_by_id('empty', 'any-id');
      expect(result).toBeUndefined();
    });

    it('should handle resources with same ID (last one wins)', () => {
      const duplicateUsers: MockJsonapiResponseResource[] = [
        {
          id: '1',
          type: 'user',
          attributes: { name: 'First John' }
        },
        {
          id: '1',
          type: 'user',
          attributes: { name: 'Second John' }
        }
      ];
      
      index_by_id(duplicateUsers as Parameters<typeof index_by_id>[0]);
      
      const user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user?.attributes?.name).toBe('Second John');
    });
  });

  describe('drop_index', () => {
    it('should remove an existing collection index', () => {
      // Create index
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      const user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user).toBeDefined();
      
      // Drop index
      drop_index('user');
      
      // Should no longer be accessible
      const userAfterDrop = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(userAfterDrop).toBeUndefined();
    });

    it('should handle dropping non-existent collection', () => {
      // Should not throw error
      expect(() => drop_index('nonexistent')).not.toThrow();
    });

    it('should not affect other collections', () => {
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      index_by_id(mockPosts as Parameters<typeof index_by_id>[0]);
      
      // Drop one collection
      drop_index('user');
      
      // Other collection should still exist
      const post = select_by_id<MockJsonapiResponseResource>('post', 'post-1');
      expect(post).toBeDefined();
      
      // Dropped collection should not exist
      const user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user).toBeUndefined();
    });

    it('should allow re-indexing after drop', () => {
      // Create, drop, and recreate index
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      drop_index('user');
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      
      const user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user).toBeDefined();
    });
  });

  describe('select_by_id', () => {
    beforeEach(() => {
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      index_by_id(mockPosts as Parameters<typeof index_by_id>[0]);
    });

    it('should retrieve resource by collection and id', () => {
      const user1 = select_by_id<MockJsonapiResponseResource>('user', '1');
      const user2 = select_by_id<MockJsonapiResponseResource>('user', '2');
      
      expect(user1?.id).toBe('1');
      expect(user1?.attributes?.name).toBe('John Doe');
      expect(user2?.id).toBe('2');
      expect(user2?.attributes?.name).toBe('Jane Smith');
    });

    it('should return undefined for non-existent collection', () => {
      const result = select_by_id('nonexistent', 'any-id');
      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent id', () => {
      const result = select_by_id('user', 'nonexistent-id');
      expect(result).toBeUndefined();
    });

    it('should handle different data types in collections', () => {
      const post = select_by_id<MockJsonapiResponseResource>('post', 'post-1');
      expect(post?.type).toBe('post');
      expect(post?.attributes?.title).toBe('First Post');
    });

    it('should be case sensitive for collection names', () => {
      const result1 = select_by_id<MockJsonapiResponseResource>('user', '1');
      const result2 = select_by_id<MockJsonapiResponseResource>('User', '1');
      const result3 = select_by_id<MockJsonapiResponseResource>('USER', '1');
      
      expect(result1).toBeDefined();
      expect(result2).toBeUndefined();
      expect(result3).toBeUndefined();
    });

    it('should be case sensitive for IDs', () => {
      const result1 = select_by_id<MockJsonapiResponseResource>('user', '1');
      const result2 = select_by_id<MockJsonapiResponseResource>('user', '1 ');
      const result3 = select_by_id('user', ' 1');
      
      expect(result1).toBeDefined();
      expect(result2).toBeUndefined();
      expect(result3).toBeUndefined();
    });

    it('should handle error cases gracefully', () => {
      // The function should not throw errors for edge cases
      const result = select_by_id('user', '1');
      
      // If no error occurred, we should get a valid result
      expect(result).toBeDefined();
      
      // Test edge cases
      expect(() => select_by_id('', '')).not.toThrow();
      expect(() => select_by_id('user', '')).not.toThrow();
      expect(() => select_by_id('', '1')).not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    beforeEach(() => {
      // Clear all indexes to start with clean state
      drop_index('user');
      drop_index('post');
      drop_index('empty');
    });

    it('should handle complete workflow', () => {
      // Start with empty state
      let user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user).toBeUndefined();
      
      // Index data
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user).toBeDefined();
      
      // Update index with new data
      const updatedUsers: MockJsonapiResponseResource[] = [
        {
          id: '1',
          type: 'user',
          attributes: { name: 'Updated John', email: 'updated@example.com' }
        }
      ];
      
      index_by_id(updatedUsers as Parameters<typeof index_by_id>[0]);
      user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user?.attributes?.name).toBe('Updated John');
      
      // Drop index
      drop_index('user');
      user = select_by_id<MockJsonapiResponseResource>('user', '1');
      expect(user).toBeUndefined();
    });

    it('should handle multiple collections simultaneously', () => {
      index_by_id(mockUsers as Parameters<typeof index_by_id>[0]);
      index_by_id(mockPosts as Parameters<typeof index_by_id>[0]);
      
      // Both collections should be accessible
      expect(select_by_id<MockJsonapiResponseResource>('user', '1')).toBeDefined();
      expect(select_by_id<MockJsonapiResponseResource>('post', 'post-1')).toBeDefined();
      
      // Drop one, other should remain
      drop_index('user');
      expect(select_by_id<MockJsonapiResponseResource>('user', '1')).toBeUndefined();
      expect(select_by_id<MockJsonapiResponseResource>('post', 'post-1')).toBeDefined();
      
      // Add another collection
      const comments: MockJsonapiResponseResource[] = [
        { id: 'comment-1', type: 'comment', attributes: { text: 'Great post!' } }
      ];
      
      index_by_id(comments as Parameters<typeof index_by_id>[0]);
      expect(select_by_id<MockJsonapiResponseResource>('comment', 'comment-1')).toBeDefined();
      expect(select_by_id<MockJsonapiResponseResource>('post', 'post-1')).toBeDefined();
    });

    it('should handle large datasets efficiently', () => {
      // Create a large dataset
      const largeDataset: MockJsonapiResponseResource[] = [];
      for (let i = 0; i < 1000; i++) {
        largeDataset.push({
          id: `user-${i}`,
          type: 'user',
          attributes: { name: `User ${i}` }
        });
      }
      
      // Index should handle large datasets
      expect(() => index_by_id(largeDataset as Parameters<typeof index_by_id>[0])).not.toThrow();
      
      // Retrieval should work
      const firstUser = select_by_id<MockJsonapiResponseResource>('user', 'user-0');
      const lastUser = select_by_id<MockJsonapiResponseResource>('user', 'user-999');
      const middleUser = select_by_id<MockJsonapiResponseResource>('user', 'user-500');
      
      expect(firstUser).toBeDefined();
      expect(lastUser).toBeDefined();
      expect(middleUser).toBeDefined();
      
      // Non-existent should return undefined
      const nonExistent = select_by_id('user', 'user-1000');
      expect(nonExistent).toBeUndefined();
    });
  });
});
