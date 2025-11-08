import type { IStateFormItemError } from '@tuber/shared'
import AbstractState from './AbstractState'

export default class StateFormItemError
  extends AbstractState
  implements IStateFormItemError
{
  private _state: IStateFormItemError

  constructor (state: IStateFormItemError) {
    super()
    this._state = state
  }

  get state(): IStateFormItemError { return this._state }
  get parent(): null { return null }
  get props(): null { return null }
  get theme(): null { return null }

  get not() { return { required: !this._state.required } }
  get is() {
    return { required: this.required, not: { required: !this._state.required } }
  }
  get has() { return {
    no: {
      maxLength: !this._state.maxLength,
    },
    a: {
      maxLength: !!this._state.maxLength
    }
  }}

  // Implement IStateFormItemError interface
  get error(): boolean { return !!this._state.error }
  get required(): boolean { return !!this._state.required }
  get message(): string | undefined { return this._state.message }
  get requiredMessage(): string | undefined { return this._state.requiredMessage }
  get maxLength(): number | undefined { return this._state.maxLength }
  get maxLengthMessage(): string | undefined { return this._state.maxLengthMessage }
  get disableOnError(): boolean { return !!this._state.disableOnError }
  get invalidationRegex(): string | undefined { return this._state.invalidationRegex }
  get invalidationMessage(): string | undefined { return this._state.invalidationMessage }
  get validationRegex(): string | undefined { return this._state.validationRegex }
  get validationMessage(): string | undefined { return this._state.validationMessage }
  get mustMatch(): string | undefined { return this._state.mustMatch }
  get mustMatchMessage(): string | undefined { return this._state.mustMatchMessage }
}