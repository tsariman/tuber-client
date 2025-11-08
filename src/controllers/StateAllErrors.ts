import State from './State';
import AbstractState from './AbstractState';
import type { IJsonapiError } from '@tuber/shared';
import { get_state } from '../state';

export default class StateAllErrors extends AbstractState {
  private _allErrorsState: IJsonapiError[];
  private _parent?: State;

  constructor(allErrorsState: IJsonapiError[], parent?: State) {
    super();
    this._allErrorsState = allErrorsState;
    this._parent = parent;
  }

  get state(): IJsonapiError[] { return this._allErrorsState; }
  /** Chain-access to root definition. */
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented.', {}); }
  get theme(): unknown { return this.die('Not implemented.', {}); }
}
