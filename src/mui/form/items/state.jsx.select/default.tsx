import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {
  type StateFormItemSelect,
  StateFormsData
} from '../../../../controllers';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../state';
import { NAME_NOT_SET } from '@tuber/shared';
import type { TFormItemDefaultEventHandler } from '../_items.common.logic';

interface IDialogSelectDefault { def: StateFormItemSelect; }

export default function StateJsxSelectDefault (
  { def: select }: IDialogSelectDefault
) {
  const { name, parent: { name: formName } } = select;
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const getValue = () =>  formsData.getValue(formName, name, '');

  return name ? (
    <FormControl {...select.formControlProps}>
      <InputLabel {...select.inputLabelProps}>
        { select.text }
      </InputLabel>
      <Select
        {...select.props}
        value={getValue()}
        onChange={(select.onChange as TFormItemDefaultEventHandler)(name)}
      >
        <MenuItem value=''></MenuItem>
        {select.has.items.map((item, i) => (
          <MenuItem value={item.value} key={`select-menu-item${i}`}>
            { item.label || item.title || item.value }
          </MenuItem>
        ))}
      </Select>
      {select.has.helperText ? (
        <FormHelperText {...select.formHelperTextProps}>
          { select.has.helperText }
        </FormHelperText>
      ): ( null )}
    </FormControl>
  ) : (
    <TextField value={`SELECT ${NAME_NOT_SET}`} disabled />
  );
}
