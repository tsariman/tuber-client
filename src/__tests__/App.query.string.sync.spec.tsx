import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { APP_REQUEST_FAILED } from '@tuber/shared'
import appReducer from '../slices/app.slice'
import appbarQueriesReducer from '../slices/appbarQueries.slice'
import pagesDataReducer from '../slices/pagesData.slice'
import App from '../App'

vi.mock('../mui/app.generic.cpn', () => ({
  default: () => <div data-testid="app-generic">GenericApp</div>
}))

vi.mock('../mui/spinner.cpn', () => ({
  default: () => null
}))

vi.mock('../mui/spinner.cpn.bootstrap', () => ({
  default: () => null
}))

vi.mock('../state', async () => {
  const actual = await vi.importActual<typeof import('../state')>('../state')
  return {
    ...actual,
    initialize: vi.fn(),
    bootstrap_app: vi.fn(() => ({ type: 'bootstrap/mock' })),
  }
})

describe('App bookmark query-string sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces query-string updates and uses replaceState for valid bookmark search state', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

    const rootReducer = combineReducers({
      app: appReducer,
      appbarQueries: appbarQueriesReducer,
      pagesData: pagesDataReducer,
      theme: (state = {}) => state,
    })

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        app: {
          fetchingStateAllowed: false,
          inDebugMode: false,
          inDevelMode: false,
          origin: 'http://localhost:3000',
          route: '/',
          showSpinner: false,
          spinnerDisabled: false,
          status: 'APP_REQUEST_SUCCESS',
          title: 'Test App',
          logoUri: '/logo.png',
          logoTag: 'img',
          lastRoute: '/',
          homepage: 'bookmarks',
          isBootstrapped: true,
          fetchMessage: '',
          themeMode: 'light',
        },
        appbarQueries: {
          bookmarks: { value: 'cats and dogs' }
        },
        pagesData: {
          bookmarks: {
            searchMode: 'public',
            playerOpen: true,
            showThumbnail: true,
            playingBookmarkPage: 3,
            bookmarkToPlay: {
              id: 'bookmark-1'
            }
          }
        },
      } as any,
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(replaceStateSpy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(149)
    expect(replaceStateSpy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      '/?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=cats+and+dogs&filter%5Bplayer_open%5D=true&filter%5Bshow_thumbnail%5D=true&filter%5Bplaying_bookmark_key%5D=bookmark-1'
    )

  })

  it('skips URL updates when app status is request failed', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

    const rootReducer = combineReducers({
      app: appReducer,
      appbarQueries: appbarQueriesReducer,
      pagesData: pagesDataReducer,
      theme: (state = {}) => state,
    })

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        app: {
          fetchingStateAllowed: false,
          inDebugMode: false,
          inDevelMode: false,
          origin: 'http://localhost:3000',
          route: '/',
          showSpinner: false,
          spinnerDisabled: false,
          status: APP_REQUEST_FAILED,
          title: 'Test App',
          logoUri: '/logo.png',
          logoTag: 'img',
          lastRoute: '/',
          homepage: 'bookmarks',
          isBootstrapped: true,
          fetchMessage: '',
          themeMode: 'light',
        },
        appbarQueries: {
          bookmarks: { value: 'cats and dogs' }
        },
        pagesData: {
          bookmarks: {
            searchMode: 'public'
          }
        },
      } as any,
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    vi.advanceTimersByTime(200)
    expect(replaceStateSpy).not.toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('filter%5Bsearch%5D')
    )
  })
})
