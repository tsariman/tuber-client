import {
  get_parsed_content,
  get_state_form_name
} from 'src/business.logic/parsing'
import type { IJsonapiResponseResource } from '@tuber/shared'
import StateTmp from 'src/controllers/StateTmp'
import { type IRedux } from 'src/state'
import { error_id } from 'src/business.logic/errors'
import { delete_req_state, get_dialog_state } from 'src/state/net.actions'
import { get_val, safely_get_as } from 'src/business.logic/utility'
import { get_dialog_registry_key_for_edit } from '../_tuber.common.logic'
import type { IBookmark } from '../tuber.interfaces'
import { DIALOG_DELETE_BOOKMARK_ID } from '../tuber.config'
import { ler, log, pre } from '../../../business.logic/logging'
import type { IStateData } from '@tuber/shared'

/** Get bookmarks data from redux store. */
function get_bookmark_resources (data: IStateData<IBookmark>) {
  return data.bookmarks as IJsonapiResponseResource<IBookmark>[]
    || []
}

/**
 * Callback to open a form within a dialog to edit an bookmark.
 * @param i The index of the bookmark to edit.
 * @returns The callback function.
 */
export function dialog_edit_bookmark (i: number) {
  return (redux: IRedux) => {
    return async () => {
      const { store: { getState, dispatch }, actions: A } = redux
      const rootState = getState()
      const resourceList = safely_get_as<IJsonapiResponseResource<IBookmark>[]>(
        rootState,
        `data.bookmarks`,
        []
      )
      pre('bookmark_edit_callback:')
      if (resourceList.length === 0) {
        ler('No \'bookmarks\' found.')
        return
      }
      const bookmark = resourceList[i]
      if (!bookmark) {
        ler(`resourceList['${i}'] does not exist.`)
        return
      }

      // Init
      const platform = bookmark.attributes.platform
      const registryKey = get_dialog_registry_key_for_edit(platform)
      const dialogState = await get_dialog_state(redux, registryKey)
      if (!dialogState) { return }

      // Populate the form
      try {
        const content = get_parsed_content(dialogState.content)
        const formName = get_state_form_name(content.name)
        if (platform === 'unknown') {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'url',
            value: bookmark.attributes.url
          }))
          dispatch(A.formsDataUpdate({
            formName,
            name: 'embed_url',
            value: bookmark.attributes.embed_url
          }))
          dispatch(A.formsDataUpdate({
            formName,
            name: 'thumbnail_url',
            value: bookmark.attributes.thumbnail_url
          }))
        }
        if (platform === 'rumble'
          || platform === 'odysee'
        ) {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'slug',
            value: bookmark.attributes.slug
          }))
        }
        dispatch(A.formsDataUpdate({
          formName,
          name: 'start_seconds',
          value: bookmark.attributes.start_seconds
        }))
        if (platform === 'youtube'
          // || platform === 'rumble'
          // || platform === 'vimeo'
          // || platform === 'odysee'
          // || platform === 'dailymotion'
        ) {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'end_seconds',
            value: bookmark.attributes.end_seconds
          }))
        }
        if (platform === 'facebook') {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'author',
            value: bookmark.attributes.author
          }))
        }
        dispatch(A.formsDataUpdate({
          formName,
          name: 'videoid',
          value: bookmark.attributes.videoid
        }))
        dispatch(A.formsDataUpdate({
          formName,
          name: 'platform',
          value: bookmark.attributes.platform
        }))
        dispatch(A.formsDataUpdate({
          formName,
          name: 'title',
          value: bookmark.attributes.title
        }))
        dispatch(A.formsDataUpdate({
          formName,
          name: 'note',
          value: bookmark.attributes.note
        }))
        if (platform !== 'unknown') {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'is_published',
            value: bookmark.attributes.is_published
          }))
        }
      } catch (e) {
        ler((e as Error).message)
         // error 1047
        error_id(1047).remember_exception(e, `dialog_edit_bookmark: ${(e as Error).message}`)
      }
      pre()
      if (rootState.dialog._id !== dialogState._id) { // if the dialog was NOT mounted
        dispatch(A.dialogMount(dialogState))
      } else {
        dispatch(A.dialogOpen())
      }
      dispatch(A.tmpAdd({
        id: 'dialogEditBookmark',
        name: 'index',
        value: i
      }))
      log('index:', i)
    }
  }
}

