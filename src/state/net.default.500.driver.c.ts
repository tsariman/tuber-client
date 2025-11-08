import type { Dispatch } from 'redux';
import { mongo_object_id } from '../business.logic/utility';
import type { IJsonapiResponse } from '@tuber/shared';
import { appRequestFailed } from '../slices/app.slice';
import { type RootState } from '.';
import { error_id, remember_jsonapi_errors } from '../business.logic/errors';
import execute_directives from './net.directives.c';
import { ler } from '../business.logic/logging';

export default function net_default_500_driver (
  dispatch: Dispatch,
  _getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiResponse
): void {
  dispatch(appRequestFailed());

  if (response.meta) {
    execute_directives(dispatch, response.meta);
  }

  if (!response.errors) {
    const title = 'net_default_500_driver: No errors were received.';
    ler(title);
    error_id(47).remember_error({
      id: mongo_object_id(),
      code: 'INVALID_FORMAT',
      title,
      detail: JSON.stringify(response, null, 4),
      source: { 'pointer': endpoint },
    }); // error 47
    return;
  }

  remember_jsonapi_errors(response.errors);
  ler(`net_default_500_driver: endpoint: ${endpoint}`);
  ler('net_default_500_driver: response:', response);
}
