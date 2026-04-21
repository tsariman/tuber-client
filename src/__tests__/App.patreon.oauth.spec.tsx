import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appReducer from '../slices/app.slice'
import snackbarReducer from '../slices/snackbar.slice'
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

describe('App query-param redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.replaceState(null, '', '/?patreon_oauth=connected&return_route=%2Faccount')
  })

  it('routes back to the account page after Patreon OAuth completes', async () => {
    const rootReducer = combineReducers({
      app: appReducer,
      snackbar: snackbarReducer,
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
          status: 'ready',
          title: 'Test App',
          logoUri: '/logo.png',
          logoTag: 'img',
          lastRoute: '/',
          homepage: '/',
          isBootstrapped: true,
          fetchMessage: '',
          themeMode: 'light',
        },
      } as any,
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await waitFor(() => {
      expect(store.getState().app.route).toBe('/account')
      expect(store.getState().snackbar.message).toBe('Patreon account connected successfully.')
    })
  })

  it('shows the email verification success message from query params', async () => {
    window.history.replaceState(null, '', '/?email_verification=success&message=Email%20successfully%20verified&return_route=%2Fsign-in')

    const rootReducer = combineReducers({
      app: appReducer,
      snackbar: snackbarReducer,
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
          status: 'ready',
          title: 'Test App',
          logoUri: '/logo.png',
          logoTag: 'img',
          lastRoute: '/',
          homepage: '/',
          isBootstrapped: true,
          fetchMessage: '',
          themeMode: 'light',
        },
      } as any,
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await waitFor(() => {
      expect(store.getState().app.route).toBe('/sign-in')
      expect(store.getState().snackbar.message).toBe('Email successfully verified')
    })
  })

  it('updates an already-open app tab from a storage event broadcast', async () => {
    window.history.replaceState(null, '', '/')

    const rootReducer = combineReducers({
      app: appReducer,
      snackbar: snackbarReducer,
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
          status: 'ready',
          title: 'Test App',
          logoUri: '/logo.png',
          logoTag: 'img',
          lastRoute: '/',
          homepage: '/',
          isBootstrapped: true,
          fetchMessage: '',
          themeMode: 'light',
        },
      } as any,
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'tuber:browser-event',
      newValue: JSON.stringify({
        kind: 'email_verification',
        status: 'success',
        message: 'Email successfully verified',
        returnRoute: '/sign-in',
      }),
    }))

    await waitFor(() => {
      expect(store.getState().app.route).toBe('/sign-in')
      expect(store.getState().snackbar.message).toBe('Email successfully verified')
    })
  })
})
