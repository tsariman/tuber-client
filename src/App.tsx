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
  THEME_DEFAULT_MODE,
  THEME_MODE,
  type TThemeMode
} from '@tuber/shared'
import { get_bootstrap_key, get_cookie } from './business.logic/parsing'
import StateApp from './controllers/StateApp'
import Spinner from './mui/spinner.cpn'
import SpinnerBootstrap from './mui/spinner.cpn.bootstrap'

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const appState = useSelector((state: RootState) => state.app)
  const app = new StateApp(appState)
  const themeState = useSelector((state: RootState) => state.theme)

  // Bootstrap the app from server
  useEffect(() => {
    Config.write(THEME_MODE, get_cookie<TThemeMode>(THEME_MODE) ?? THEME_DEFAULT_MODE)

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

  // Handle Patreon OAuth callback status from query params.
  useEffect(() => {
    const url = new URL(window.location.href)
    const oauthStatus = url.searchParams.get('patreon_oauth')
    if (!oauthStatus) { return }

    if (oauthStatus === 'connected') {
      dispatch(actions.snackbarWriteSuccess('Patreon account connected successfully.'))
    } else if (oauthStatus === 'error:not_configured') {
      dispatch(actions.snackbarWriteError('Patreon OAuth is not configured in this environment yet.'))
    } else if (oauthStatus === 'error:patreon_already_linked') {
      dispatch(actions.snackbarWriteError('That Patreon account is already linked to another user.'))
    } else if (oauthStatus.startsWith('error:')) {
      dispatch(actions.snackbarWriteError('Patreon connection failed. Please try again.'))
    } else {
      dispatch(actions.snackbarWriteInfo(`Patreon OAuth status: ${oauthStatus}`))
    }

    url.searchParams.delete('patreon_oauth')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
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
