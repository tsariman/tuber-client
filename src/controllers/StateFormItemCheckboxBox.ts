import type { IFormChoices } from '../interfaces/localized'
import type StateFormItemCheckboxCustom from './templates/StateFormItemCheckboxCustom'
import type { TFormControlLabelProps } from '@tuber/shared'
import AbstractState from './AbstractState'
import StateFormItemCustom from './StateFormItemCustom'

/** Wrapper class */
export default class StateFormItemCheckboxBox
  extends AbstractState implements IFormChoices
{
  private _checkboxState: IFormChoices
  private _parent: StateFormItemCheckboxCustom
  private _checkboxHas?: StateFormItemCustom<this>

  constructor(checkboxState: IFormChoices, parent: StateFormItemCheckboxCustom) {
    super()
    this._checkboxState = checkboxState
    this._parent = parent
  }

  get state(): IFormChoices { return this._checkboxState }
  get parent(): StateFormItemCheckboxCustom { return this._parent }
  get name(): string { return this._checkboxState.name ?? '' }
  get label(): string { return this._checkboxState.label ?? '' }
  get color(): Required<IFormChoices>['color'] {
    return this._checkboxState.color || 'default'
  }
  get disabled(): boolean|undefined { return this._checkboxState.disabled }
  get props(): Record<string, unknown> { return this._checkboxState.props ?? {} }
  configure(conf: unknown): void { void conf }
  get has(): StateFormItemCustom<this> {
    return this._checkboxHas || (
      this._checkboxHas = new StateFormItemCustom(
        this._checkboxState.has || {},
        this
      )
    )
  }
  get hasLabel(): boolean { return !!this._checkboxState.label }
  get formControlLabelProps(): TFormControlLabelProps {
    return this.has.formControlLabelProps ?? {
      'label': this.label
    }
  }
}
