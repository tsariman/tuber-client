import type { IRedux, TReduxHandler } from '../../../state'
import JsonapiRequest from '../../../business.logic/JsonapiRequest'
import { post_req_state } from '../../../state/net.actions'
import form_submit_sign_in, { sign_out } from './prod.authentication'
import form_submit_new_youtube_bookmark from './prod.bookmarks.201.youtube'
import form_submit_delete_bookmark from './prod.bookmarks.actions'
import dialog_new_bookmark_from_url, {
  dialog_new_bookmark_from_url_on_enter_key,
  dialog_new_video_url,
} from './prod.bookmarks._url'
import appbar_search_bookmarks from './prod.bookmarks.200.search'
import appbar_filter_bookmarks from './prod.bookmarks.200.filter'
import form_submit_new_rumble_bookmark from './prod.bookmarks.201.rumble'
import form_submit_edit_youtube_bookmark from './prod.bookmarks.204.youtube'
import form_submit_edit_rumble_bookmark from './prod.bookmarks.204.rumble'
import form_submit_new_vimeo_bookmark from './prod.bookmarks.201.vimeo'
import form_submit_edit_vimeo_bookmark from './prod.bookmarks.204.vimeo'
import form_submit_new_odysee_bookmark from './prod.bookmarks.201.odysee'
import form_submit_edit_odysee_bookmark from './prod.bookmarks.204.odysee'
import form_submit_new_daily_bookmark from './prod.bookmarks.201.daily'
import form_submit_edit_daily_bookmark from './prod.bookmarks.204.daily'
import form_submit_new_facebook_bookmark from './prod.bookmarks.201.facebook'
import form_submit_edit_facebook_bookmark from './prod.bookmarks.204.facebook'
import form_submit_new_unknown_bookmark from './prod.bookmarks.201.unknown'
import form_submit_edit_unknown_bookmark from './prod.bookmarks.204.unknown'
import form_submit_new_twitch_bookmark from './prod.bookmarks.201.twitch'
import form_submit_edit_twitch_bookmark from './prod.bookmarks.204.twitch'
import toggle_theme_mode from './prod.toggle.theme.mode'
import {
  DIALOG_LOGIN_ID,
  DIALOG_FEEDBACK_ID,
  FORM_FEEDBACK_ID
} from '../tuber.config'
import { get_dialog_state } from 'src/state/net.actions'
import appbar_toggle_search_scope from './prod.toggle.search.scope'
import open_patreon_upgrade from './prod.open.patreon'
import {
  get_dialog_form_endpoint,
  get_form_data
} from './_callbacks.common.logic'

interface IFeedbackFormData {
  category?: string
  details?: string
  serialized_state?: string
}

/** Default callback for closing dialogs */
function $close_default (redux: IRedux) {
  return () => redux.store.dispatch({ type: 'dialog/dialogClose' })
}

/** @id 32_C_1 */
export function dialog_sign_in(redux: IRedux) {
  return async () => {
    const dispatch = redux.store.dispatch
    const rootState = redux.store.getState()
    if (rootState.dialog._id === DIALOG_LOGIN_ID) {
      dispatch({ type: 'dialog/dialogOpen' })
      return
    }
    const dialogState = await get_dialog_state(redux, DIALOG_LOGIN_ID)
    if (!dialogState) { return }
    if (rootState.dialog._key !== dialogState._key) { // if the dialog was NOT mounted
      dispatch({ type: 'dialog/dialogMount', payload: dialogState })
    } else {
      dispatch({ type: 'dialog/dialogOpen' })
    }
  }
}

/** @id 87_C_2 */
function $dialog_open_feedback(redux: IRedux) {
  return async () => {
    const dispatch = redux.store.dispatch
    const rootState = redux.store.getState()
    if (rootState.dialog._id === DIALOG_FEEDBACK_ID) {
      dispatch({ type: 'dialog/dialogOpen' })
      return
    }
    const dialogState = await get_dialog_state(redux, DIALOG_FEEDBACK_ID)
    if (!dialogState) { return }
    if (rootState.dialog._key !== dialogState._key) { // if the dialog was NOT mounted
      dispatch({ type: 'dialog/dialogMount', payload: dialogState })
    } else {
      dispatch({ type: 'dialog/dialogOpen' })
    }
  }
}

/** @id 87_C_1 */
function $form_submit_feedback(redux: IRedux) {
  return async (event: Event) => {
    event.preventDefault()
    const { store: { getState, dispatch }, actions: A } = redux
    const rootState = getState()
    const endpoint = get_dialog_form_endpoint(rootState, DIALOG_FEEDBACK_ID)
    if (!endpoint) { return }

    const data = get_form_data<IFeedbackFormData>(redux, FORM_FEEDBACK_ID)
    if (!data) { return }

    const { formData, formName } = data
    const { data: rootData, net, ...restState } = rootState
    const { account, ...restData } = rootData
    void net
    void account
    const redactedState = { ...restState, data: restData }
    const requestBody = new JsonapiRequest(endpoint, {
      category: formData.category,
      details: formData.details,
      serialized_state: JSON.stringify(redactedState)
    }).build()

    dispatch(post_req_state(endpoint, requestBody))
    dispatch(A.formsDataClear(formName))
    dispatch(A.dialogClose())
  }
}

const prodCallbacks: { readonly [key: string]: TReduxHandler } = {
  defaultClose: $close_default,
  'toggleSearchScope': appbar_toggle_search_scope,
  '$1_C_1': dialog_new_bookmark_from_url,
  '$3_C_1': dialog_new_video_url,
  '$32_C_1': dialog_sign_in,
  '$63_C_1': appbar_search_bookmarks,
  '$1_C_2': dialog_new_bookmark_from_url_on_enter_key,
  '$6_C_1': form_submit_new_youtube_bookmark,
  '$7_C_1': form_submit_edit_youtube_bookmark,
  '$34_C_1': form_submit_delete_bookmark,
  '$8_C_1': form_submit_new_rumble_bookmark,
  '$11_C_1': form_submit_edit_rumble_bookmark,
  '$14_C_1': form_submit_new_vimeo_bookmark,
  '$15_C_1': form_submit_edit_vimeo_bookmark,
  '$16_C_1': form_submit_new_odysee_bookmark,
  '$23_C_1': form_submit_edit_odysee_bookmark,
  '$21_C_1': form_submit_new_daily_bookmark,
  '$22_C_1': form_submit_edit_daily_bookmark,
  '$26_C_1': form_submit_new_facebook_bookmark,
  '$27_C_1': form_submit_edit_facebook_bookmark,
  '$36_C_1': form_submit_new_twitch_bookmark,
  '$37_C_1': form_submit_edit_twitch_bookmark,
  '$30_C_1': form_submit_new_unknown_bookmark,
  '$31_C_1': form_submit_edit_unknown_bookmark,
  '$41_C_1': form_submit_sign_in,
  // '$41_C_2': form_submit_sign_in_enter_key,
  '$44_C_1': toggle_theme_mode,
  '$66_C_1': sign_out,
  '$71_C_1': appbar_filter_bookmarks,
  'openPatreonUpgrade': open_patreon_upgrade,
  '$87_C_1': $form_submit_feedback,
  '$87_C_2': $dialog_open_feedback,
  // TODO Add more callbacks here
}

export default prodCallbacks
