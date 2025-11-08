import AbstractState from './AbstractState';
import type { TStatePathnames } from '@tuber/shared';
import State from './State';
import { get_state } from '../state';

export default class StatePathnames extends AbstractState {
  private _state: TStatePathnames;
  private _parent?: State;
  constructor(state: TStatePathnames, parent?: State) {
    super();
    this._state = state;
    this._parent = parent;
  }
  get state(): TStatePathnames { return this._state; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): Record<string, unknown> { return this.die('Method not implemented.', {}); }
  get theme(): Record<string, unknown> { return this.die('Method not implemented.', {}); }

  get DIALOGS(): string { return this.state.dialogs ?? 'state/dialogs'; }
  get FORMS(): string { return this.state.forms ?? 'state/forms'; }
  get PAGES(): string { return this.state.pages ?? 'state/pages'; }
}