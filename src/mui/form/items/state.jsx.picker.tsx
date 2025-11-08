// [TODO] Setup date/time picker input field when needed. 
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { StateFormItem, StateFormsData } from '../../../controllers';
import type { RootState } from '../../../state';
import { error_id } from '../../../business.logic/errors';
import {
  DATE_TIME_PICKER,
  DESKTOP_DATE_TIME_PICKER,
  MOBILE_DATE_TIME_PICKER,
  NAME_NOT_SET
} from '@tuber/shared/dist/constants.client';
import { log } from '../../../business.logic/logging';
import type { JSX, ReactNode } from 'react';

interface IJsonPickerProps { def: StateFormItem; }

interface IPickerTable {
  [constant: string]: () => JSX.Element;
}

// DELETE ANYTHING BETWEEN ====================================================

interface IDummyPickerProps {
  label?: string;
  renderInput: (p: TextFieldProps) => ReactNode;
  value: unknown
  onChange: (e: unknown) => void;
}
function DateTimePicker (props: IDummyPickerProps) {
  void props;
  return <TextField value='<DateTimePicker msg="NOT AVAILABLE" />' />;
}
const MobileDateTimePicker = DateTimePicker;
const DesktopDateTimePicker = DateTimePicker;
const AdapterDayjs = {};
type ILProvider = { dateAdapter: unknown; children: unknown; };
function LocalizationProvider(props: ILProvider) {
  void props;
  return null;
}
function handleChange(arg: unknown) { void arg; return () => {};}

// DELETE END =================================================================


export default function StateJsxPicker({ def }: IJsonPickerProps) {
  const { name, parent: { name: formName } } = def;
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const value = formsData.getValue(formName, name, null);

  const table: IPickerTable = {
    [DATE_TIME_PICKER]: () => (
      <DateTimePicker
        label="DateTimePicker"
        {...def.props}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
        value={value}
        onChange={handleChange(name)}
      />
    ),
    [MOBILE_DATE_TIME_PICKER]: () => (
      <MobileDateTimePicker
        label="For mobile"
        {...def.props}
        value={value}
        onChange={handleChange(name)}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
    [DESKTOP_DATE_TIME_PICKER]: () => (
      <DesktopDateTimePicker
        label="For desktop"
        {...def.props}
        value={value}
        onChange={handleChange(name)}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
  };

  try {
    const constant = def.type.replace(/\s+/, '').toLowerCase()
    return def.nameProvided
      ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          { table[constant]() }
        </LocalizationProvider>
      )
      : <TextField value={`PICKER ${NAME_NOT_SET}`} disabled />;
  } catch (e) {
    error_id(26).remember_exception(e); // error 26
    log((e as Error).message);
  }

  return (null);
}
