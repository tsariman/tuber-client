import type { YouTubePlayer } from 'react-youtube';
import Config from 'src/config';
import {
  get_parsed_content,
  get_state_form_name
} from 'src/business.logic/parsing';
import { type IRedux } from 'src/state';
import { error_id } from 'src/business.logic/errors';
import type { TPlatform } from '../tuber.interfaces';
import { get_dialog_state } from 'src/state/net.actions';
import { pre } from '../../../business.logic/logging';

/**
 * [ **YouTube** ] Shows a dialog containing a form to create a new bookmark.
 *
 * @id 6
 * @deprecated
 */
export default function dialog_new_youtube_bookmark_from_video(redux: IRedux) {
  return async () => {
    pre('dialog_new_youtube_bookmark_from_video():');
    const { store: { dispatch } } = redux;
    const dialogState = await get_dialog_state(redux, '6');
    if (!dialogState) { return; }
    const player = Config.read<YouTubePlayer>('player');
    try {
      const content = get_parsed_content(dialogState.content);
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'start_seconds',
          value: Math.floor(await player.getCurrentTime())
        }
      });
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'videoid',
          value: Config.read<string>('videoid')
        }
      });
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'platform',
          value: Config.read<TPlatform>('platform')
        }
      });
    } catch (e) { error_id(1048).remember_exception(e); /* error 1048 */ }
    pre();
    if (redux.store.getState().dialog._id !== dialogState._id) { // if the dialog was NOT mounted
      dispatch({ type: 'dialog/dialogMount', payload: dialogState });
    } else {
      dispatch({ type: 'dialog/dialogOpen' });
    }
  };
}