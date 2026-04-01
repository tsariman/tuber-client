import type { TO } from '@tuber/shared'
import AbstractState from './AbstractState'
import type State from './State'

/** Wrapper (controller) class for the `formsData` state. */
export default class StateFormsData extends AbstractState {
  private _state: TO
  private _parent?: State

  constructor (state: TO, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): TO { return this._state }
  get parent(): State | undefined { return this._parent }
  get props(): TO { return this.die<TO>('Not implemented.', {}) }

  /**
   * Get form field value from redux store.
   * 
   * @param formName Name of the form
   * @param name Name of the field
   */
  getValue = <T>(formName: string, name: string, $default?: T): T => {
    return ((this._state[formName] as TO<T>)?.[name] ?? $default) as T
  }

  /**
   * Alias for `getStoredValue()`
   *
   * @param formName
   * @param name
   */
  get = <T = TO>(formName: string): T => {
    return (this._state[formName] ?? {}) as T
  }

}
