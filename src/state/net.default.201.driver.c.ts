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
  IJsonapiResponse,
  IJsonapiResponseResource,
} from '@tuber/shared'

export default function net_default_201_driver (
  dispatch: Dispatch,
  getState: () => RootState,
  endpoint: string,
  response: IJsonapiResponse
): void {
  void getState
  if (response.meta || response.data || response.links || response.state) {
    dispatch(appRequestSuccess())
  } else {
    dispatch(appRequestFailed())
  }
  pre('net_default_201_driver:')
  log('Received response:', response)
  if (response.data) {
    if (Array.isArray(response.data) && response.data.length === 1) {
      dispatch(dataStackCol({
        endpoint: clean_endpoint_ending(endpoint),
        collection: response.data as IJsonapiResponseResource[]
      }))
    } else if (Array.isArray(response.data) && response.data.length > 1) {
      ler('more than one resource received on a 201 response.')
    } else if (is_object(response.data)) {
      dispatch(dataStack({
        collectionName: clean_endpoint_ending(endpoint),
        data: response.data as IJsonapiResponseResource
      }))
    }
  }
  if (is_object(response.meta)) {
    const { meta } = response
    dispatch(metaAdd({ endpoint, meta }))
  }
  if (is_object(response.state)) {
    dispatch(net_patch_state(response.state))
  }
  pre()
}
