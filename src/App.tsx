import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState, initialize } from './state'
import { post_req_state } from './state/net.actions'
import Config from './config'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppPage from './components/app.cpn'
import {
  ALLOWED_ATTEMPTS,
  BOOTSTRAP_ATTEMPTS,
  THEME_DEFAULT_MODE,
  THEME_MODE
} from '@tuber/shared'
import { get_bootstrap_key, get_cookie } from './business.logic/parsing'
import StateAllPages from './controllers/StateAllPages'
import StateApp from './controllers/StateApp'

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const appState = useSelector((state: RootState) => state.app)
  const app = new StateApp(appState)
  const allPages = new StateAllPages(
    useSelector((state: RootState) => state.pages)
  )
  const themeState = useSelector((state: RootState) => state.theme)

  // Bootstrap the app from server
  useEffect(() => {
    /** Get state from server. */
    const onPostReqHomePageState = () => {
      const key = get_bootstrap_key()
      if (!key) { return }
      const bootstrapAttempts = Config.read<number>(BOOTSTRAP_ATTEMPTS, 0)
      if (bootstrapAttempts < ALLOWED_ATTEMPTS) {
        dispatch(post_req_state(`state/${key}`, {}))
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
  }, [dispatch, app.fetchingStateAllowed, app.isBootstrapped])

  // Update browser URL when user switches pages
  useEffect(() => {
    const currentRoute = app.route
    if (currentRoute && window.location.pathname !== currentRoute) {
      // Use pushState to add to browser history for proper back/forward navigation
      window.history.pushState(null, '', currentRoute)
    }
  }, [app.route])

  return (
    <ThemeProvider theme={createTheme(themeState)}>
      <CssBaseline />
      <AppPage instance={allPages} app={app} />
    </ThemeProvider>
  )
}
