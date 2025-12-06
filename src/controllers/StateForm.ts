import type { IDummyEvent } from '@tuber/shared'
import type { IStateForm } from '../interfaces/localized'
import type { PaperProps } from '@mui/material'
import StateAllForms from './StateAllForms'
import AbstractState from './AbstractState'
import StateFormItem from './StateFormItem'
import type { IStateFormConfig } from '../interfaces/IControllerConfiguration'
import type StateFormsDataErrors from './StateFormsDataErrors'

/** Wrapper class for a form state located in the `initialState.forms` object */
export default class StateForm extends AbstractState implements IStateForm {
  private _formState: IStateForm
  private _parent: StateAllForms
  private _formItems?: StateFormItem[]
  private _ePoint?: string
  private _fname: string
  private _formsDataErrors?: StateFormsDataErrors

  constructor (_formState: IStateForm, parent: StateAllForms) {
    super()
    this._formState = _formState
    this._parent = parent
    if (this._parent instanceof StateAllForms) {
      this._fname = this.parent.getLastFormName()
    } else {
      this._fname = ''
    }
  }

  get state(): IStateForm { return this._formState }
  /** Chain-access to all forms definition. */
  get parent(): StateAllForms { return this._parent }
  get props(): Record<string, unknown> {
    return {
      autoComplete: 'off',
      component: 'form',
      onSubmit: (e: IDummyEvent) => e.preventDefault(),
      ...this._formState.props
    }
  }
  /** Whether the form should have a paper background or not. */
  get paperBackground(): boolean { return !!this._formState.paperBackground }
  get _type(): Required<IStateForm>['_type'] {
    switch (this._formState._type) {
    case 'stack':
    case 'box':
    case 'none':
      return this._formState._type
    case 'form':
    case 'selection':
    case 'alert':
    case 'any':
      return this.die(
        `${this._formState._type} is NOT a valid form type.`, 'none'
      )
    }
    return 'none'
  }
  configure({ formsDataErrors }: IStateFormConfig): void {
    this._formsDataErrors = formsDataErrors
  }
  /** Form name */
  get _key(): string { return this._formState._key ?? '' }
  /** Get (chain-access) list of form fields definition. */
  get items(): StateFormItem[] {
    return this._formItems
      || (this._formItems = (this._formState.items || []).map(
          item => new StateFormItem(item, this)
        ))
  }
  /**
   * Get the form name, (`formName`). This is an _alias_ for `_key`.
   */
  get name(): string { return this._formState._key ?? this._fname }
  get endpoint(): string { return this._ePoint ?? '' }
  get paperProps(): PaperProps { return this._formState.paperProps ?? {} }
  get errorCount(): number {
    return this._formsDataErrors?.getCount(this.name) ?? this.throw_if_not_configured(
      'StateForm instance not configured with formsDataErrors'
    )
  }
  set endpoint(ep: string) { this._ePoint = ep }
}