/**
 * Callback to open a dialog to delete an bookmark.
 * @param i The index of the bookmark to delete.
 * @returns The callback function.
 */
export function dialog_delete_bookmark (i: number) {
  return (redux: IRedux) => {
    return async () => {
      const { store: { dispatch }, actions: A } = redux
      const rootState = redux.store.getState()
      pre('dialog_delete_bookmark():')
      const dialogState = await get_dialog_state(redux, DIALOG_DELETE_BOOKMARK_ID)
      if (!dialogState) { return }
      const data = safely_get_as<IStateData<IBookmark>>(rootState, 'data', {})
      const resourceList = get_bookmark_resources(data)
      if (resourceList.length === 0) {
        ler('No \'bookmarks\' found.')
        return
      }
      const bookmark = resourceList[i]
      if (!bookmark) {
        ler(`resourceList['${i}'] does not exist.`)
        return
      }
      pre()

      // Open the dialog
      if (rootState.dialog._id !== dialogState._id) {// if the dialog was NOT mounted
        dispatch(A.dialogMount(dialogState))
      } else {
        dispatch(A.dialogOpen())
      }

      dispatch({
        type: 'tmp/tmpAdd',
        payload: {
          id: 'deleteBookmarkDialog',
          name: 'index',
          value: i
        }
      })
    }
  }
}

/**
 * Callback to delete bookmarks
 * @id 34_C_1
 * @param redux The redux store.
 * @returns The callback function.
 */
export default function form_submit_delete_bookmark (redux: IRedux) {
  return async () => {
    pre('form_submit_delete_bookmark():')
    const { store: { getState, dispatch }, actions: A } = redux
    const rootState = getState()
    const data = safely_get_as<IStateData<IBookmark>>(rootState, 'data', {})
    const resourceList = get_bookmark_resources(data)
    const tmp = new StateTmp(rootState.tmp)
    tmp.configure({ dispatch })
    const index = tmp.get<number>('deleteBookmarkDialog', 'index', -1)
    if (resourceList.length === 0) {
      ler('No \'bookmarks\' found.')
      return
    }
    const bookmark = resourceList[index]
    if (!bookmark) {
      ler(`resourceList['${index}'] does not exist.`)
      return
    }
    const dialogKey = get_val<string>(rootState, `staticRegistry.${DIALOG_DELETE_BOOKMARK_ID}`)
    if (!dialogKey) {
      ler('dialogKey not found.')
      return
    }
    const dialogState = rootState.dialogs[dialogKey]
    if (!dialogState) {
      ler(`'${dialogKey}' does not exist.`)
      error_id(1100).remember_error({
        code: 'MISSING_VALUE',
        title: `'${dialogKey}' does not exist.`,
        source: { parameter: 'dialogKey' }
      }) // error 1100
      return
    }
    pre()
    dispatch(A.dialogClose())
    dispatch(A.dataDeleteByIndex({ endpoint: 'bookmarks', index }))
    // TODO: Acquire the endpoint from the server eventually.
    dispatch(delete_req_state(`bookmarks/${bookmark.id}`, undefined, {
      'Content-Type': 'text/plain'
    }))
  }
}

/** */
export const bookmark_vote_up = (i: number) => (redux: IRedux) => async () => {
  void i
  void redux
  // TODO: Implement me
}

/** */
export const bookmark_vote_down = (i: number) => (redux: IRedux) => async () => {
  void i
  void redux
  // TODO: Implement me
}