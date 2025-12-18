import {
  get_parsed_content,
  get_state_form_name
} from 'src/business.logic/parsing';
import StateTmp from 'src/controllers/StateTmp';
import { type IRedux } from 'src/state';
import { error_id } from 'src/business.logic/errors';
import { patch_req_state } from 'src/state/net.actions';
import type { IBookmark } from '../tuber.interfaces';
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy';
import { ler, msg, pre } from '../../../business.logic/logging';
import { has_changes } from 'src/business.logic/utility';

/**
 * [ **Odysee** ] Save bookmark changes to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $23_C_1
 */
export default function form_submit_edit_odysee_bookmark(redux: IRedux) {
  return async () => {
    try {
      const { store, actions } = redux;
      const dispatch = store.dispatch;
      const rootState = store.getState();
      const tmp = new StateTmp(rootState.tmp);
      tmp.configure({ dispatch });
      const index = tmp.get<number>('dialogEditBookmark', 'index', -1);
      pre('form_submit_edit_odysee_bookmark:');
      if (index === -1) {
        ler('index not found.');
        error_id(1082).remember_error({
          code: 'MISSING_DATA',
          title: 'Bookmark resource index is missing',
        }); // error 1082
        return;
      }
      // Careful, `rootState.dialog` is only valid if the right dialog state
      // is mounted.
      const { _key, content } = rootState.dialog;
      const {name, endpoint } = get_parsed_content(content);
      if (!endpoint) {
        const errorMsg = `No endpoint defined for '${_key}'.`;
        ler(errorMsg);
        error_id(1083).remember_error({
          code: 'MISSING_DATA',
          title: errorMsg,
          source: { parameter: 'endpoint' }
        }); // error 1083
        return;
      }
      const formName = get_state_form_name(name);
      if (!rootState.formsData[formName]) {
        const errorMsg = msg(` '${formName}' data does not exist.`);
        ler(errorMsg);
        error_id(1084).remember_error({
          code: 'MISSING_STATE',
          title: errorMsg,
          source: { parameter: 'formData' }
        }); // error 1084
        return;
      }
      const policy = new FormValidationPolicy<IBookmark>(redux, formName);
      const validation = policy.applyValidationSchemes();
      if (validation && validation.length > 0) {
        validation.forEach(vError => {
          const message = vError.message ?? '';
          policy.emit(vError.name, message);
        });
        return;
      }
      const existingBookmarkResource = rootState
        .data
        .bookmarks?.[index];

      if (!existingBookmarkResource) {
        ler('bad bookmark resource index.');
        return;
      }
      pre();
      const formData = policy.getFilteredData();
      
      // Prevent submission if nothing changed compared to existing attributes
      if (!has_changes(existingBookmarkResource.attributes, formData)) {
        // No changes detected; submission skipped.
        return
      }
      
      const editedBookmarkResource = {
        ...existingBookmarkResource,
        attributes: {
          ...existingBookmarkResource.attributes,
          ...formData
        }
      };
      dispatch(actions.dataUpdateByIndex({
        endpoint,
        index,
        resource: editedBookmarkResource
      }));
      dispatch(patch_req_state(
        `${endpoint}/${editedBookmarkResource.id}`,
        { data: editedBookmarkResource }
      ));
      dispatch(actions.formsDataClear(formName));
      dispatch(actions.dialogClose());
    } catch (e) {
      ler((e as Error).message);
      error_id(1041).remember_exception(e, msg((e as Error).message)); // error 1041
    }
  };
}