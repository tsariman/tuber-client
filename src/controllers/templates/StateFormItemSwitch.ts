import type {
  FormControlLabelProps,
  FormControlProps,
  FormGroupProps,
  FormHelperTextProps,
  FormLabelProps
} from '@mui/material';
import type StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';
import type StateFormItemSwitchToggle from '../StateFormItemSwitchToggle';

export interface ISwitchConfig {
  formControlLabelProps?: FormControlLabelProps;
  formControlProps?: FormControlProps;
  formGroupProps?: FormGroupProps;
  formLabelProps?: FormLabelProps;
  formHelperTextProps?: FormHelperTextProps;
}

export default class StateFormItemSwitch extends StateFormItem<
  StateForm,
  StateFormItemSwitchToggle
> {
  private _config?: ISwitchConfig;

  private _getConfig() { return this._config || (this._config = {}); }

  get formControlProps(): FormControlProps {
    return {
      ...this._getConfig().formControlProps,
      ...this.itemHasState.formControlProps
    };
  }

  get formGroupProps(): FormGroupProps {
    return {
      ...this._getConfig().formGroupProps,
      ...this.itemHasState.formGroupProps
    };
  }

  get formLabelProps(): FormLabelProps {
    return {
      ...this._getConfig().formLabelProps,
      ...this.itemHasState.formLabelProps
    };
  }

  get formControlLabelProps(): FormControlLabelProps {
    return {
      ...this._getConfig().formControlLabelProps,
      ...this.itemHasState.formControlLabelProps
    } as FormControlLabelProps;
  }

  get formHelperTextProps(): FormHelperTextProps {
    return {
      ...this._getConfig().formHelperTextProps,
      ...this.itemHasState.formHelperTextProps
    };
  }

}
