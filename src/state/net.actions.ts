import type { Dispatch } from 'redux'
import { get_themed_state, get_val } from '../business.logic/utility'
import {
  get_origin_ending_fixed,
  get_query_starting_fixed,
  get_endpoint,
  get_origin_ending_cleaned
} from '../business.logic/parsing'
import { error_id } from '../business.logic/errors'
import net_default_200_driver from './net.default.200.driver.c'
import net_default_201_driver from './net.default.201.driver.c'
import net_default_400_driver from './net.default.400.driver.c'
import net_default_401_driver from './net.default.401.driver.c'
import net_default_404_driver from './net.default.404.driver.c'
import net_default_409_driver from './net.default.409.driver.c'
import net_default_500_driver from './net.default.500.driver.c'
import {
  appHideSpinner,
  appRequestFailed,
  appRequestStart
} from '../slices/app.slice'
import type { IRedux, RootState } from '.'
import { cancel_spinner, schedule_spinner } from './spinner'
import StateNet from '../controllers/StateNet'
import StateRegistry from '../controllers/StateRegistry'
import Config from '../config'
import { net_patch_state } from './actions'
import { ler, pre } from '../business.logic/logging'
import {
  THEME_DEFAULT_MODE,
  THEME_MODE,
  type IJsonapiBaseResponse,
  type IJsonapiError,
  type IStateDialog,
  type TThemeMode
} from '@tuber/shared'

const DEFAULT_HEADERS: RequestInit['headers'] = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

/**
 * Handles errors.
 *
 * This is the one-stop shop for errors generated here, client-side, based on the
 * browser's interpretation of the response.
 * __Note__: The errors handled here are different from those generated
 * server-side. These would typically be considered a valid response and would
 * be handled by another function ($delegate_data_handling).
 */
const $delegate_error_handling = (dispatch: Dispatch) => {
  cancel_spinner()
  dispatch(appHideSpinner())
  dispatch(appRequestFailed())
}

/** Handles (arguably) successful responses. */
const $delegate_data_handling = (
  dispatch: Dispatch,
  getState: () => RootState,
  endpoint: string,
  json: IJsonapiBaseResponse
) => {
  const status = json.meta?.status as number ?? 500
  const defaultDriver: { [key: number]: () => void } = {
    200: () => net_default_200_driver(dispatch, getState, endpoint, json),
    201: () => net_default_201_driver(dispatch, getState, endpoint, json),
    400: () => net_default_400_driver(dispatch, getState, endpoint, json),
    401: () => net_default_401_driver(dispatch, getState, endpoint, json),
    404: () => net_default_404_driver(dispatch, getState, endpoint, json),
    409: () => net_default_409_driver(dispatch, getState, endpoint, json),
    // TODO - 422 Unprocessable Entity
    // TODO - 429 Too Many Requests, etc.
    500: () => net_default_500_driver(dispatch, getState, endpoint, json),
  }
  try {
    // Handle the JSON response here.
    switch (json.driver) {

      // TODO Define custom ways of handling the response here.

      default:
        defaultDriver[status]()
    }
  } catch (e) {
    error_id(28).remember_exception(e) // error 28
  }
  cancel_spinner()
  dispatch(appHideSpinner())
}

/** Helper to get JSON from a response, handling 204 No Content. */
const $get_json = async <T = unknown>(
  response: Response,
): Promise<T> => {
  return (response.status === 204 ? {} : await response.json()) as T
}

/**
 * Get dialog state from the server.
 *
 * @param redux Redux store, actions, etc.
 * @param registryKey The key to look up the dialog in the registry.
 * @returns The dialog state or null if not found.
 */
