import {
  delete_req_state,
  get_dialog_state,
  get_req_state,
  post_req_state
} from 'src/state/net.actions'
import { type IRedux } from 'src/state'
import {
  dev_create_bookmark_search_index,
  dev_get_bookmarks_callback
} from './dev.bookmarks.200'
import { get_parsed_content, get_state_form_name } from 'src/business.logic/parsing'
import { error_id } from 'src/business.logic/errors'
import dev_get_video_thumbnail from './dev.get.video.thumbnail'
import {
  FORM_RUMBLE_URL_REGEX_ID,
  FORM_UNKNOWN_URL_REGEX_ID,
  FORM_TWITCH_CLIENT_ID_ID,
  FORM_SAVE_CONFIG_VALUE_ID,
  PAGE_SAVE_CONFIG_VALUE_ID,
} from '../tuber.config'
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy'
import type { YouTubePlayer } from 'react-youtube'
import { safely_get_as } from 'src/business.logic/utility'
import Config from 'src/config'
import type { TPlatform } from '../tuber.interfaces'
import { pre } from 'src/business.logic/logging'
import JsonapiRequest from 'src/business.logic/JsonapiRequest'
import { get_registry_val } from './_callbacks.common.logic'
import { ReportError } from 'src/business.logic'

/**
 * [ __YouTube__ ] Shows a dialog containing a form to create a new bookmark.
 *
 * @id 6
 */
export function dev_dialog_new_youtube_bookmark_from_video(redux: IRedux) {
  return async () => {
    const { store: { dispatch } } = redux
    pre('dev_dialog_new_youtube_bookmark_from_video():')
    const dialogState = await get_dialog_state(redux, '6')
    if (!dialogState) { return }
    const player = Config.read<YouTubePlayer>('player')
    try {
      const content = get_parsed_content(dialogState.content)
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'start_seconds',
          value: Math.floor(await player.getCurrentTime())
        }
      })
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'videoid',
          value: Config.read<string>('videoid')
        }
      })
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'platform',
          value: Config.read<TPlatform>('platform')
        }
      })
    } catch (e) { error_id(1035).remember_exception(e) /* error 1035 */ }
    if (redux.store.getState().dialog._id !== dialogState._id) { // if the dialog was NOT mounted
      dispatch({ type: 'dialog/dialogMount', payload: dialogState })
    } else {
      dispatch({ type: 'dialog/dialogOpen' })
    }
  }
}

/** @deprecated */
function dev_create_user(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('dev/user', {
      'message': 'Hello from the other side'
    }))
  }
}

/** @deprecated */
function dev_reset_database(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('dev/database-reset', {
      'message': 'Hello from client. I hope everything is okay.'
    }))
  }
}

/** @deprecated */
function dev_load_drawer(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('dev/load-test-drawer', {
      'message': 'Testing partial page load'
    }))
  }
}

/** @deprecated */
function dev_unload_drawer(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('dev/unload-test-drawer', {}))
  }
}

function dev_clipboard_test(redux: IRedux) {
  return async () => {
    let value: string
    try {
      value = await navigator.clipboard.readText()
    } catch (e) {
      value = (e as Error).message
       // error 1036
      ReportError.withId(1036).as.exception(e, `dev_clipboard_test: ${value}`)
    }
    redux.store.dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: 'devInstallForm',
        name: 'clipboard-test',
        value
      }
    })
  }
}

function dev_user_add(redux: IRedux) {
  void redux
  return async () => {
    // [TODO] Implement to add functionality to add a user when the button is
    //        clicked.
  }
}

function dev_user_populate(redux: IRedux) {
  void redux
  return async () => {
    // [TODO] Implement to add functionality to populate the user list when the
    //        button is clicked.
  }
}

function dev_no_response(redux: IRedux) {
  return async () => {
    const { store: { dispatch } } = redux
    dispatch(get_req_state('dev/no-response/30000'))
  }
}

function dev_drop_collection(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const collection = safely_get_as<string>(
      getState(),
      'formsData.devInstallForm.drop-collection',
      ''
    )
    if (!collection) { return }
    dispatch(delete_req_state(`dev/drop-collection/${collection}`))
  }
}

function dev_populate_collection(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const collection = safely_get_as<string>(
      getState(),
      'formsData.devInstallForm.populate-collection',
      ''
    )
    const quantity = safely_get_as<number>(
      getState(),
      'formsData.devInstallForm.population-quantity',
      0
    )
    if (!collection || !quantity) {
      return
    }
    dispatch(post_req_state(
      `dev/populate-collection`,
      {
        collection,
        quantity
      }
    ))
  }
}

