import type { IStateFormErrors } from '@tuber/shared'
import AbstractState from './AbstractState'
import type StateFormsDataErrors from './StateFormsDataErrors'
import StateFormItemError from './StateFormItemError'

type TProfile = Record<string, StateFormItemError>

/** Wrapper class */
export default class StateFormErrors extends AbstractState {
  private _state: IStateFormErrors
  private _parent: StateFormsDataErrors
  private _profile?: TProfile

  constructor(state: IStateFormErrors, parent: StateFormsDataErrors) {
    super()
    this._state = state
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateFormErrors { return this._state }
  get parent(): StateFormsDataErrors { return this._parent }
  get props(): null { return null }

  select(name: string): StateFormItemError | undefined {
    const errorState = this._state[name]
    if (errorState) { return new StateFormItemError(errorState) }
    return undefined
  }

  private instantiateProfile(): TProfile {
    const profile: TProfile = {}
    Object.entries(this._state).forEach(entry => {
      const [ key, state ] = entry
      profile[key] = new StateFormItemError(state)
    })
    return profile
  }

  get profile(): TProfile {
    return (this._profile || (
      this._profile = this.instantiateProfile()
    ))
  }
}