import { ler } from '../business.logic/logging'
import { error_id } from '../business.logic/errors'
import type State from './State'
import AbstractState from './AbstractState'

/** Wrapper class for `initialState.staticRegistry` */
export default class StateRegistry extends AbstractState {
  private _state: Record<string, unknown>
  private _parent?: State
  constructor(state: Record<string, unknown>, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }
  configure(conf: unknown): void { void conf }
  get state(): Record<string, unknown> {
    return this._state
  }
  get parent(): State | undefined { return this._parent }
  get props(): Record<string, unknown> {
    return this.die('Not implemented', {})
  }
  get<T = unknown>(key: string, defaultValue?: T): T {
    try {
      const val = this._state[key]
      if (typeof val !== 'undefined') {
        return val as T
      }
      return defaultValue as T
    } catch (e) {
      ler(`StateRegistry.get(): error for key "${key}"`)
      error_id(15).remember_exception(e) // error 15
      return defaultValue as T
    }
  }
}