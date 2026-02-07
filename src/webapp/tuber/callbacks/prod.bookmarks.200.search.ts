import { type IRedux } from 'src/state'
import { mongo_object_id, get_val } from 'src/business.logic/utility'
import { get_req_state } from 'src/state/net.actions'
import { APP_IS_FETCHING_BOOKMARKS, PAGE_RESEARCH_APP_ID } from '../tuber.config'
import { get_parsed_content } from 'src/business.logic/parsing'
import { pre, log } from 'src/business.logic/logging'
import {
  StateAppbarQueries,
  StateApp,
  StateNet
} from 'src/controllers'

/**
 * Callback to handle the search field in the appbar when the user submits a
 * query to search for bookmarks.
 * @param redux store, actions, and route
 * @id 63_C_1
 */
export default function appbar_search_bookmarks (redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState }, actions: A } = redux
    const rootState = getState()
    const route = new StateApp(rootState.app).routeAsKey
    const queries = new StateAppbarQueries(rootState.appbarQueries)
    const queryObj = queries.get(route)
    pre('appbar_search_bookmarks():')
    if (!queryObj) {
      log(`${route} route has no search query object.`)
      return
    }
    const pageKey = rootState.staticRegistry[PAGE_RESEARCH_APP_ID]
    const content = get_val<string>(rootState, `pages.${pageKey}.content`)
    const endpoint = get_parsed_content(content).endpoint
    if (!endpoint) {
      log('Page content has no endpoint')
      return
    }
    const net = new StateNet(rootState.net)
    if (net.userLoggedIn && queryObj.value.startsWith(':')) {
      // [TODO] Filter special characters except the colon.
      //        This will prevent the user from creating a bookmark with a
      //        special character in the name.
      const label = queryObj.value.trim().substring(1)
      const id = mongo_object_id()
      const chippedRoute = `listing/${id}`
      dispatch(A.chipAdd({
        id,
        route: chippedRoute,
        chipState: { id, label }
      }))
      dispatch(A.dataRemoveCol(endpoint))
      dispatch(A.appSwitchPage(chippedRoute))

      //  TODO  When creating a listing from the app bar, it will not be saved to
      //        until a bookmark is added to it on the server.
      return
    }

    dispatch(A.dataRemoveCol(endpoint))
    dispatch(A.dataClearRange(endpoint))
    dispatch(A.appSetFetchMessage(APP_IS_FETCHING_BOOKMARKS))

    // Prevent space-filled or empty search query requests
    if (queryObj.value.replace(/\s+/, '').length < 2) {
      log('space-filled query detected')
      return
    }

    pre()
    const encodedSearchQuery = encodeURIComponent(queryObj.value)
    const searchMode = get_val(rootState.pagesData, `${pageKey}.searchMode`)
    const args = [ `filter[search]=${encodedSearchQuery}` ]
    if (searchMode) {
      args.push(`filter[mode]=${searchMode}`)
    }
    dispatch(get_req_state(endpoint, args.join('&')))
  }
}