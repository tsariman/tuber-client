import Controller from './AbstractState'
import type State from './State'
import StateForm from './StateForm'
import type { TStateAllForms } from '../interfaces/localized'
import { log } from '../business.logic/logging'

/** Wrapper class for `initialState.forms` */
export default class StateAllForms extends Controller {
  private _state: TStateAllForms
  private _parent?: State
  private _lastFormName: string

  constructor (state: TStateAllForms, parent?: State) {
    super()
    this._state = state
    this._parent = parent
    this._lastFormName = ''
  }

  get state(): TStateAllForms { return this._state }
  /** Chain-access to root definition. */
  get parent(): State | undefined { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  configure(conf: unknown): void { void conf }

  getForm = (name: string): StateForm | null => {
    const formName = this.getStateFormName(name)
    const formState = this._state[formName]

    if (formState) {
      this._lastFormName = formName
      const formDef = new StateForm(formState, this)

      return formDef
    }

    log(`${formName} not found or misspelled.`)
    return null
  }

  /**
   * Get the (`formName`) name of the last form that was retrieved.
   */
  getLastFormName = (): string => this._lastFormName

  /**
   * Get the form state name
   *
   * __Problem__: We needed a way to get the `formName` without the use of any
   * other information. This problem arised while attempting to display a form
   * in the fullscreen dialog of the virtualized table, which appears when
   * clicking on a row to edit or view data in greater detail.
   *
   * @param name 
   */
  private getStateFormName = (name: string): string => {
    return name + 'Form'
  }

}
