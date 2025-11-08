import type {
  FormControlLabelProps,
  FormControlProps,
  FormHelperTextProps,
  InputLabelProps
} from '@mui/material';
import type { IStateFormItemSelectOption } from '@tuber/shared';
import type StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';

export type TSelectStyle = 'default' | 'basic' | 'standard' | 'filled' | 'native'
                            | 'auto_width' | 'small_size' | 'multiple_default'
                            | 'multiple_checkmarks' | 'multiple_chip'
                            | 'multiple_placeholder' | 'multiple_native'
                            | 'grouping' | 'native_grouping';

export interface ISelectConfig {
  formControlProps?: FormControlProps;
  formHelperTextProps?: FormHelperTextProps;
  formControlLabelProps?: FormControlLabelProps;
  inputLabelProps?: InputLabelProps;
  props?: Record<string, unknown>;
  id?: string;
}

export default class StateFormItemSelect
  extends StateFormItem<StateForm, IStateFormItemSelectOption>
{
  private _config?: ISelectConfig;

  /** Select `type`. */
  get _type(): TSelectStyle {
    const type = this.itemState._type as TSelectStyle;
    return type || 'default';
  }

  private _getConfig = () => {
    return this._config || (this._config = {});
  }

  get props() {
    return {
      ...this._getConfig().props,
      ...this.itemState.props
    };
  }

  get formControlProps(): FormControlProps {
    return {
      variant: 'standard',
      ...this._getConfig().formControlProps,
      ...this.itemHasState.formControlProps
    };
  }

  get formControlLabelProps(): FormControlLabelProps {
    return {
      ...this._getConfig().formControlLabelProps,
      ...this.itemHasState.formControlLabelProps
    } as FormControlLabelProps;
  }
  get inputLabelProps(): InputLabelProps {
    return {
      ...this._getConfig().inputLabelProps,
      ...this.itemHasState.inputLabelProps
    };
  }

  get formHelperTextProps(): FormHelperTextProps {
    return {
      ...this._getConfig().formHelperTextProps,
      ...this.itemHasState.formHelperTextProps
    };
  }

  get config_id(): string | undefined {
    return this._getConfig().id;
  }

  private _applyBasicConfig = () => {
    const config = this._getConfig()
    config.formControlProps = {
      fullWidth: true
    };
    config.id = 'demo-simple-select-label';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-simple-select'
    };
  };

  private _applyStandardConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {
      variant: 'standard',
      sx: {m: 1, minWidth: 120 }
    };
    config.id = "demo-simple-select-standard-label";
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-simple-select-standard'
    };
  };

  private _applyFilledConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {
      variant: 'filled',
      sx: { m: 1, minWidth: 120 },
    };
    config.id = 'demo-simple-select-filled-label';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-simple-select-filled'
    };
  };

  private _applyAutoWidthConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {
      sx: { m: 1, minWidth: 80 }
    };
    config.id = 'demo-simple-select-autowidth-label';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-simple-select-autowidth',
      autoWidth: true
    };
  };

  private _applySmallSizeConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {
      sx: { m: 1, minWidth: 120 },
      size: 'small'
    };
    config.id = 'demo-select-small';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: config.id
    };
  };

  private _applyNativeConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {
      fullWidth: true
    };
    config.id = 'uncontrolled-native';
    config.inputLabelProps = {
      variant: 'standard',
      htmlFor: config.id
    };
    config.props = {
      inputProps: { id: config.id }
    };
  };

  private _applyMultipleDefaultConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, minWidth: 300 }};
    config.id = 'demo-multiple-name-label';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-multiple-name',
      multiple: true
    };
  };

  private _applyMultipleCheckmarksConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, minWidth: 300 }};
    config.id = 'demo-multiple-checkbox-label';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-multiple-checkbox',
      multiple: true
    };
  };

  private _applyMultipleChipConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, width: 300 }};
    config.id = 'demo-multiple-chip-label';
    config.inputLabelProps = { id: config.id };
    config.props = {
      labelId: config.id,
      id: 'demo-multiple-chip',
      multiple: true
    };
  };

  private _applyMultiplePlaceholderConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, width: 300, mt: 3 }};
    config.props = {
      multiple: true,
      displayEmpty: true
    };
  };

  private _applyMultipleNativeConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, minWidth: 120, maxWidth: 300 }};
    config.inputLabelProps = {
      shrink: true,
      htmlFor: 'select-multiple-native'
    };
    config.props = {
      multiple: true,
      native: true,
    };
  };

  private _applyGroupingConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, minWidth: 120 }};
    config.id = 'grouped-select';
    config.inputLabelProps = {
      htmlFor: config.id
    };
    config.props = {
      id: config.id,
      label: 'Grouping'
    };
  };

  private _applyNativeGroupingConfig = () => {
    const config = this._getConfig();
    config.formControlProps = {sx: { m: 1, minWidth: 120 }};
    config.id = 'grouped-native-select';
    config.inputLabelProps = {
      htmlFor: config.id
    };
    config.props = {
      native: true,
      id: config.id,
      label: 'Grouping'
    };
  };

  /**
   * Use to morph component to 
   * @param type 
   */
  configure = (type: TSelectStyle) => {
    const table: {[type: string]: () => void} = {
      'basic': this._applyBasicConfig,
      'standard': this._applyStandardConfig,
      'filled': this._applyFilledConfig,
      'native': this._applyNativeConfig,
      'auto_width': this._applyAutoWidthConfig,
      'small_size': this._applySmallSizeConfig,
      'multiple_default': this._applyMultipleDefaultConfig,
      'multiple_checkmarks': this._applyMultipleCheckmarksConfig,
      'multiple_chip': this._applyMultipleChipConfig,
      'multiple_placeholder': this._applyMultiplePlaceholderConfig,
      'multiple_native': this._applyMultipleNativeConfig,
      'grouping': this._applyGroupingConfig,
      'native_grouping': this._applyNativeGroupingConfig
    }
    table[type.toLowerCase()]();
  };
}
