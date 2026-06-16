import { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  type AppDispatch,
  type RootState,
  actions,
  bootstrap_app,
  initialize
} from './state'
import Config from './config'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
const AppGeneric = lazy(() => import('./mui/app.generic.cpn'))
import {
  ALLOWED_ATTEMPTS,
  BOOTSTRAP_ATTEMPTS,
  EP_AUTH,
  THEME_MODE,
  type TThemeMode
} from '@tuber/shared'
import { get_bootstrap_key, get_cookie } from './business.logic/parsing'
import StateApp from './controllers/StateApp'
import Spinner from './mui/spinner.cpn'
import SpinnerBootstrap from './mui/spinner.cpn.bootstrap'

type TAppBrowserEvent = {
  kind: 'patreon_oauth' | 'email_verification'
  status?: string
  message?: string
  returnRoute?: string
}

const APP_BROWSER_EVENT_KEY = 'tuber:browser-event'

const applyBrowserEvent = (dispatch: AppDispatch, event: TAppBrowserEvent) => {
  if (event.kind === 'patreon_oauth') {
    if (event.status === 'connected') {
      dispatch(actions.snackbarWriteSuccess('Patreon account connected successfully.'))
    } else if (event.status === 'error:not_configured') {
      dispatch(actions.snackbarWriteError('Patreon OAuth is not configured in this environment yet.'))
    } else if (event.status === 'error:patreon_already_linked') {
      dispatch(actions.snackbarWriteError('That Patreon account is already linked to another user.'))
    } else if (event.status?.startsWith('error:')) {
      dispatch(actions.snackbarWriteError('Patreon connection failed. Please try again.'))
    } else if (event.status) {
      dispatch(actions.snackbarWriteInfo(`Patreon OAuth status: ${event.status}`))
    }
  }

  if (event.kind === 'email_verification') {
    if (event.status === 'success') {
      dispatch(actions.snackbarWriteSuccess(event.message || 'Email successfully verified'))
    } else if (event.status === 'error:expired') {
      dispatch(actions.snackbarWriteError(event.message || 'Verification code expired. Request a new email and try again.'))
    } else if (event.status?.startsWith('error:')) {
      dispatch(actions.snackbarWriteError(event.message || 'Email verification failed. Please try again.'))
    } else if (event.status) {
      dispatch(actions.snackbarWriteInfo(event.message || `Email verification status: ${event.status}`))
    }
  }

  if (event.returnRoute && event.returnRoute.startsWith('/') && !event.returnRoute.startsWith('//')) {
    dispatch(actions.appBrowserSwitchPage(event.returnRoute))
  }
}

const broadcastBrowserEvent = (event: TAppBrowserEvent) => {
  try {
    window.localStorage.setItem(APP_BROWSER_EVENT_KEY, JSON.stringify({ ...event, timestamp: Date.now() }))
    window.localStorage.removeItem(APP_BROWSER_EVENT_KEY)
  } catch {
    // Ignore storage errors in private or restricted browser modes.
  }
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const appState = useSelector((state: RootState) => state.app)
  const app = new StateApp(appState)
  const themeState = useSelector((state: RootState) => state.theme)

  // Bootstrap the app from server
  useEffect(() => {
    const persistedThemeMode = get_cookie<TThemeMode>(THEME_MODE) || Config.DEFAULT_THEME_MODE
    Config.write(THEME_MODE, persistedThemeMode)
    document.cookie = `${THEME_MODE}=${persistedThemeMode}; path=/; max-age=31536000; SameSite=Lax`

    /** Get state from server. */
    const onPostReqHomePageState = () => {
      const key = get_bootstrap_key()
      if (!key) { return }
      const bootstrapAttempts = Config.read<number>(BOOTSTRAP_ATTEMPTS, 0)
      if (bootstrapAttempts < ALLOWED_ATTEMPTS) {
        dispatch(bootstrap_app(`state/${key}`))
        Config.write(BOOTSTRAP_ATTEMPTS, bootstrapAttempts + 1)
      }
    }
    // Get bootstrap state from server if none was provided.
    // Setting `fetchingStateAllowed` to `false` will prevent this.
    if (app.fetchingStateAllowed && !app.isBootstrapped) {
      onPostReqHomePageState()
    }

    initialize()
  }, [dispatch, app.fetchingStateAllowed, app.isBootstrapped])

  // Handle redirect-driven state changes from external browser flows.
  useEffect(() => {
    const url = new URL(window.location.href)
    const oauthStatus = url.searchParams.get('patreon_oauth')
    const emailVerificationStatus = url.searchParams.get('email_verification')
    const returnRoute = url.searchParams.get('return_route')
    const message = url.searchParams.get('message') ?? undefined

    let event: TAppBrowserEvent | null = null

    if (oauthStatus) {
      event = {
        kind: 'patreon_oauth',
        status: oauthStatus,
        returnRoute: returnRoute ?? undefined,
      }
    } else if (emailVerificationStatus) {
      event = {
        kind: 'email_verification',
        status: emailVerificationStatus,
        message,
        returnRoute: returnRoute ?? `/${EP_AUTH.CLIENT_IN}`,
      }
    }

    if (!event && !returnRoute) { return }

    if (event) {
      applyBrowserEvent(dispatch, event)
      broadcastBrowserEvent(event)
    } else if (returnRoute) {
      applyBrowserEvent(dispatch, {
        kind: 'email_verification',
        returnRoute,
      })
    }

    url.searchParams.delete('patreon_oauth')
    url.searchParams.delete('email_verification')
    url.searchParams.delete('return_route')
    url.searchParams.delete('message')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }, [dispatch])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== APP_BROWSER_EVENT_KEY || !event.newValue) {
        return
      }

      try {
        const appEvent = JSON.parse(event.newValue) as TAppBrowserEvent
        if (appEvent?.kind) {
          applyBrowserEvent(dispatch, appEvent)
        }
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [dispatch])

  // Update browser URL when user switches pages
  useEffect(() => {
    const currentRoute = app.route
    if (currentRoute && window.location.pathname !== currentRoute) {
      // Use pushState to add to browser history for proper back/forward navigation
      window.history.pushState(null, '', currentRoute)
    }
  }, [app.route])

  if (app.isBootstrapped || !app.fetchingStateAllowed) {
    return (
      <ThemeProvider theme={createTheme(themeState)}>
        <CssBaseline />
        <Suspense fallback={<SpinnerBootstrap instance={app} />}>
          <AppGeneric instance={app} />
        </Suspense>
        <Spinner />
      </ThemeProvider>
    )
  } else {
    return (
      <ThemeProvider theme={createTheme(themeState)}>
        <CssBaseline />
        <SpinnerBootstrap instance={app} />
      </ThemeProvider>
    )
  }
}
