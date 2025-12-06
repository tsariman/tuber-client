import AbstractState from './AbstractState'
import type { IStateAllDialogs } from '../interfaces/localized'
import type State from './State'

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
  get parent(): State | undefined { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  configure(conf: unknown): void { void conf }
}