export async function get_dialog_state <T=unknown>(
  redux: IRedux,
  registryKey: string
): Promise<IStateDialog<T>|null> {
  pre('get_dialog_state():')
  const rootState = redux.store.getState()
  const staticRegistry = rootState.staticRegistry
  const dialogKey = new StateRegistry(staticRegistry).get(registryKey)
  if (typeof dialogKey !== 'string') {
    error_id(35).report_missing_dialog_key(registryKey) // error 35
    return null
  }
  const themeMode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
  const dialogActiveState = rootState.dialogs[dialogKey]
  const dialogLightState = rootState.dialogsLight[dialogKey]
  const dialogDarkState = rootState.dialogsDark[dialogKey]
  if (!dialogLightState || !dialogDarkState) {
    ler(`get_dialog_state: ${dialogKey} missing light and/or dark themes.`)

    // TODO This is a false alarm - the missing light/dark state may be
    //       expected in some cases and should not always trigger an error.
    //       Consider revising this logic to only report a real missing state. 
    error_id(36).remember_error({
      code: 'MISSING_STATE',
      title: `${dialogKey} Not Found`,
      detail: `${dialogKey} missing light and/or dark themes.`,
      source: { pointer: dialogKey }
    }) // error 36
  }
  const dialogState = get_themed_state<IStateDialog<T>>(
    themeMode,
    dialogActiveState,
    dialogLightState,
    dialogDarkState
  )
  if (dialogState) { return dialogState }
  const origin = get_origin_ending_fixed(rootState.app.origin)
  const dialogPathname = rootState.pathnames.dialogs
  const url = `${origin}${dialogPathname}`
  const headersState = new StateNet(rootState.net).headers
  const response = await post_fetch(url, {
    'key': dialogKey,
    'theme_mode': themeMode
  }, headersState)
  const errors = get_val<IJsonapiError[]>(response, 'errors')
  if (errors) {
    ler(`get_dialog_state: ${errors[0].title}`)
    error_id(38).remember_jsonapi_errors(errors) // error 38
    return null
  }
  const main = get_val(response, `state.dialogs.${dialogKey}`)
  const light = get_val(response, `state.dialogsLight.${dialogKey}`)
  const dark = get_val(response, `state.dialogsDark.${dialogKey}`)
  
  if (!main) error_id(39).report_missing_dialog_state(dialogKey) // error 39
  if (!light) error_id(40).report_missing_dialog_light_state(dialogKey) // error 40
  if (!dark) error_id(41).report_missing_dialog_dark_state(dialogKey) // error 41
  const themedDialogState = get_themed_state<IStateDialog<T>>(
    themeMode,
    main,
    light,
    dark
  )
  if (themedDialogState._key !== dialogKey) {
    ler(`get_dialog_state: ${dialogKey} does not match ${themedDialogState._key}.`)
    error_id(37).remember_error({
      code: 'BAD_VALUE',
      title: `${dialogKey} Not Found`,
      detail: `${dialogKey} does not match ${themedDialogState._key}.`,
      source: { pointer: dialogKey }
    }) // error 37
    return null
  }

  const state = get_val(response, 'state')
  if (state) {
    redux.store.dispatch(net_patch_state(state))
  }

  return themedDialogState
} // END - get_dialog_state

/**
 * Performs a POST request with JSON body.
 *
 * @param url The URL to send the request to.
 * @param body The data to send in the request body.
 * @param customHeaders Additional headers to include in the request.
 * @returns The JSON response from the server.
 */
export async function post_fetch<T=unknown>(
  url: string,
  body: T,
  customHeaders?: RequestInit['headers']
): Promise<unknown> {
  const headers = { ...DEFAULT_HEADERS, ...customHeaders }
  const response = await fetch(url, {
    method: 'post',
    headers,
    credentials: 'include',
    body: JSON.stringify(body)
  })
  const json = await response.json()
  return json
}

/**
 * Performs a GET request.
 *
 * @param url The URL to send the request to.
 * @returns The JSON response from the server.
 */
export async function get_fetch<T=unknown>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'get',
    headers: DEFAULT_HEADERS,
    credentials: 'include'
  })
  const json = await response.json()
  return json as T
}

/**
 * Makes a POST request to update the Redux store.
 *
 * TODO Implement the PUT request version of this function. Or just fully
 * implement all HTTP verbs. PATCH, DELETE, OPTIONS, HEAD.
 *
 * @param endpoint Usually an entity name. Otherwise, it's a valid URI endpoint.
 *                 e.g., `users`
 * @param body The data you want to send to the server. e.g., form data.
 * @param customHeaders Additional headers to include in the request.
 * @returns A Redux thunk action.
 */
