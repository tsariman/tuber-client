import {
  DATE_TIME_PICKER,
  DESKTOP_DATE_TIME_PICKER,
  MOBILE_DATE_TIME_PICKER,
  NAME_NOT_SET
} from '@tuber/shared';
// TODO - Uncomment the following after installing @mui/x-date-pickers
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { useState, type JSX, type ReactNode } from 'react';
import { type THive } from '.';
import type {
  StateForm,
  StateFormItem
} from '../../../controllers';
import { error_id } from '../../../business.logic/errors';
import { log } from '../../../business.logic/logging';

interface IJsonPickerProps {
  def: StateFormItem<StateForm>;
  hive: THive;
}

interface IPickerTable {
  [constant: string]: () => JSX.Element;
}

// TODO - Delete everything inbetween is installing date and time pickers =====

/** Delete me */
interface IFakeProps {
  dateAdapter?: Record<string, unknown>;
  children?: ReactNode;
  renderInput?: (props: TextFieldProps) => JSX.Element;
  value?: unknown;
  onChange?: unknown;
  label?: string;
}
/** Delete me */
const DateTimePicker = (props: IFakeProps) => { void props;return null};
/** Delete me */
const MobileDateTimePicker = (props: IFakeProps) => { void props;return null};
/** Delete me */
const DesktopDateTimePicker = (props: IFakeProps) => { void props; return null};
/** Delete me */
const AdapterDayjs = {};
/** Delete me */
const LocalizationProvider = (props: IFakeProps) => {void props;return null;};

// ============================================================================

export default function DialogPicker({ def, hive }: IJsonPickerProps) {
  const [value, setValue] = useState<string>();

  const handleChange = (newValue: string | null) => {
    setValue(newValue ?? '');
    hive[def.name] = newValue;
  }

  const table: IPickerTable = {
    [DATE_TIME_PICKER]: () => (
      <DateTimePicker
        label="DateTimePicker"
        {...def.props}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
        value={value}
        onChange={handleChange}
      />
    ),
    [MOBILE_DATE_TIME_PICKER]: () => (
      <MobileDateTimePicker
        label="For mobile"
        {...def.props}
        value={value}
        onChange={handleChange}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
    [DESKTOP_DATE_TIME_PICKER]: () => (
      <DesktopDateTimePicker
        label="For desktop"
        {...def.props}
        value={value}
        onChange={handleChange}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
  };

  try {
    const constant = def.type.replace(/\s+/, '').toLowerCase();
    return def.nameProvided
      ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          { table[constant]() }
        </LocalizationProvider>
      )
      : <TextField value={`PICKER ${NAME_NOT_SET}`} disabled />;
  } catch (e) {
    error_id(18).remember_exception(e); // error 18
    log((e as Error).message);
  }

  return (null);
}
