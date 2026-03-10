import AbstractState from './AbstractState'
import type { IStateFormItemSwitchToggle, TFormControlLabelProps } from '@tuber/shared'
import type StateFormItemSwitch from './templates/StateFormItemSwitch'

/** Wrapper class for switch toggle, specialized form item state */
export default class StateFormItemSwitchToggle
  extends AbstractState
  implements IStateFormItemSwitchToggle
{
  private _switchToggleState: IStateFormItemSwitchToggle
  private _parent: StateFormItemSwitch

  constructor (switchToggleState: IStateFormItemSwitchToggle,
    parent: StateFormItemSwitch
  ) {
    super()
    this._switchToggleState = switchToggleState
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateFormItemSwitchToggle { return this._switchToggleState }
  get parent(): StateFormItemSwitch { return this._parent }
  get props(): Record<string, unknown> { return this._switchToggleState.props ?? {} }

  get label(): string { return this._switchToggleState.label ?? '' }
  get name(): string { return this._switchToggleState.name ?? '' }

  get formControlLabelProps(): TFormControlLabelProps {
    return this._switchToggleState.formControlLabelProps ?? {
      'label': this.label
    }
  }
}