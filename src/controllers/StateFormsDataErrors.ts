import AbstractState from './AbstractState'
import type { IStateFormsDataErrors } from '@tuber/shared'
import type State from './State'
import StateFormErrors from './StateFormErrors'

const EXCEPTION_MESSAGE = 'StateFormsDataErrors: configure instance with \'formName\''

/** Wrapper class for `initialState.formsDataErrors` */
export default class StateFormsDataErrors<T=unknown> extends AbstractState {
  private _state: IStateFormsDataErrors
  private _parent?: State
  private _formName?: string

  constructor (state: IStateFormsDataErrors, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get parent(): State | undefined { return this._parent }
  get state(): IStateFormsDataErrors { return this._state }
  get props(): unknown { return this.die('Not implemented yet.', {}) }

  configure({ formName }: { formName: string }) {
    this._formName = formName;
  }

  /** Returns the form's error count. */
  getCount(formName: string): number {
    let errorCount = 0;
    const formErrorsState = this._state[formName];
    for (const field in formErrorsState) {
      if (formErrorsState[field].error) {
        ++errorCount
      }
    }
    return errorCount
  }

  hasError(name: keyof T): boolean {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE)
    }
    const fieldName = name as string
    return this._state[this._formName]?.[fieldName]?.error
      ?? false
  }

  getError(name: keyof T): boolean {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE)
    }
    const n = name as string;
    return !!this._state[this._formName]?.[n]
  }

  getMessage(name: keyof T): string {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE);
    }
    const n = name as string
    return this._state[this._formName]?.[n]?.message ?? ''
  }

  get(): StateFormErrors {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE)
    }
    const formErrorsState = this._state[this._formName] ?? {}
    return new StateFormErrors(formErrorsState, this)
  }
}
