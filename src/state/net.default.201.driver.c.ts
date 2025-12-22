import type { Dispatch } from 'redux'
import { is_object } from '../business.logic/utility'
import {
  appRequestFailed,
  appRequestSuccess
} from '../slices/app.slice'
import { type RootState } from '.'
import { dataStackCol, dataStack } from '../slices/data.slice'
import { metaAdd } from '../slices/meta.slice'
import { net_patch_state } from './actions'
import { pre, log, ler } from '../business.logic/logging'
import { clean_endpoint_ending } from '../business.logic/parsing'
import type {
  IJsonapiAbstractResponse,
  IJsonapiResponseResource,
  IJsonapiDataResponse
} from '@tuber/shared'

export default function net_default_201_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiAbstractResponse
): void {
  void getState
  const doc = response as IJsonapiDataResponse
  if (doc.meta || doc.data || doc.links || doc.state) {
    dispatch(appRequestSuccess())
  } else {
    dispatch(appRequestFailed())
  }
  pre('net_default_201_driver:')
  log('Received response:', doc)
  if (doc.data) {
    if (Array.isArray(doc.data) && doc.data.length === 1) {
      dispatch(dataStackCol({
        endpoint: clean_endpoint_ending(endpoint),
        collection: doc.data
      }))
    } else if (Array.isArray(doc.data) && doc.data.length > 1) {
      ler('more than one resource received on a 201 response.')
    } else if (is_object(doc.data)) {
      dispatch(dataStack({
        collectionName: clean_endpoint_ending(endpoint),
        data: doc.data as IJsonapiResponseResource
      }))
    }
  }
  if (doc.meta) {
    const { meta } = doc
    dispatch(metaAdd({ endpoint, meta }))
  }
  if (is_object(doc.state)) {
    dispatch(net_patch_state(doc.state))
  }
  pre()
}
