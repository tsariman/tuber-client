import { configureStore, type PayloadAction } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
// import logger from 'redux-logger'// TODO Uncomment when debugging Redux
import infoReducer, { appActions } from '../slices/app.slice'
import appbarReducer, { appbarActions } from '../slices/appbar.slice'
import iconsReducer, { iconsActions } from '../slices/icons.slice'
import metaReducer, { metaActions } from '../slices/meta.slice'
import appbarQueriesReducer, { appbarQueriesActions } from '../slices/appbarQueries.slice'
import backgroundReducer, { backgroundActions } from '../slices/background.slice'
import typographyReducer, { typographyActions } from '../slices/typography.slice'
import dialogReducer, { dialogActions } from '../slices/dialog.slice'
import dialogsReducer, { dialogsAction } from '../slices/dialogs.slice'
import drawerReducer, { drawerActions } from '../slices/drawer.slice'
import formsReducer, { formsActions } from '../slices/forms.slice'
import pagesReducer, { pagesActions } from '../slices/pages.slice'
import dataReducer, { dataActions } from '../slices/data.slice'
import includedReducer, { includedActions } from '../slices/included.slice'
import dataLoadedPagesSlice, { dataLoadedPagesActions } from '../slices/dataLoadedPages.slice'
import errorsReducer, { errorsActions } from '../slices/errors.slice'
import pagesDataReducer, { pagesDataActions } from '../slices/pagesData.slice'
import formsDataReducer, { formsDataActions } from '../slices/formsData.slice'
import formsDataErrorsReducer, { formsDataErrorsActions } from '../slices/formsDataErrors.slice'
import snackbarReducer, { snackbarActions } from '../slices/snackbar.slice'
import tmpReducer, { tmpActions } from '../slices/tmp.slice'
import topLevelLinksReducer, { topLevelLinksActions } from '../slices/topLevelLinks.slice'
import themeReducer, { themeActions } from '../slices/theme.slice'
import netReducer, { netActions } from '../slices/net.slice'
import pathnamesReducer, { pathnamesActions } from '../slices/pathnames.slice'
import staticRegistryReducer, { staticRegistryActions } from '../slices/staticRegistry.slice'
import dynamicRegistryReducer, { dynamicRegistryActions } from '../slices/dynamicRegistry.slice'
import dialogsLightReducer, { dialogsLightActions } from '../slices/dialogsLight.slice'
import dialogsDarkReducer, { dialogsDarkActions } from '../slices/dialogsDark.slice'
import formsLightReducer, { formsLightActions } from '../slices/formsLight.slice'
import formsDarkReducer, { formsDarkActions } from '../slices/formsDark.slice'
import pagesLightReducer, { pagesLightActions } from '../slices/pagesLight.slice'
import pagesDarkReducer, { pagesDarkActions } from '../slices/pagesDark.slice'
import themeLightReducer, { themeLightActions } from '../slices/themeLight.slice'
import themeDarkReducer, { themeDarkActions } from '../slices/themeDark.slice'
import chipsReducer, { chipsActions } from '../slices/chips.slice'
import {
  DRAWER_DEFAULT_WIDTH,
  NET_STATE_PATCH,
  NET_STATE_PATCH_DELETE,
  STATE_RESET,
  type IJsonapiStateResponse,
  type TEventHandler,
  type TO
} from '@tuber/shared'
import type { IState, TNetState } from '../interfaces/localized'
import Config from '../config'
import initialState from './initial.state'
import { clear_last_content_jsx } from '../business.logic/cache'
import { get_origin_ending_cleaned, set_val } from '../business.logic/parsing'

const appReducer = combineReducers({
  app: infoReducer,
  appbar: appbarReducer,
  appbarQueries: appbarQueriesReducer,
  background: backgroundReducer,
  icons: iconsReducer,
  data: dataReducer,
  dataPagesRange: dataLoadedPagesSlice,
  included: includedReducer,
  dialog: dialogReducer,
  dialogs: dialogsReducer,
  dialogsLight: dialogsLightReducer,
  dialogsDark: dialogsDarkReducer,
  drawer: drawerReducer,
  errors: errorsReducer,
  forms: formsReducer,
  formsLight: formsLightReducer,
  formsDark: formsDarkReducer,
  formsData: formsDataReducer,
  formsDataErrors: formsDataErrorsReducer,
  meta: metaReducer,
  net: netReducer,
  pages: pagesReducer,
  pagesLight: pagesLightReducer,
  pagesDark: pagesDarkReducer,
  pagesData: pagesDataReducer,
  chips: chipsReducer,
  snackbar: snackbarReducer,
  theme: themeReducer,
  themeLight: themeLightReducer,
  themeDark: themeDarkReducer,
  tmp: tmpReducer,
  topLevelLinks: topLevelLinksReducer,
  typography: typographyReducer,
  pathnames: pathnamesReducer,
  staticRegistry: staticRegistryReducer,
  dynamicRegistry: dynamicRegistryReducer
})

