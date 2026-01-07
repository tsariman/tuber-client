import type { Dispatch } from 'redux'
import {
  dataAccumulateByAppending,
  dataLimitQueueCol,
  dataLimitStackCol,
} from '../slices/data.slice'
import { metaAdd } from '../slices/meta.slice'
import { topLevelLinksStore } from '../slices/topLevelLinks.slice'
import { appRequestSuccess, appRequestFailed } from '../slices/app.slice'
import { bootstrap, type RootState } from '.'
import StateDataPagesRange from '../controllers/StateDataPagesRange'
import JsonapiPaginationLinks from '../business.logic/JsonapiPaginationLinks'
import { remember_jsonapi_errors } from '../business.logic/errors'
import { is_object, safely_get_as } from '../business.logic/utility'
import Config from '../config'
import execute_directives from './net.directives.c'
import { net_patch_state } from './actions'
import type {
  IJsonapiResponse,
  IJsonapiResponseResource,
} from '@tuber/shared'
import { BOOTSTRAP_ATTEMPTS } from '@tuber/shared'
import { dataUpdateRange } from '../slices/dataLoadedPages.slice'

// TODO: The `included` state does not exist yet and needs to be created

/**
 * Once the server response is received, this function can be used to process it.
 */
export default function net_default_200_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiResponse
): void {
  if (response.meta || response.data || response.links || response.state) {
    dispatch(appRequestSuccess())
  } else {
    dispatch(appRequestFailed())
  }
  let insertPosition: 'beginning' | 'end' | '' = 'end'
  const maxLoadedPages = parseInt(safely_get_as(
    response.meta,
    'max_loaded_pages',
    '4'
  ))
  const dataManager = new StateDataPagesRange(getState().dataPagesRange)
  dataManager.configure({ endpoint })
  let currentPageNumber = 1
  let pageSize = 25

  // Top level links
  if (is_object(response.links) && typeof response.links !== 'undefined') {
    const links = new JsonapiPaginationLinks(response.links)
    pageSize = links.pageSize
    dataManager.configure({
      endpoint,
      pageSize,
      maxLoadedPages
    })
    if (dataManager.isPageInRange(links.selfPageNumber)) {
      // Page already loaded, skip insertion
      insertPosition = ''
    } else if (dataManager.firstPage > 0 && links.selfPageNumber < dataManager.firstPage) {
      // Page is before current range - prepend
      insertPosition = 'beginning'
    }
    // else: page is after current range OR first load - append (default 'end')
    if (insertPosition) {
      dispatch(topLevelLinksStore({ endpoint, links: response.links }))
    }
    currentPageNumber = links.selfPageNumber
  }

  // meta member
  if (is_object(response.meta) && insertPosition) {
    dispatch(metaAdd({ endpoint, meta: response.meta }))
    execute_directives(dispatch, response.meta)
  }

  // data member
  if (response.data && Array.isArray(response.data)) {
    if (insertPosition === 'end') {
      dispatch(dataLimitQueueCol({
        collection: response.data as IJsonapiResponseResource[],
        endpoint,
        pageSize,
        limit: dataManager.getMaxLoadedPages()
      }))
    } else if (insertPosition === 'beginning') {
      dispatch(dataLimitStackCol({
        collection: response.data as IJsonapiResponseResource[],
        endpoint,
        pageSize,
        limit: dataManager.getMaxLoadedPages()
      }))
    }
    const newRange = dataManager
      .pageToBeLoaded(currentPageNumber)
      .getNewPageRange()
    if (newRange) {
      dispatch(dataUpdateRange({
        endpoint,
        pageNumbers: newRange
      }))
    }
  } else if (response.errors) {
    remember_jsonapi_errors(response.errors)
  }

  // included member
  if (Array.isArray(response.included)) {
    const collectionName = response.included[0]?.type || 'unknown'
    dispatch(dataAccumulateByAppending({
      identifier: collectionName,
      collection: response.included
    }))
  }

  // Handles redux state loaded from the server (remote).
  if (is_object(response.state)) {
    dispatch(net_patch_state(response.state))

     // If the response is a state bootstrap
    if (response.state?.app?.isBootstrapped) {
      bootstrap(response)
    }
    // Boolean value `false` will force app to bootstrap again.
    else if (response.state?.app?.isBootstrapped === false) {
      Config.write(BOOTSTRAP_ATTEMPTS, 0)
    }
  }

}
