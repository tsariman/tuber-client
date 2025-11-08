import AbstractState from './AbstractState';
import type { IStateTopLevelLinks } from '@tuber/shared';
import State from './State';
import { get_state } from '../state';

export default class StateTopLevelLinks extends AbstractState {
  private _topLevelLinksState: IStateTopLevelLinks;
  private _parent?: State;

  constructor(topLevelLinksState: IStateTopLevelLinks, parent?: State) {
    super();
    this._topLevelLinksState = topLevelLinksState;
    this._parent = parent;
  }

  get state(): IStateTopLevelLinks { return this._topLevelLinksState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}
