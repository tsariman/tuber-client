import type { Dispatch } from 'redux';
import { is_object, mongo_object_id } from '../business.logic/utility';
import type { IJsonapiResponse } from '@tuber/shared';
import { appRequestFailed } from '../slices/app.slice';
import { type RootState } from '.';
import { error_id, remember_jsonapi_errors } from '../business.logic/errors';
import execute_directives from './net.directives.c';
import { net_patch_state } from './actions';
import { ler } from '../business.logic/logging';

export default function net_default_400_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiResponse
): void {
  void getState;
  dispatch(appRequestFailed());

  if (is_object(response.state)) {
    dispatch(net_patch_state(response.state));
  }

  if (response.meta) {
    execute_directives(dispatch, response.meta);
  }

  if (!response.errors) {
    const title = 'net_default_400_driver: No errors were received.';
    ler(title);
    error_id(43).remember_error({
      id: mongo_object_id(),
      code: 'INVALID_FORMAT',
      title,
      detail: JSON.stringify(response, null, 4),
      source: { 'pointer': endpoint },
    }); // error 43
    return;
  }

  remember_jsonapi_errors(response.errors);
  ler(`net_default_400_driver: endpoint: ${endpoint}`);
  ler('net_default_400_driver: response:', response);
}