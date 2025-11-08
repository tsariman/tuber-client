import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import store from './state'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}><App /></Provider>
  </StrictMode>,
)

// A solution to make the browser's forward and back buttons work.
window.addEventListener('popstate', () => {
  store.dispatch({
    type: 'app/appBrowserSwitchPage',
    payload: window.location.pathname
  })
})