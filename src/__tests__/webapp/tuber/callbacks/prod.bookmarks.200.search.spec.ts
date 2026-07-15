import { beforeEach, describe, expect, it, vi } from 'vitest'
import appbar_search_bookmarks from '../../../../webapp/tuber/callbacks/prod.bookmarks.200.search'
import { PAGE_RESEARCH_APP_ID } from '../../../../webapp/tuber/tuber.config'

vi.mock('src/business.logic/logging', () => ({
  pre: vi.fn(),
  log: vi.fn(),
}))

vi.mock('src/controllers', () => ({
  StateApp: class {
    routeAsKey: string

    constructor (appState: { routeAsKey?: string }) {
      this.routeAsKey = appState.routeAsKey || 'bookmarks'
    }
  },
  StateAppbarQueries: class {
    private readonly queryState: Record<string, { value: string }>

    constructor (queryState: Record<string, { value: string }>) {
      this.queryState = queryState
    }

    get (route: string) {
      return this.queryState[route]
    }
  },
  StateNet: class {
    userLoggedIn: boolean

    constructor (netState: { userLoggedIn?: boolean }) {
      this.userLoggedIn = Boolean(netState.userLoggedIn)
    }
  },
}))

vi.mock('src/state/net.actions', () => ({
  get_req_state: vi.fn((endpoint: string, args: string) => ({
    type: 'GET_REQ_STATE',
    payload: { endpoint, args }
  }))
}))

describe('appbar_search_bookmarks private empty-submit behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requests recent bookmarks with mode only when private search is submitted empty', async () => {
    const dispatch = vi.fn()
    const pageKey = 'bookmarks'

    const rootState = {
      app: { routeAsKey: pageKey },
      appbarQueries: {
        [pageKey]: { value: '   ' }
      },
      staticRegistry: {
        [PAGE_RESEARCH_APP_ID]: pageKey,
      },
      pages: {
        [pageKey]: {
          content: 'view:bookmarks:bookmarks'
        }
      },
      pagesData: {
        [pageKey]: {
          searchMode: 'private'
        }
      },
      net: {
        userLoggedIn: true
      }
    }

    const actions = {
      chipAdd: vi.fn(() => ({ type: 'CHIP_ADD' })),
      dataRemoveCol: vi.fn(() => ({ type: 'DATA_REMOVE_COL' })),
      appSwitchPage: vi.fn(() => ({ type: 'APP_SWITCH_PAGE' })),
      dataClearRange: vi.fn(() => ({ type: 'DATA_CLEAR_RANGE' })),
      topLevelLinksRemove: vi.fn(() => ({ type: 'TOP_LEVEL_LINKS_REMOVE' })),
      appSetFetchMessage: vi.fn(() => ({ type: 'APP_SET_FETCH_MESSAGE' }))
    }

    const redux = {
      store: {
        dispatch,
        getState: () => rootState
      },
      actions
    }

    await appbar_search_bookmarks(redux as any)()

    const dispatchedReqStateAction = dispatch.mock.calls
      .map(([action]) => action)
      .find((action) => action?.type === 'GET_REQ_STATE')

    expect(dispatchedReqStateAction).toMatchObject({
      type: 'GET_REQ_STATE',
      payload: {
        endpoint: 'bookmarks',
        args: 'filter[mode]=private'
      }
    })
    expect(dispatchedReqStateAction?.payload?.args).not.toContain('filter[search]=')
  })

  it('does not request bookmarks when public search is submitted empty', async () => {
    const dispatch = vi.fn()
    const pageKey = 'bookmarks'

    const rootState = {
      app: { routeAsKey: pageKey },
      appbarQueries: {
        [pageKey]: { value: '   ' }
      },
      staticRegistry: {
        [PAGE_RESEARCH_APP_ID]: pageKey,
      },
      pages: {
        [pageKey]: {
          content: 'view:bookmarks:bookmarks'
        }
      },
      pagesData: {
        [pageKey]: {
          searchMode: 'public'
        }
      },
      net: {
        userLoggedIn: true
      }
    }

    const actions = {
      chipAdd: vi.fn(() => ({ type: 'CHIP_ADD' })),
      dataRemoveCol: vi.fn(() => ({ type: 'DATA_REMOVE_COL' })),
      appSwitchPage: vi.fn(() => ({ type: 'APP_SWITCH_PAGE' })),
      dataClearRange: vi.fn(() => ({ type: 'DATA_CLEAR_RANGE' })),
      topLevelLinksRemove: vi.fn(() => ({ type: 'TOP_LEVEL_LINKS_REMOVE' })),
      appSetFetchMessage: vi.fn(() => ({ type: 'APP_SET_FETCH_MESSAGE' }))
    }

    const redux = {
      store: {
        dispatch,
        getState: () => rootState
      },
      actions
    }

    await appbar_search_bookmarks(redux as any)()

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'GET_REQ_STATE' })
    )
  })
})