/**
 * Merges fragment state received from server into the current redux state.
 *
 * @param oldState current redux state
 * @param fragment piece of state received from server
 *
 * @returns RootState
 *
 * [TODO] Write a unit test for this function
 */
const net_patch_state_reducer = <T=unknown>($oldState: unknown, $fragment: unknown): T => {
  const state = { ...($oldState as TO) }
  const fragment = $fragment as TO
  try {
    for (const prop of Object.keys(fragment)) {
      const newStateVal = fragment[prop]
      switch (typeof newStateVal) {
      case 'undefined':
        state[prop] = undefined
        break
      case 'object':
        if (newStateVal === null) continue
        if (!Array.isArray(newStateVal)) {
          if ((newStateVal as TO).__delete) {
            state[prop] = undefined
            clear_last_content_jsx()
            continue
          }
          state[prop] = net_patch_state_reducer(state[prop], newStateVal)
        } else {
          state[prop] = [ ...newStateVal ] // arrays are never copied deeply
        }
        break
      case 'symbol':
      case 'bigint':
      case 'number':
      case 'function':
      case 'boolean':
        state[prop] = newStateVal
        break
      case 'string':
        if (newStateVal === NET_STATE_PATCH_DELETE) { // delete state
          state[prop] = undefined
          clear_last_content_jsx()
        } else {
          state[prop] = newStateVal
        }
        break
      } // END switch

      // Runs a list of callbacks when a state with a certain id is loaded.
      if (typeof newStateVal === 'object'
        && '_id' in newStateVal
        && typeof newStateVal._id === 'string'
      ) {
        ON_NET_LOAD_HANDLER_LIST[newStateVal._id]
          ?.forEach(callback => callback(redux))
        // Delete the list of callbacks after they have been run.
        delete ON_NET_LOAD_HANDLER_LIST[newStateVal._id]
      }
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      dispatch(errorsActions.errorsAdd({ // error 27
        id: '27', 
        code: 'CAUGHT_EXCEPTION',
        title: (e as Error).message,
        detail: (e as Error).stack,
      }));
      console.error(e)
    }
  }
  return state as T
}

type TActionShell = PayloadAction<TNetState>

// https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const rootReducer = ($state: unknown, $action?: unknown) => {
  const action = $action as TActionShell
  const state = $state as IState

  if (action.type === NET_STATE_PATCH) {
    const newState = net_patch_state_reducer(state, action.payload) as IState
    Config.write('DEBUG', action.payload.app?.inDebugMode ?? false)
    Config.write('DEV', action.payload.app?.inDevelMode ?? false)
    set_val(window, 'webui.inDebugMode', Config.DEBUG)
    set_val(window, 'webui.inDevelMode', Config.DEV)

    // TODO Set more server-side configuration here.

    return appReducer(newState, action)
  }

  // Reset of the state
  if (action.type === STATE_RESET) {
    return appReducer(initialState, action)
  }

  return appReducer(state, action)
}

// https://redux-toolkit.js.org/usage/usage-with-typescript
// https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
  reducer: rootReducer,
  // preloadedState,
  // middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware()
  //   .prepend(
  //     // TODO add more middlewares here
  //   )
  //   .concat(logger) // TODO Uncomment when debugging Redux
})



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const actions = {
  ...appActions,
  ...appbarActions,
  ...appbarQueriesActions,
  ...backgroundActions,
  ...iconsActions,
  ...dataActions,
  ...dataLoadedPagesActions,
  ...includedActions,
  ...dialogActions,
  ...dialogsAction,
  ...drawerActions,
  ...errorsActions,
  ...formsActions,
  ...formsDataActions,
  ...formsDataErrorsActions,
  ...metaActions,
  ...netActions,
  ...pagesActions,
  ...pagesDataActions,
  ...chipsActions,
  ...snackbarActions,
  ...themeActions,
  ...themeLightActions,
  ...themeDarkActions,
  ...tmpActions,
  ...topLevelLinksActions,
  ...typographyActions,
  ...pathnamesActions,
  ...dialogsLightActions,
  ...dialogsDarkActions,
  ...formsLightActions,
  ...formsDarkActions,
  ...pagesLightActions,
  ...pagesDarkActions,
  ...staticRegistryActions,
  ...dynamicRegistryActions
}

export type TAllActions = typeof actions

/**
 * Ensures access to the redux store and all available redux actions,
 * even in pure javascript.
 */
export interface IRedux {
  store: typeof store
  actions: typeof actions
  /**
   * If you don't want to define a callback for your button or link,
   * you can use the href prop to set the target page. It's value should
   * then be passed to this route key.
   */
  route?: string
}

/**
 * Get Redux handler argument.
 * @param route If you need to specify the route
 */
export const get_redux = (route = ''): IRedux => ({
  store,
  actions,
  route
})

/** Redux handler argument */
export const redux: IRedux = {
  store,
  actions,
  route: ''
}

/**
 * Type for callback that needs to access the redux store and actions in
 * addition to the event object.
 */
export type TReduxHandler = (redux: IRedux) => TEventHandler
/** Type that gives access to the redux store and actions. */
export type TReduxCallback = (redux: IRedux) => void
/**
 * Type that gives access to the redux store, actions, and the response from
 * the server.
 */
