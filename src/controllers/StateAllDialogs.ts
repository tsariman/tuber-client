import AbstractState from './AbstractState'
import type { IStateAllDialogs } from '../interfaces/localized'
import State from './State'
import { get_state } from '../state'

/** Wrapper class for `initialState.dialogs` */
export default class StateAllDialogs extends AbstractState {
  private _state: IStateAllDialogs
  private _parent?: State

  constructor(state: IStateAllDialogs, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): IStateAllDialogs { return this._state }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()))
  }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  configure(conf: unknown): void { void conf }
}
