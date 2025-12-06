import AbstractState from './AbstractState'
import type State from './State'
import { type AppDispatch } from '../state'
import { ler } from '../business.logic/logging'
import { tmpRemove } from '../slices/tmp.slice'
import { is_record } from '../business.logic/utility'
import type { IStateTmpConfig } from '../interfaces/IControllerConfiguration'

/** Wrapper class for `initialState.tmp` */
export default class StateTmp extends AbstractState {
  private _state: Record<string, unknown>
  private _parent?: State
  private _dispatch?: AppDispatch

  constructor(state: Record<string, unknown>, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): Record<string, unknown> { return this._state }
  get parent(): State | undefined { return this._parent }
  get props(): Record<string, unknown> { return this.die('Not implemented yet.', {}) }

  configure ({ dispatch }: IStateTmpConfig): void {
    this._dispatch = dispatch
  }

  private _removeTemporaryValue(id: string): void {
    if (this._dispatch) {
      this._dispatch(tmpRemove(id))
      return
    }
    error_msg('configure instance with dispatch.')
  }

  get = <T=unknown>(key: string, name: string, $default: T): T => {
    const obj = this._state[key]
    if (is_record(obj)) {
      const val = obj[name] ?? $default
      this._removeTemporaryValue(key)
      return val as T
    }
    return $default
  }

  set = <T=unknown>(id: string, name: string, value: T): void => {
    if (this._dispatch) {
      this._dispatch({
        type: 'tmp/tmpAdd',
        payload: { id, name, value }
      })
      return
    }
    error_msg('configure instance with dispatch.')
  }
}

function error_msg(msg: string) {
  ler(`StateTmp: ${msg}`)
}