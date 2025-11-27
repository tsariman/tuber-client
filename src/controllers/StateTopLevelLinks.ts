import AbstractState from './AbstractState'
import type { IStateTopLevelLinks } from '@tuber/shared'
import State from './State'
import { get_state } from 'src/state'

/** Wrapper class for `initial.state.topLevelLinks` */
export default class StateTopLevelLinks extends AbstractState {
  private _state: IStateTopLevelLinks
  private _parent?: State

  constructor(state: IStateTopLevelLinks, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateTopLevelLinks { return this._state }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()))
  }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
}