export type TReduxNetCallback<T=unknown> = (
  response: T,
  redux: IRedux
) => Promise<void>

/**
 * Get the default drawer width.
 * @returns default drawer width
 */
export const get_drawer_width = (): number => {
  return store.getState().drawer.width
    ?? DRAWER_DEFAULT_WIDTH
}

/**
 * If a callback is required for a link or button but is not defined, then this
 * method will provide a dummy one.
 */
export function dummy_redux_handler ({ store }: IRedux): TEventHandler {
  return (e) => {
    e.preventDefault()
    if (store.getState().app.inDebugMode) {
      console.error('[function] dummy_redux_handler(): No callback was assigned.')
    }
  }
}

/**
 * If a link was not provided a callback, this one should be called
 * automatically.
 *
 * The app page will be updated based on the URL change triggered by the link.
 */
export function default_handler ({ store, actions, route }: IRedux): TEventHandler {
  return (e) => {
    e.preventDefault()
    if (route) {
      store.dispatch(actions.appBrowserSwitchPage(route))
      store.dispatch(actions.appStatusClear())
    }
  }
}

/**
 * Bootstrap the app by fetching state from server
 * @param endpoint endpoint to fetch state from
 * @param token authorization token
 */
export const bootstrap_app = (endpoint: string, token: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch({ type: 'app/appRequestStart' })
      const { app } = getState()
      const origin = get_origin_ending_cleaned(app.origin)
      const url = `${origin}/${endpoint}`
      const headers = { ...(token ? {'Authorization':`Bearer ${token}`} : {}) }
      const response = await fetch(url, {
        method: 'post',
        headers,
        credentials: 'include'
      })
      if (response.ok) {
        const { state } = await response.json() as IJsonapiStateResponse
        dispatch({ type: 'app/appRequestEnd' })
        dispatch({ type: NET_STATE_PATCH, payload: state })
      } else {
        dispatch({ type: 'app/appRequestFailed' })
      }
    } catch (e) {
      dispatch({ type: 'app/appRequestFailed' })
      if (import.meta.env.DEV) { console.error(e) }
    }
  }
}

/**
 * Contains all callback which were registered to run when app is initialized.
 */
const INIT_CALLBACK_LIT: {
  callback: TReduxCallback,
  maxRun?: number
}[] = []

/**
 * Register a callback to run when app is initialized.
 * @param callback callback to run when app is initialized.
 */
export const on_init_run = (callback: TReduxCallback) => {
  INIT_CALLBACK_LIT.push({ callback })
}

/**
 * Run all callbacks that were registered with `on_init_run()`.
 */
export const initialize = () => {
  INIT_CALLBACK_LIT.forEach(obj => obj.callback(redux))
}

const BOOTSTRAP_CALLBACK_LIST: {
  callback: TReduxNetCallback,
  maxRun?: number
}[] = []

/**
 * Register a callback to run when app is bootstrapped.
 * @param callback callback to run when app is bootstrapped.
 * @param maxRun maximum number of times to run the callback.
 *               If not provided, the callback will run on every bootstrap
 *               forever.
 * @returns void
 */
export const on_bootstrap_run = <T=unknown>(
  callback: TReduxNetCallback<T>,
  maxRun?: number
) => {
  (BOOTSTRAP_CALLBACK_LIST as {
    callback: TReduxNetCallback<T>,
    maxRun?: number
  }[]).push({ callback, maxRun })
}

/** Run all callbacks that were registered with onBoostrapRun(). */
export const bootstrap = (response: unknown) => {
  BOOTSTRAP_CALLBACK_LIST.forEach((obj, i) => {
    obj.callback(response, redux)
    if (obj.maxRun) {
      obj.maxRun--
      if (obj.maxRun <= 0) {
        BOOTSTRAP_CALLBACK_LIST.splice(i, 1)
      }
    }
  })
}

/** Schedule callback run */
export const schedule_callback_run = (
  time: number,
  callback: (redux: IRedux) => void
) => {
  setTimeout(() => {
    callback(redux)
  }, time)
}

interface IOnNetLoadHandlerList {
  [_id: string]: ((redux: IRedux) => void)[]
}

/** Map list of function */
const ON_NET_LOAD_HANDLER_LIST: IOnNetLoadHandlerList = {}

/** Run a list of function when a state with a certain id is loaded. */
export function on_net_load_run(
  _id: string,
  callback: (redux: IRedux) => void
) {
  ON_NET_LOAD_HANDLER_LIST[_id] = ON_NET_LOAD_HANDLER_LIST[_id] ?? []
  ON_NET_LOAD_HANDLER_LIST[_id].push(callback)
}
/** Reads the state tree managed by the store. */
export const get_state = (): RootState => store.getState()
/** Dispatches an action. It is the only way to trigger a state change. */
export const dispatch: typeof store.dispatch = store.dispatch.bind(store)
/** Adds a change listener. */
export const subscribe: typeof store.subscribe = store.subscribe.bind(store)

export default store
