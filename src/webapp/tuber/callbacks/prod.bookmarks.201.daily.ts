import { log, pre } from 'src/business.logic/logging';
import JsonapiRequest from 'src/business.logic/JsonapiRequest';
import { post_req_state } from 'src/state/net.actions';
import type { IRedux } from 'src/state';
import { DIALOG_DAILY_NEW_ID, FORM_DAILY_NEW_ID } from '../tuber.config';
import type { IBookmark } from '../tuber.interfaces';
import { get_start_time_in_seconds } from '../_tuber.common.logic';
import {
  get_dialog_form_endpoint,
  get_form_data
} from './_callbacks.common.logic';

/**
 * [ **Dailymotion** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $21_C_1
 */
export default function form_submit_new_daily_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux;
    pre('form_submit_new_daily_bookmark():');
    const rootState = getState();
    const formEp = get_dialog_form_endpoint(rootState, DIALOG_DAILY_NEW_ID);
    if (!formEp) { return; }
    const data = get_form_data<IBookmark>(redux, FORM_DAILY_NEW_ID);
    if (!data) { return; }

    // [TODO] If there is a chip in the app bar input field, the bookmark when
    //        saved should be added to that listing.
    //        If there is no chip, the bookmark should be added to the default
    //        listing.
    //        #1 Get the chip from the app bar input field.
    let listings = '';
    Object.keys(rootState.chips).forEach(key => {
      const chip = rootState.chips[key];
      listings = listings + ',' + chip.id;
    });
    listings = listings.substring(1);
    const endpoint = get_dialog_form_endpoint(rootState, DIALOG_DAILY_NEW_ID);
    if (!endpoint) { return; }

    const { formData, formName } = data;
    const start_seconds = get_start_time_in_seconds(formData.start_time);
    const requestBody = new JsonapiRequest<IBookmark>(endpoint, {
      ...formData,
      start_seconds,
    }).build();
    log('requestBody', requestBody);

    dispatch(post_req_state(encodeURIComponent(endpoint), requestBody));
    dispatch(actions.formsDataClear(formName));
    dispatch(actions.dialogClose());
  };
}
