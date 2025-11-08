import type { Dispatch } from 'redux';
import { is_object, mongo_object_id } from '../business.logic/utility';
import type {
  IJsonapiAbstractResponse,
  IJsonapiErrorResponse
} from '@tuber/shared';
import { appRequestFailed } from '../slices/app.slice';
import { type RootState } from '.';
import { error_id, remember_jsonapi_errors } from '../business.logic/errors';
import execute_directives from './net.directives.c';
import { net_patch_state } from './actions';
import { ler } from '../business.logic/logging';

export default function net_default_409_driver (
  dispatch: Dispatch,
  _getState: () => RootState,
  endpoint: string,
  response: IJsonapiAbstractResponse
): void {
  dispatch(appRequestFailed());
  const doc = response as IJsonapiErrorResponse;

  if (is_object(doc.state)) {
    dispatch(net_patch_state(response.state));
  }

  if (doc.meta) {
    execute_directives(dispatch, doc.meta);
  }

  if (!doc.errors) {
    const title = 'net_default_409_driver: No errors were received.';
    ler(title);
    error_id(46).remember_error({
      id: mongo_object_id(),
      code: 'INVALID_FORMAT',
      title,
      detail: JSON.stringify(response, null, 4),
      source: { 'pointer': endpoint },
    }); // error 46
    return;
  }

  remember_jsonapi_errors(doc.errors);
  ler(`net_default_409_driver: endpoint: ${endpoint}`);
  ler('net_default_409_driver: response:', response);
}