import type { Dispatch } from 'redux';
import {
  dataLimitQueueCol,
  dataLimitStackCol,
} from '../slices/data.slice';
import { metaAdd } from '../slices/meta.slice';
import { topLevelLinksStore } from '../slices/topLevelLinks.slice';
import { appRequestSuccess, appRequestFailed } from '../slices/app.slice';
import { bootstrap, type RootState } from '.';
import StateDataPagesRange from '../controllers/StateDataPagesRange';
import JsonapiPaginationLinks from '../business.logic/JsonapiPaginationLinks';
import { remember_jsonapi_errors } from '../business.logic/errors';
import { is_object, safely_get_as } from '../business.logic/utility';
import Config from '../config';
import execute_directives from './net.directives.c';
import { net_patch_state } from './actions';
import type {
  IJsonapiAbstractResponse,
  IJsonapiResponse,
} from '@tuber/shared';
import { BOOTSTRAP_ATTEMPTS } from '@tuber/shared';
import { dataUpdateRange } from '../slices/dataLoadedPages.slice';

// [TODO] The `included` state does not exist yet and needs to be created

/**
 * Once the server response is received, this function can be used to process it.
 */
export default function net_default_200_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiAbstractResponse
): void {
  const doc = response as IJsonapiResponse;
  if (doc.meta || doc.data || doc.links || doc.state) {
    dispatch(appRequestSuccess());
  } else {
    dispatch(appRequestFailed());
  }
  let insertPosition: 'beginning' | 'end' | '' = 'end';
  const maxLoadedPages = parseInt(safely_get_as(
    doc.meta,
    'max_loaded_pages',
    '4'
  ));
  const dataManager = new StateDataPagesRange(getState().dataPagesRange);
  dataManager.configure({ endpoint });
  let currentPageNumber = 1;
  let pageSize = 25;

  // Top level links
  if (is_object(doc.links) && typeof doc.links !== 'undefined') {
    const links = new JsonapiPaginationLinks(doc.links);
    pageSize = links.pageSize;
    dataManager.configure({
      endpoint,
      pageSize,
      maxLoadedPages
    });
    if (links.selfPageNumber < dataManager.firstPage) {
      insertPosition = 'beginning';
    } else if (dataManager.isPageInRange(links.selfPageNumber)) {
      insertPosition = '';
    }
    if (insertPosition) {
      dispatch(topLevelLinksStore({ endpoint, links: doc.links }));
    }
    currentPageNumber = links.selfPageNumber;
  }

  // meta member
  if (doc.meta && insertPosition) {
    dispatch(metaAdd({ endpoint, meta: doc.meta }));
    execute_directives(dispatch, doc.meta);
  }

  // data member
  if (doc.data && Array.isArray(doc.data)) {
    if (insertPosition === 'end') {
      dispatch(dataLimitQueueCol({
        collection: doc.data,
        endpoint,
        pageSize,
        limit: dataManager.getMaxLoadedPages()
      }));
    } else if (insertPosition === 'beginning') {
      dispatch(dataLimitStackCol({
        collection: doc.data,
        endpoint,
        pageSize,
        limit: dataManager.getMaxLoadedPages()
      }));
    }
    const newRange = dataManager
      .pageToBeLoaded(currentPageNumber)
      .getNewPageRange();
    if (newRange) {
      dispatch(dataUpdateRange({
        endpoint,
        pageNumbers: newRange
      }));
    }
  } else if (doc.errors) {
    remember_jsonapi_errors(doc.errors);
  }

  // Handles redux state loaded from the server (remote).
  if (is_object(doc.state)) {
    dispatch(net_patch_state(doc.state));

     // If the response is a state bootstrap
    if (doc.state?.app?.isBootstrapped) {
      bootstrap(doc);
    }
    // Boolean value `false` will force app to bootstrap again.
    else if (doc.state?.app?.isBootstrapped === false) {
      Config.write(BOOTSTRAP_ATTEMPTS, 0);
    }
  }

}
