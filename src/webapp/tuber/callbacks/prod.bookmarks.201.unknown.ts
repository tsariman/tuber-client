import JsonapiRequest from 'src/business.logic/JsonapiRequest';
import { type IRedux } from 'src/state';
import { post_req_state } from 'src/state/net.actions';
import { DIALOG_UNKNOWN_NEW_ID, FORM_UNKNOWN_NEW_ID } from '../tuber.config';
import { get_iframe_url_src } from '../_tuber.common.logic';
import type { IBookmark } from '../tuber.interfaces';
import { get_dialog_form_endpoint, get_form_data } from './_callbacks.common.logic';
import { log } from 'src/business.logic/logging';

/**
 * [ **Unknown** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $30_C_1
 */
export default function form_submit_new_unknown_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux;
    const rootState = getState();
    const endpoint = get_dialog_form_endpoint(rootState, DIALOG_UNKNOWN_NEW_ID);
    if (!endpoint) { return; }
    const data = get_form_data<IBookmark>(redux, FORM_UNKNOWN_NEW_ID);
    if (!data) { return; }
    const { formData, formName } = data;
    const embed_url = get_iframe_url_src(formData.embed_url);
    const requestBody = new JsonapiRequest(endpoint, {
      ...formData,
      embed_url,
    }).build();
    log('form_submit_new_youtube_bookmark: requestBody', requestBody);
    dispatch(post_req_state(endpoint, requestBody));
    dispatch(actions.formsDataClear(formName));
    dispatch(actions.dialogClose());
  };
}
