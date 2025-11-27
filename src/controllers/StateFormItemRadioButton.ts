import AbstractState from './AbstractState'
import type { IFormChoices, IStateFormItemCustom } from '../interfaces/localized'
import type StateFormItemRadioCustom from './templates/StateFormItemRadioCustom'
import { type FormControlLabelProps, Radio } from '@mui/material'
import React from 'react'

/** Wrapper class for a radio button, specialized form item state */
export default class StateFormItemRadioButton
  extends AbstractState
  implements IFormChoices
{
  private _radioButtonState: IFormChoices
  private _parent: StateFormItemRadioCustom
  private _radioButtonHasState: IStateFormItemCustom

  constructor(radioButtonState: IFormChoices,
    parent: StateFormItemRadioCustom
  ) {
    super()
    this._radioButtonState = radioButtonState
    this._parent = parent
    this._radioButtonHasState = this._radioButtonState.has || {}
  }

  configure(conf: unknown): void { void conf }
  get state(): IFormChoices { return this._radioButtonState }
  get parent(): StateFormItemRadioCustom { return this._parent }
  get props(): Record<string, unknown> { return this._radioButtonState.props ?? {} }
  get name(): string { return this._radioButtonState.name ?? '' }
  get label(): string {
    return this._radioButtonState.label
      ?? this._radioButtonState.name
      ?? ''
  }
  get color(): Required<IFormChoices>['color'] {
    return this._radioButtonState.color || 'default'
  }
  get disabled(): boolean {
    return this._radioButtonState.disabled === true
  }
  get formControlLabelProps(): FormControlLabelProps {
    return this._radioButtonHasState.formControlLabelProps ?? {
      'control': React.createElement(Radio, {
        color: this.color,
        disabled: this.disabled,
        ...this.props
      }),
      'label': this.label
    }
  }
}
