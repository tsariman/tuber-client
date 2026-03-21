import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import includedReducer, { includedActions } from '../../slices/included.slice'
import type { IJsonapiResponseResource } from '@tuber/shared'

const createTestStore = () => configureStore({
  reducer: {
    included: includedReducer
  }
})

const createBookmarkVote = (
  id: string,
  rating: 1 | -1,
  bookmarkId = id
): IJsonapiResponseResource => ({
  id,
  type: 'bookmark-votes',
  attributes: {
    bookmark_id: bookmarkId,
    rating
  }
})

describe('includedSlice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  it('stores included collections by endpoint', () => {
    const votes = [createBookmarkVote('1', 1), createBookmarkVote('2', -1)]

    store.dispatch(includedActions.includedStoreCol({
      endpoint: 'bookmark-votes',
      collection: votes
    }))

    expect(store.getState().included['bookmark-votes']).toEqual(votes)
  })

  it('accumulates only new included resources by id', () => {
    const existingVote = createBookmarkVote('1', 1)
    const duplicateVote = createBookmarkVote('1', -1)
    const newVote = createBookmarkVote('2', -1)

    store.dispatch(includedActions.includedStoreCol({
      endpoint: 'bookmark-votes',
      collection: [existingVote]
    }))

    store.dispatch(includedActions.includedAccumulateByAppending({
      identifier: 'bookmark-votes',
      collection: [duplicateVote, newVote]
    }))

    expect(store.getState().included['bookmark-votes']).toEqual([
      existingVote,
      newVote
    ])
  })

  it('updates an existing included resource by id', () => {
    store.dispatch(includedActions.includedStoreCol({
      endpoint: 'bookmark-votes',
      collection: [createBookmarkVote('1', 1)]
    }))

    store.dispatch(includedActions.includedUpdateById({
      collectionName: 'bookmark-votes',
      id: '1',
      resource: {
        id: '1',
        type: 'bookmark-votes',
        attributes: {
          rating: -1,
          upvotes: 4,
          downvotes: 2
        }
      }
    }))

    expect(store.getState().included['bookmark-votes']).toEqual([
      {
        id: '1',
        type: 'bookmark-votes',
        attributes: {
          bookmark_id: '1',
          rating: -1,
          upvotes: 4,
          downvotes: 2
        },
        relationships: {}
      }
    ])
  })

  it('adds an included resource when the id is not present', () => {
    const newVote = createBookmarkVote('7', 1)

    store.dispatch(includedActions.includedUpdateById({
      collectionName: 'bookmark-votes',
      id: '7',
      resource: newVote
    }))

    expect(store.getState().included['bookmark-votes']).toEqual([newVote])
  })
})