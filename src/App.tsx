import { lazy, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  type AppDispatch,
  type RootState,
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
  THEME_MODE
} from '@tuber/shared'
import { get_bootstrap_key, get_cookie } from './business.logic/parsing'
import StateApp from './controllers/StateApp'
import Spinner from './mui/spinner.cpn'
import { StateNet } from './controllers'

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const netState = useSelector((state: RootState) => state.net)
  const token = useMemo(() => new StateNet(netState).token, [netState])
  const appState = useSelector((state: RootState) => state.app)
  const app = new StateApp(appState)
  const themeState = useSelector((state: RootState) => state.theme)

  // Bootstrap the app from server
  useEffect(() => {
    /** Get state from server. */
    const onPostReqHomePageState = () => {
      const key = get_bootstrap_key()
      if (!key) { return }
      const bootstrapAttempts = Config.read<number>(BOOTSTRAP_ATTEMPTS, 0)
      if (bootstrapAttempts < ALLOWED_ATTEMPTS) {
        dispatch({ type: 'app/appRequestStart' })
        dispatch({ type: 'app/appShowSpinner' })
        dispatch(bootstrap_app(`state/${key}`, token))
        dispatch({ type: 'app/appHideSpinner' })
        Config.write(BOOTSTRAP_ATTEMPTS, bootstrapAttempts + 1)
      }
    }
    // Get bootstrap state from server if none was provided.
    // Setting `fetchingStateAllowed` to `false` will prevent this.
    if (app.fetchingStateAllowed && !app.isBootstrapped) {
      onPostReqHomePageState()
    }

    Config.write(THEME_MODE, get_cookie('mode') || THEME_DEFAULT_MODE)
    initialize()
  }, [dispatch, app.fetchingStateAllowed, app.isBootstrapped, token])

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
        <AppGeneric instance={app} />
        <Spinner />
      </ThemeProvider>
    )
  }

  return null
}
