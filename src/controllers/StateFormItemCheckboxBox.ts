import React from 'react';
import type { IFormChoices } from '../localized/interfaces';
import type StateFormItemCheckboxCustom from './templates/StateFormItemCheckboxCustom';
import type { CSSProperties } from 'react';
import type { FormControlLabelProps } from '@mui/material';
import AbstractState from './AbstractState';
import StateFormItemCustom from './StateFormItemCustom';

export default class StateFormItemCheckboxBox
  extends AbstractState implements IFormChoices
{
  private _checkboxState: IFormChoices;
  private _parent: StateFormItemCheckboxCustom;
  private _checkboxHas?: StateFormItemCustom<this>;

  constructor(checkboxState: IFormChoices, parent: StateFormItemCheckboxCustom) {
    super();
    this._checkboxState = checkboxState;
    this._parent = parent;
  }

  get state(): IFormChoices { return this._checkboxState; }
  get parent(): StateFormItemCheckboxCustom { return this._parent; }
  get name(): string { return this._checkboxState.name ?? ''; }
  get label(): string { return this._checkboxState.label ?? ''; }
  get color(): Required<IFormChoices>['color'] {
    return this._checkboxState.color || 'default';
  }
  get disabled(): boolean|undefined { return this._checkboxState.disabled; }
  get props(): Record<string, unknown> { return this._checkboxState.props ?? {}; }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}); }
  get has(): StateFormItemCustom<this> {
    return this._checkboxHas || (
      this._checkboxHas = new StateFormItemCustom(
        this._checkboxState.has || {},
        this
      )
    );
  }
  get hasLabel(): boolean { return !!this._checkboxState.label; }
  get formControlLabelProps(): FormControlLabelProps {
    return this.has.formControlLabelProps ?? {
      'control': React.createElement('input', { type: 'checkbox' }),
      'label': this.label
    };
  }
}
