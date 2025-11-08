import {
  StateApp,
  StateAppbarQueries,
  StateData
} from 'src/controllers';
import type { IRedux } from 'src/state';
import type { IBookmark } from '../tuber.interfaces';

export default function appbar_filter_bookmarks(redux: IRedux) {
  return async () => {
    const dispatch = redux.store.dispatch;
    const rootState = redux.store.getState();
    const data = new StateData(rootState.data);
    data.configure({ dispatch, endpoint: 'bookmarks' });
    const route = new StateApp(rootState.app).route;
    const queries = new StateAppbarQueries(rootState.appbarQueries);
    const queryObj = queries.get(route);
    const filter = queryObj?.value?.toLowerCase() ?? '';
    const bookmarks = data
      .flatten()
      .get<IBookmark>();
    const bookmarksFiltered = bookmarks.filter(bookmark => {
      if (bookmark.title.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      if (bookmark.note?.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      if (bookmark.tags
        && bookmark.tags.includes(filter.toLowerCase()))
      {
        return true;
      }
      return false;
    });
    dispatch({ type: 'bookmarks/bookmarksFiltered', payload: bookmarksFiltered });
  };
}