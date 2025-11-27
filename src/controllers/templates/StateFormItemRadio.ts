import type { FormControlProps, FormLabelProps } from '@mui/material';
import type StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';
import StateFormItemRadioCustom from './StateFormItemRadioCustom';
import type { IFormChoices } from '../../interfaces/localized';

export type TRadioStyle = 'default' | 'row';

export interface IRadioConfig {
  id?: string;
  props?: Record<string, unknown>;
  formControlProps?: FormControlProps;
  formLabelProps?: FormLabelProps;
}

/**
 * Radio button.
 *
 * When you create a radio buttons group, it is important for the
 * `formLabel.id` and the `formGroup['aria-labelledby']` to match.
 */
export default class StateFormItemRadio extends StateFormItem<
  StateForm,
  IFormChoices
> {
  private itemRadioHas?: StateFormItemRadioCustom;
  get has(): StateFormItemRadioCustom {
    return this.itemRadioHas || (
      this.itemRadioHas = new StateFormItemRadioCustom(this.itemHasState, this)
    );
  }
  get hasLabel(): boolean { return !!this.itemHasState.label; }
  private _config?: IRadioConfig;
  private _getConfig() { return this._config || (this._config = {}); }
  get props() {
    return {
      ...this._getConfig().props,
      ...this.itemState.props
    };
  }
  get formControlProps(): FormControlProps {
    return {
      ...this._getConfig().formControlProps,
      ...this.itemHasState.formControlProps
    };
  }
  get formLabelProps(): FormLabelProps {
    return {
      ...this._getConfig().formLabelProps,
      ...this.itemHasState.formLabelProps
    };
  }
  get config_id(): string | undefined {
    return this._getConfig().id;
  }
  private applyDefaultConfig() {
    const config = this._getConfig();
    config.id = 'demo-radio-buttons-group-label';
    config.formLabelProps = { id: config.id };
    config.props = {
      'aria-labelledby': config.id
    };
  }
  private _applyRowConfig() {
    const config = this._getConfig();
    config.id = 'demo-radio-buttons-group-label';
    config.formLabelProps = { id: config.id };
    config.props = {
      'aria-labelledby': config.id,
      row: true
    };
  }
  configure (type: TRadioStyle) {
    const table: {[type: string]: () => void} = {
      'default': this.applyDefaultConfig,
      'row': this._applyRowConfig
    };
    table[type.toLowerCase()]();
  }
}
