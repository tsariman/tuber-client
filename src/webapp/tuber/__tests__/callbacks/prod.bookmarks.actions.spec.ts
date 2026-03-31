import { beforeEach, describe, expect, it, vi } from 'vitest'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appReducer, { appActions } from '../../../../slices/app.slice'
import netReducer from '../../../../slices/net.slice'
import dataReducer, { dataActions } from '../../../../slices/data.slice'
import includedReducer, { includedActions } from '../../../../slices/included.slice'
import { bookmark_vote_down, bookmark_vote_up } from '../../callbacks/prod.bookmarks.actions'
import type { IRedux } from '../../../../state'
import type { IJsonapiResponseResource } from '@tuber/shared'

const rootReducer = combineReducers({
  app: appReducer,
  net: netReducer,
  data: dataReducer,
  included: includedReducer
})

const createBookmark = (id: string): IJsonapiResponseResource => ({
  id,
  type: 'bookmarks',
  attributes: {
    title: `Bookmark ${id}`,
    upvotes: 0,
    downvotes: 0
  }
})

describe('bookmark vote callbacks', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('bookmark_vote_up stores vote resource under included state', async () => {
    const store = configureStore({ reducer: rootReducer })
    store.dispatch(appActions.appOriginUpdate('https://api.example.com'))
    store.dispatch(dataActions.dataStoreCol({
      endpoint: 'bookmarks',
      collection: [createBookmark('b-1')]
    }))

    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        data: {
          type: 'bookmark-votes',
          id: 'b-1',
          attributes: {
            rating: 1,
            upvotes: 4,
            downvotes: 1
          }
        }
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const redux = {
      store: {
        getState: store.getState,
        dispatch: store.dispatch
      },
      actions: {
        dataSetAttrByIndex: dataActions.dataSetAttrByIndex,
        includedUpdateById: includedActions.includedUpdateById
      }
    } as unknown as IRedux

    await bookmark_vote_up(0)(redux)()

    const state = store.getState()
    expect(state.data.bookmarks[0].attributes?.upvotes).toBe(4)
    expect(state.data.bookmarks[0].attributes?.downvotes).toBe(1)
    expect(state.included['bookmark-votes']).toHaveLength(1)
    expect(state.included['bookmark-votes'][0]).toMatchObject({
      id: 'b-1',
      type: 'bookmark-votes',
      attributes: {
        rating: 1,
        upvotes: 4,
        downvotes: 1
      }
    })
    expect(state.data['bookmark-votes']).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/bookmarks/b-1/vote',
      expect.objectContaining({ method: 'PUT' })
    )
  })

  it('bookmark_vote_down updates existing included vote without duplicate records', async () => {
    const store = configureStore({ reducer: rootReducer })
    store.dispatch(appActions.appOriginUpdate('https://api.example.com'))
    store.dispatch(dataActions.dataStoreCol({
      endpoint: 'bookmarks',
      collection: [createBookmark('b-1')]
    }))
    store.dispatch(includedActions.includedStoreCol({
      endpoint: 'bookmark-votes',
      collection: [{
        type: 'bookmark-votes',
        id: 'b-1',
        attributes: {
          rating: 1,
          bookmark_id: 'b-1'
        }
      }]
    }))

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({
        data: {
          type: 'bookmark-votes',
          id: 'b-1',
          attributes: {
            rating: -1,
            upvotes: 3,
            downvotes: 2
          }
        }
      })
    }))

    const redux = {
      store: {
        getState: store.getState,
        dispatch: store.dispatch
      },
      actions: {
        dataSetAttrByIndex: dataActions.dataSetAttrByIndex,
        includedUpdateById: includedActions.includedUpdateById
      }
    } as unknown as IRedux

    await bookmark_vote_down(0)(redux)()

    const state = store.getState()
    expect(state.included['bookmark-votes']).toHaveLength(1)
    expect(state.included['bookmark-votes'][0]).toMatchObject({
      id: 'b-1',
      attributes: {
        rating: -1,
        bookmark_id: 'b-1',
        upvotes: 3,
        downvotes: 2
      }
    })
    expect(state.data['bookmark-votes']).toBeUndefined()
  })
})