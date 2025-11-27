import State from './State'
import AbstractState from './AbstractState'
import type { IJsonapiError } from '@tuber/shared'
import { get_state } from '../state'

/** Wrapper class for `initial.state.errors` */
export default class StateAllErrors extends AbstractState {
  private _state: IJsonapiError[]
  private _parent?: State

  constructor(state: IJsonapiError[], parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): IJsonapiError[] { return this._state }
  /** Chain-access to root definition. */
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()))
  }
  get props(): unknown { return this.die('Not implemented.', {}) }
  configure(conf: unknown): void { void conf }
}
