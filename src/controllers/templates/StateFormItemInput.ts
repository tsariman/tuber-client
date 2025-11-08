import type { FormControlProps, InputLabelProps } from '@mui/material';
import StateFormItem from '../StateFormItem';

export type TInput = 'phone' | 'none';

export interface IInputConfig {
  formControlProps?: FormControlProps;
  inputLabelProps?: InputLabelProps;
  props?: Record<string, unknown>;
  id?: string;
}

export default class StateFormItemInput extends StateFormItem {
  private _config?: IInputConfig;
  private getConfig = () => {
    return this._config || (this._config = {});
  }

  get _type(): TInput {
    const t = this.itemState._type as TInput;
    return t || 'none';
  }

  get inputLabelProps() {
    return {
      ...this.getConfig().inputLabelProps,
      ...this.itemHasState.inputLabelProps
    };
  }

  get formControlProps() {
    return {
      ...this.getConfig().formControlProps,
      ...this.itemHasState.formControlProps
    };
  }

  get props() {
    return {
      ...this.getConfig().props,
      ...this.itemState.props
    };
  }

  private _applyPhoneConfig = () => {
    const config = this.getConfig();
    config.id = 'formatted-text-mask-input';
    config.formControlProps = {
      variant: 'standard'
    };
    config.inputLabelProps = {
      htmlFor: config.id
    };
    config.props = {
      id: config.id
    };
  }

  configure = (t: TInput) => {
    const table: {[t: string]: () => void} = {
      'phone': this._applyPhoneConfig
    };
    table[t.toLowerCase()]();
  }
}