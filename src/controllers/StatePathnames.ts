import AbstractState from './AbstractState';
import type { IStatePathnames } from '@tuber/shared';
import State from './State';
import { get_state } from '../state';

export default class StatePathnames extends AbstractState {
  private _pathnamesState: IStatePathnames;
  private _parent?: State;
  constructor(pathnamesState: IStatePathnames, parent?: State) {
    super();
    this._pathnamesState = pathnamesState;
    this._parent = parent;
  }
  get state(): IStatePathnames { return this._pathnamesState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): Record<string, unknown> { return this.die('Method not implemented.', {}); }
  get theme(): Record<string, unknown> { return this.die('Method not implemented.', {}); }

  get DIALOGS(): string { return this.state.dialogs ?? 'state/dialogs'; }
  get FORMS(): string { return this.state.forms ?? 'state/forms'; }
  get PAGES(): string { return this.state.pages ?? 'state/pages'; }
}