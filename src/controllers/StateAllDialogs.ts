import AbstractState from './AbstractState';
import type { IStateAllDialogs } from '../localized/interfaces';
import State from './State';
import { get_state } from '../state';

export default class StateAllDialogs extends AbstractState {
  private _allDialogsState: IStateAllDialogs;
  private _parent?: State;

  constructor(allDialogsState: IStateAllDialogs, parent?: State) {
    super();
    this._allDialogsState = allDialogsState;
    this._parent = parent;
  }

  get state(): IStateAllDialogs { return this._allDialogsState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}
