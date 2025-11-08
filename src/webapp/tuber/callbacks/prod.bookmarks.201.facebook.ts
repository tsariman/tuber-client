import JsonapiRequest from 'src/business.logic/JsonapiRequest';
import { type IRedux } from 'src/state';
import { post_req_state } from 'src/state/net.actions';
import { get_val } from '../../../business.logic/utility';
import { get_state_form_name } from '../../../business.logic/parsing';
import { FORM_FACEBOOK_NEW_ID } from '../tuber.config';
import { facebook_parse_iframe } from '../_tuber.common.logic';
import type { IBookmark } from '../tuber.interfaces';
import { error_id } from 'src/business.logic/errors';
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy';
import { get_dialog_form_endpoint } from './_callbacks.common.logic';
import { ler, log } from 'src/business.logic/logging';

/**
 * [ **Facebook** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $26_C_1
 */
export default function form_submit_new_facebook_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux;
    const rootState = getState();
    const endpoint = get_dialog_form_endpoint(rootState, FORM_FACEBOOK_NEW_ID);
    if (!endpoint) { return; }
    const formKey = get_val<string>(rootState, `staticRegistry.${FORM_FACEBOOK_NEW_ID}`);
    if (!formKey) {
      const errorMsg = 'form_submit_new_facebook_bookmark: Form key not found.';
      ler(errorMsg);
      error_id(1074).remember_error({
        code: 'MISSING_VALUE',
        title: errorMsg,
        source: { parameter: 'formKey' }
      }); // error 1074
      return;
    }
    const formName = get_state_form_name(formKey);
    if (!rootState.formsData?.[formName]) {
      const errorMsg = `form_submit_new_facebook_bookmark: '${formName}' `
        + `data does not exist.`;
      ler(errorMsg);
      error_id(1075).remember_error({
        code: 'MISSING_STATE',
        title: errorMsg,
        source: { parameter: 'formData' }
      }); // error 1075
      return;
    }
    const policy = new FormValidationPolicy<IBookmark>(redux, formName);
    const validation = policy.applyValidationSchemes();
    if (validation && validation.length > 0) {
      validation.forEach(vError => {
        const message = vError.message ?? ''
        policy.emit(vError.name, message)
      });
      return;
    }
    const formData = policy.getFilteredData();
    const [ author, videoid, start ] = facebook_parse_iframe(formData.embed_url);
    if (!author || !videoid) {
      ler('form_submit_new_facebook_bookmark: failed to get author and videoid!');
      policy.emit('embed_url', 'Bad embed URL.');
      return;
    }
    const start_seconds = parseInt(start);
    const requestBody = new JsonapiRequest(endpoint, {
      ...formData,
      videoid,
      author,
      start_seconds,
    }).build();
    log('form_submit_new_youtube_bookmark: requestBody', requestBody);
    dispatch(post_req_state(endpoint, requestBody));
    dispatch(actions.formsDataClear(formName));
    dispatch(actions.dialogClose());
  };
}
