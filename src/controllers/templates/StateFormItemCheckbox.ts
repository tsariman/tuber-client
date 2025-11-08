import type { IFormChoices } from '../../localized/interfaces';
import type StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';
import StateFormItemCheckboxCustom from './StateFormItemCheckboxCustom';

export default class StateFormItemCheckbox extends StateFormItem<
  StateForm,
  IFormChoices
> {
  private _itemCheckboxHas?: StateFormItemCheckboxCustom;
  get has(): StateFormItemCheckboxCustom {
    return this._itemCheckboxHas || (
      this._itemCheckboxHas = new StateFormItemCheckboxCustom(
        this.itemHasState,
        this
      )
    );
  }
}
