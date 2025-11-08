import type { TObj } from '@tuber/shared';
import AbstractState from './AbstractState';
import State from './State';
import { get_state } from '../state';

interface IConfigure {
  endpoint?: string;
}

/**
 * This class is a wrapper for the pages data JSON object.
 */
export default class StatePagesData extends AbstractState {
  private _endpoint?: string;
  private _pagesDataState: TObj;
  private _parent?: State;

  constructor(pagesDataState: TObj, parent?: State) {
    super();
    this._pagesDataState = pagesDataState;
    this._parent = parent;
  }

  get state(): TObj { return this._pagesDataState; }
  /** Chain-access to the root definition. */
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): TObj { return this.die('Not implemented.', {}); }
  get theme(): TObj { return this.die('Not implemented.', {}); }

  configure(opts: IConfigure): this {
    const { endpoint } = opts;
    this._endpoint = endpoint;

    return this;
  }

  get<T=unknown>(key: string): T {
    if (!this._endpoint) {
      throw new Error('Endpoint must be configured to access page data.');
    }
    return (this._pagesDataState[this._endpoint] as TObj<T>)[key];
  };
}
