import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { NAME_NOT_SET } from '@tuber/shared';
import {
  type StateFormItemSelect,
  StateFormsData
} from '../../../../controllers';
import type { RootState } from '../../../../state';
import type { TFormItemDefaultEventHandler } from '../_items.common.logic';

interface IDialogSelectNative { def: StateFormItemSelect; }

export default function StateJsxSelectNative (
  { def: select }: IDialogSelectNative
) {
  const { name, parent: { name: formName } } = select;
  select.configure('native');
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const getValue = () => formsData.getValue(formName, name, '');

  return name ? (
    <FormControl {...select.formControlProps}>
      <InputLabel {...select.inputLabelProps}>
        { select.text }
      </InputLabel>
      <NativeSelect
        {...select.props}
        value={getValue()}
        inputProps={{
          name: select.name,
          id: select.config_id,
        }}
        onChange={(select.onChange as TFormItemDefaultEventHandler)(name)}
      >
        <option value=''></option>
        {select.has.items.map((option, i) => (
          <option value={option.value} key={`select-menu-option${i}`}>
            { option.title || option.value }
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  ) : (
    <TextField value={`SELECT ${NAME_NOT_SET}`} disabled />
  );
}