export const post_req_state = (
  endpoint: string,
  body: unknown,
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState = getState()
      const origin = get_origin_ending_fixed(rootState.app.origin)
      const url = `${origin}${endpoint}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState, ...customHeaders }
      const response = await fetch(url, {
        method: 'post',
        headers,
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const json = await $get_json<IJsonapiBaseResponse>(response)
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      $delegate_data_handling(dispatch, getState, endpoint, json)
    } catch (e) {
      error_id(29).remember_exception(e) // error 29
      $delegate_error_handling(dispatch)
    }
  }
}

/**
 * Makes a PATCH request to update the Redux store.
 *
 * @param endpoint Usually an entity name. Otherwise, it's a valid URI endpoint.
 * @param body The data you want to send to the server.
 * @param customHeaders Additional headers to include in the request.
 * @returns A Redux thunk action.
 */
export const patch_req_state = (
  endpoint: string,
  body?: unknown,
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState = getState()
      const origin = get_origin_ending_fixed(rootState.app.origin)
      const url = `${origin}${endpoint}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState, ...customHeaders }
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const json = await $get_json<IJsonapiBaseResponse>(response)
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      $delegate_data_handling(dispatch, getState, endpoint, json)
    } catch (e) {
      error_id(30).remember_exception(e) // error 30
      $delegate_error_handling(dispatch)
    }
  }
}

/**
 * Makes a PUT request using Fetch to update the Redux store.
 *
 * @param endpoint Usually an entity name. Otherwise, it's a valid URI endpoint.
 * @param body The data you want to send to the server.
 * @param customHeaders Additional headers to include in the request.
 * @returns A Redux thunk action.
 */
export const put_req_state = (
  endpoint: string,
  body?: unknown,
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState = getState()
      const origin = get_origin_ending_fixed(rootState.app.origin)
      const url = `${origin}${endpoint}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState, ...customHeaders }
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const json = await $get_json<IJsonapiBaseResponse>(response)
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      $delegate_data_handling(dispatch, getState, endpoint, json)
    } catch (e) {
      error_id(48).remember_exception(e) // error 48
      $delegate_error_handling(dispatch)
    }
  }
}

/**
 * Makes a `GET` request to update the Redux store.
 *
 * @param endpoint Usually a collection name. Otherwise, it's a valid URI endpoint.
 *                 e.g., `users`
 * @param args URL query strings e.g., '?id=123'
 *             It must be a valid query string; therefore, the interrogation
 *             point is required.
 * @param customHeaders Additional headers to include in the request.
 * @returns A Redux thunk action.
 */
export const get_req_state = (
  endpoint: string,
  args = '',
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState  = getState()
      const origin = get_origin_ending_fixed(rootState.app.origin)
      const query  = get_query_starting_fixed(args)
      const uri = `${origin}${endpoint}${query}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState, ...customHeaders }
      const response = await fetch(uri, {
        method: 'get',
        headers,
        credentials: 'include'
      })
      const json = await response.json() as IJsonapiBaseResponse
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      $delegate_data_handling(dispatch, getState, endpoint, json)
    } catch (e) {
      error_id(31).remember_exception(e) // error 31
      $delegate_error_handling(dispatch)
    }
  }
}

/**
 * Makes a DELETE request to update the Redux store.
 *
 * @param endpoint Usually a collection name. Otherwise, it's a valid URI endpoint.
 * @param args URL query strings.
 * @param customHeaders Additional headers to include in the request.
 * @returns A Redux thunk action.
 */
