import AbstractState from './AbstractState'
import type { IStateTopLevelLinks } from '@tuber/shared'
import type State from './State'

/** Wrapper class for `initialState.topLevelLinks` */
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
  get parent(): State | undefined { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
}
