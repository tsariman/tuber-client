import AbstractState from './AbstractState'
import type State from './State'
import { ler } from '../business.logic/logging'
import { is_record } from '../business.logic/utility'
import type { IStateTmpConfig } from '../interfaces/IControllerConfiguration'

/** Wrapper class for `initialState.tmp` */
export default class StateTmp extends AbstractState {
  private _state: Record<string, unknown>
  private _parent?: State

  constructor(state: Record<string, unknown>, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): Record<string, unknown> { return this._state }
  get parent(): State | undefined { return this._parent }
  get props(): Record<string, unknown> { return this.die('Not implemented yet.', {}) }

  configure (opts: IStateTmpConfig): void { void opts }

  get = <T=unknown>(key: string, name: string, $default: T): T => {
    const obj = this._state[key]
    if (is_record(obj)) {
      const val = obj[name] ?? $default
      return val as T
    }
    ler(`StateTmp: tmp['${key}'] is not an object.`)
    return $default
  }

}