export const delete_req_state = (
  endpoint: string,
  args = '',
  customHeaders?: Record<string, string>
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState = getState()
      const origin = get_origin_ending_cleaned(rootState.app.origin)
      const query  = get_query_starting_fixed(args)
      const uri = `${origin}/${endpoint}${query}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState, ...customHeaders }
      const response = await fetch(uri, {
        method: 'delete',
        headers,
        credentials: 'include',
        body: JSON.stringify({})
      })
      const json = await $get_json<IJsonapiBaseResponse>(response)
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      $delegate_data_handling(dispatch, getState, endpoint, json)
      return {
        ok: response.ok,
        status: response.status
      }
    } catch (e) {
      error_id(32).remember_exception(e) // error 32
      $delegate_error_handling(dispatch)
      return {
        ok: false,
        status: 0
      }
    }
  }
}

/**
 * Makes a `PUT` request to server and handle the response yourself.
 *
 * @param endpoint Usually a collection name. Otherwise, it's a valid URI endpoint.
 * @param body Data (an object) to be sent to the server.
 * @param success Callback to receive a legitimate server response if there is
 *                one.
 * @param failure Callback for a failed request with no proper server response.
 * @returns A Redux thunk action.
 */
export const put_req = (endpoint: string,
  body: unknown,
  success?: (state: IJsonapiBaseResponse, endpoint: string) => void,
  failure?: (error: unknown) => void
) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(appRequestStart())
  schedule_spinner()
  try {
    const rootState = getState()
    const origin = get_origin_ending_fixed(rootState.app.origin)
    const url = `${origin}${endpoint}`
    const headersState = new StateNet(rootState.net).headers
    const headers = { ...DEFAULT_HEADERS, ...headersState }
    const response = await fetch( url, {
      method: 'put',
      headers,
      body: JSON.stringify(body),
      credentials: 'include'
    })
    const json = await $get_json<IJsonapiBaseResponse>(response)
    json.meta ??= {}
    json.meta.status = response.status
    json.meta.statusText = response.statusText
    json.meta.ok = response.ok
    if (success) {
      success(json, endpoint)
      cancel_spinner()
      dispatch(appHideSpinner())
    } else {
      $delegate_data_handling(dispatch, getState, endpoint, json)
    }
  } catch (e) {
    error_id(49).remember_exception(e) // error 49
    if (failure) {
      failure(e)
      cancel_spinner()
      dispatch(appHideSpinner())
    } else {
      $delegate_error_handling(dispatch)
    }
  }
}

/**
 * Makes a `POST` request to server and handle the response yourself.
 *
 * @param endpoint Slash-separated URL params only e.g., `param1/param2/`
 * @param body Data (an object) to be sent to the server.
 * @param success Callback to receive a legitimate server response if there is
 *                one.
 * @param failure Callback for a failed request with no proper server response.
 * @returns A Redux thunk action.
 */
export const post_req = (
  endpoint: string,
  body: unknown,
  success?: (state: IJsonapiBaseResponse, endpoint: string) => void,
  failure?: (error: unknown) => void
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState = getState()
      const origin = get_origin_ending_fixed(rootState.app.origin)
      const url = `${origin}${endpoint}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState }
      const response = await fetch( url, {
        method: 'post',
        headers,
        body: JSON.stringify(body),
        credentials: 'include'
      })
      const json = await $get_json<IJsonapiBaseResponse>(response)
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      if (response.ok) {
        if (success) {
          success(json, endpoint)
          cancel_spinner()
          dispatch(appHideSpinner())
        }
        else {
          $delegate_data_handling(dispatch, getState, endpoint, json)
        }
        return
      } else if (response.status >= 400) {
        if (failure) {
          failure(json)
          cancel_spinner()
          dispatch(appHideSpinner())
        } else {
          $delegate_data_handling(dispatch, getState, endpoint, json)
        }
        return
      } else {
        $delegate_error_handling(dispatch)
        return
      }
    } catch (e) {
      error_id(33).remember_exception(e) // error 33
      if (failure) {
        failure(e)
        cancel_spinner()
        dispatch(appHideSpinner())
      } else {
        $delegate_error_handling(dispatch)
      }
    }
  }
}

/**
 * Makes a `GET` request to server by providing your own callbacks to handle
 * the response.
 *
 * @param pathname Slash-separated URL params only e.g., `param1/param2/`
 * @param success Callback to receive a legitimate server response if there is
 *                one.
 * @param failure Callback for a failed request with no proper server response.
 * @returns A Redux thunk action.
 */
export const get_req = <T = unknown>(
  pathname: string,
  success?: (endpoint: string, payload: T) => void,
  failure?: (error: unknown) => void
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart())
    schedule_spinner()
    try {
      const rootState = getState()
      const originEndingFixed = get_origin_ending_fixed(rootState.app.origin)
      const url = `${originEndingFixed}${pathname}`
      const headersState = new StateNet(rootState.net).headers
      const headers = { ...DEFAULT_HEADERS, ...headersState }
      const response = await fetch(url, {
        method: 'get',
        credentials: 'include',
        headers
      })
      const json = await $get_json<IJsonapiBaseResponse>(response)
      json.meta ??= {}
      json.meta.status = response.status
      json.meta.statusText = response.statusText
      json.meta.ok = response.ok
      if (response.ok) {
        const endpoint = get_endpoint(pathname)
        if (success) {
          success(endpoint, json as T)
          cancel_spinner()
          dispatch(appHideSpinner())
        } else {
          $delegate_data_handling(dispatch, getState, endpoint, json as IJsonapiBaseResponse)
        }
      } else if (failure) {
        failure(json)
        cancel_spinner()
        dispatch(appHideSpinner())
      } else if (response.status >= 400) {
        const endpoint = get_endpoint(pathname)
        $delegate_data_handling(dispatch, getState, endpoint, json as IJsonapiBaseResponse)
      } else {
        $delegate_error_handling(dispatch)
      }
    } catch (e) {
      error_id(34).remember_exception(e) // error 34
      if (failure) { failure(e) } else { $delegate_error_handling(dispatch) }
    }
  }
}
