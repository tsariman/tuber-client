import AbstractState from './AbstractState';
import State from './State';
import Config from '../config';
import type { TObj } from '@tuber/shared';
import { error_id } from '../business.logic/errors';
import { get_state } from '../state';

export default class StateMeta extends AbstractState {
  private _metaState: TObj;
  private _parent?: State;

  constructor (metaState: TObj, parent?: State) {
    super();
    this._metaState = metaState;
    this._parent = parent;
  }

  get state(): TObj { return this._metaState; }
  get parent (): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented.', {}); }
  get theme(): unknown { return this.die('Not implemented.', {}); }

  /**
   * Get the metadata retrieved form the server.
   *
   * @param endpoint from which the metadata was retrieved.
   * @param key      of the exact metadata you want.
   */
  get = <T=unknown>(endpoint: string, key: string, $default: T): T => {
    try {
      const val = (this._metaState[endpoint] as TObj)?.[key];
      return val as T;
    } catch (e) {
      if (Config.DEBUG) {
        console.error(`Bad values passed to State.meta:
          either endpoint: '${endpoint}' or key: '${key}' or the data does not
          exist yet.`
        );
        console.error((e as Error).stack);
      }
      error_id(13).remember_error({
        code: 'MISSING_VALUE',
        title: `Bad values passed to State.meta:
          either endpoint: '${endpoint}' or key: '${key}' or the data does not
          exist yet.`,
        source: {
          parameter: `${endpoint}/${key}`
        },
        detail: (e as Error).stack
      }); // error 13
    }
    return $default;
  }
}
