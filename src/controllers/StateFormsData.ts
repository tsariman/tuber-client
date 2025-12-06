import type { TObj } from '@tuber/shared'
import AbstractState from './AbstractState'
import type State from './State'

/** Wrapper class for `initialState.formsData` */
export default class StateFormsData extends AbstractState {
  private _state: TObj
  private _parent?: State

  constructor (state: TObj, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): TObj { return this._state }
  get parent(): State | undefined { return this._parent }
  get props(): TObj { return this.die<TObj>('Not implemented.', {}) }

  /**
   * Get form field value from redux store.
   * 
   * @param formName Name of the form
   * @param name Name of the field
   */
  getValue = <T>(formName: string, name: string, $default?: T): T => {
    return ((this._state[formName] as TObj<T>)?.[name] ?? $default) as T
  }

  /**
   * Alias for `getStoredValue()`
   *
   * @param formName
   * @param name
   */
  get = <T = TObj>(formName: string): T => {
    return (this._state[formName] ?? {}) as T
  }

}