function dev_form_submit_rumble_regex(redux: IRedux) {
  return async () => {
    pre('dev_form_submit_rumble_regex():')
    const { store: { dispatch, getState } } = redux
    const rootState = getState()
    const { headers } = rootState.net
    const formName = get_registry_val(rootState, FORM_RUMBLE_URL_REGEX_ID)
    if (!formName) { return }
    const formData = safely_get_as<Record<string, string>>(
      rootState.formsData,
      formName,
      {}
    )
    pre()
    dispatch(post_req_state('dev/rumble/regexp', {
      regexp: formData.regexp,
      url: formData.url
    }, headers))
    dispatch({ type: 'formsData/formsDataClear' })
  }
}

function dev_form_submit_unknown_regex(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const rootState = getState()
    const { headers } = rootState.net
    pre('dev_form_submit_unknown_regex():')
    const formName = get_registry_val(rootState, FORM_UNKNOWN_URL_REGEX_ID)
    if (!formName) { return }
    const formData = safely_get_as<Record<string, string>>(
      rootState.formsData,
      formName,
      {}
    )
    pre()
    dispatch(post_req_state('dev/unknown/regexp', {
      regexp: formData.regexp,
      url: formData.url
    }, headers))
    dispatch({ type: 'formsData/formsDataClear' })
  }
}

function dev_form_submit_twitch_client_id(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const rootState = getState()
    const { headers } = rootState.net
    pre('dev_form_submit_twitch_client_id():')
    const formName = get_registry_val(rootState, FORM_TWITCH_CLIENT_ID_ID)
    if (!formName) { return }
    const policy = new FormValidationPolicy<Record<string, string>>(
      redux,
      formName
    )
    const validation = policy.applyValidationSchemes()
    if (validation && validation.length > 0) {
      validation.forEach(vError => {
        const message = vError.message ?? ''
        policy.emit(vError.name, message)
      })
      return
    }
    const formData = policy.getFilteredData()
    if (!formData) { return }
    pre()
    dispatch(post_req_state('dev/twitch/client-id', {
      client_id: formData.client_id,
      client_secret: formData.client_secret
    }, headers))
    dispatch({ type: 'formsData/formsDataClear' })
  }
}

/** @id $62_C_1 */
function dev_form_submit_save_config_value(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const rootState = getState()
    const { headers } = rootState.net
    pre('dev_form_submit_save_config_value():')
    const pageKey = get_registry_val(rootState, PAGE_SAVE_CONFIG_VALUE_ID)
    if (!pageKey) { return }
    const formName = get_registry_val(rootState, FORM_SAVE_CONFIG_VALUE_ID)
    if (!formName) { return }
    const policy = new FormValidationPolicy<Record<string, string>>(
      redux,
      formName
    )
    const validation = policy.applyValidationSchemes()
    if (validation && validation.length > 0) {
      validation.forEach(vError => {
        const message = vError.message ?? ''
        policy.emit(vError.name, message)
      })
      return
    }
    const formData = policy.getFilteredData()
    if (!formData) { return }
    pre()
    dispatch(post_req_state(
      `dev/${pageKey}`,
      new JsonapiRequest('Configurations', {
        key: formData.key,
        value: formData.value
      }).build(),
      headers
    ))
    dispatch({ type: 'formsData/formsDataClear' })
  }
}

const devCallbacks = {
  bookmarkAdd: dev_dialog_new_youtube_bookmark_from_video,
  devCreateUser: dev_create_user,
  devResetDatabase: dev_reset_database,
  devLoadDrawer: dev_load_drawer,
  devUnloadDrawer: dev_unload_drawer,
  devClipboardTest: dev_clipboard_test,
  devUserAdd: dev_user_add,
  devUserPopulate: dev_user_populate,
  devGetBookmarks: dev_get_bookmarks_callback,
  devNoResponse: dev_no_response,
  devDropCollection: dev_drop_collection,
  devPopulateCollection: dev_populate_collection,
  devCreateBookmarkSearchIndex: dev_create_bookmark_search_index,
  '$45_C_1': dev_get_video_thumbnail,
  '$49_C_1': () => () => {},
  '$50_C_1': () => () => {},
  '$54_C_1': dev_form_submit_rumble_regex,
  '$57_C_1': dev_form_submit_unknown_regex,
  '$60_C_1': dev_form_submit_twitch_client_id,
  '$62_C_1': dev_form_submit_save_config_value
}

export default devCallbacks