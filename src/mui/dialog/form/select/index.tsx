import type { JSX } from 'react';
import type { THive } from '..';
import StateForm from '../../../../controllers/StateForm';
import type StateFormItem from '../../../../controllers/StateFormItem';
import StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect';
import DialogSelectDefault from './default.select';
import DialogSelectNative from './native.select';
import type { IStateFormItemSelectOption } from '@tuber/shared';

interface IDialogSelect {
  def: StateFormItem<StateForm, IStateFormItemSelectOption>;
  hive: THive;
}

export default function DialogSelect ({def, hive}: IDialogSelect) {
  const formItemSelect = new StateFormItemSelect(def.state, def.parent);
  const table: { [type: string]: JSX.Element } = {
    'default': <DialogSelectDefault def={formItemSelect} hive={hive} />,
    'native': <DialogSelectNative def={formItemSelect} hive={hive} />
  };

  return table[formItemSelect._type.toLowerCase()];
}
