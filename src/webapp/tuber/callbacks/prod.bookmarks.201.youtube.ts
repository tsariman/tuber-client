import JsonapiRequest from '../../../business.logic/JsonapiRequest';
import { post_req_state } from '../../../state/net.actions';
import { type IRedux } from '../../../state';
import { DIALOG_YOUTUBE_NEW_ID, FORM_YOUTUBE_NEW_ID } from '../tuber.config';
import type { IBookmark } from '../tuber.interfaces';
import {
  get_form_data,
  get_dialog_form_endpoint
} from './_callbacks.common.logic';
import { log } from 'src/business.logic/logging';

/**
 * [ **YouTube** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $6_C_1
 */
export default function form_submit_new_youtube_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions: A } = redux;
    const rootState = getState();
    const endpoint = get_dialog_form_endpoint(rootState, DIALOG_YOUTUBE_NEW_ID);
    if (!endpoint) { return; }

    // [TODO] If Morph the endpoint to include listing.

    const data = get_form_data<IBookmark>(redux, FORM_YOUTUBE_NEW_ID);
    if (!data) { return; }
    const { formData, formName } = data;
    const platform = formData.platform;
    const videoid = formData.videoid;
    const start_seconds = formData.start_seconds;
    const end_seconds = formData.end_seconds;
    const title = formData.title;
    const note = formData.note;
    const requestBody = new JsonapiRequest<IBookmark>(endpoint, {
      platform,
      videoid,
      start_seconds,
      end_seconds,
      title,
      note
    }).build();
    requestBody.data.attributes ??= {} as IBookmark;
    requestBody.data.attributes.thumbnail_url = formData.thumbnail_url;
    log('form_submit_new_youtube_bookmark: requestBody', requestBody);
    dispatch(post_req_state(endpoint, requestBody));
    dispatch(A.formsDataClear(formName));
    dispatch(A.dialogClose());
  }
}
