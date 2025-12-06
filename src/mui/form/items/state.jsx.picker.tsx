// [TODO] Setup date/time picker input field when needed. 
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
// import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { StateFormItem, StateFormsData } from '../../../controllers'
import type { AppDispatch, RootState } from '../../../state'
import { error_id } from '../../../business.logic/errors'
import {
  DATE_TIME_PICKER,
  DESKTOP_DATE_TIME_PICKER,
  MOBILE_DATE_TIME_PICKER,
  NAME_NOT_SET
} from '@tuber/shared/dist/constants.client'
import { log } from '../../../business.logic/logging'
import { useCallback, type JSX, type ReactNode } from 'react'

interface IJsonPickerProps { instance: StateFormItem }

interface IMapProps {
  instance: StateFormItem
  value: string | null
  handleChange: (date: unknown) => void
}

interface IPickerMap {
  [constant: string]: (props: IMapProps) => JSX.Element
}

// DELETE ANYTHING BETWEEN ====================================================

interface IDummyPickerProps {
  label?: string
  renderInput: (p: TextFieldProps) => ReactNode
  value: unknown
  onChange: (e: unknown) => void
}
function DateTimePicker (props: IDummyPickerProps) {
  void props
  return <TextField value='<DateTimePicker msg="NOT AVAILABLE" />' />
}
const MobileDateTimePicker = DateTimePicker
const DesktopDateTimePicker = DateTimePicker
const AdapterDayjs = {}
type ILProvider = { dateAdapter: unknown; children: unknown }
function LocalizationProvider(props: ILProvider) {
  void props
  return null
}
// function handleChange(arg: unknown) { void arg; return () => {}}

// DELETE END =================================================================

const pickerMap: IPickerMap = {
  [DATE_TIME_PICKER]: (
    { instance: picker, value, handleChange }: IMapProps
  ) => (
    <DateTimePicker
      label="DateTimePicker"
      {...picker.props}
      renderInput={(props: TextFieldProps) => <TextField {...props} />}
      value={value}
      onChange={handleChange}
    />
  ),
  [MOBILE_DATE_TIME_PICKER]: (
    { instance: picker, value, handleChange }: IMapProps
  ) => (
    <MobileDateTimePicker
      label="For mobile"
      {...picker.props}
      value={value}
      onChange={handleChange}
      renderInput={(props: TextFieldProps) => <TextField {...props} />}
    />
  ),
  [DESKTOP_DATE_TIME_PICKER]: (
    { instance: picker, value, handleChange }: IMapProps
  ) => (
    <DesktopDateTimePicker
      label="For desktop"
      {...picker.props}
      value={value}
      onChange={handleChange}
      renderInput={(props: TextFieldProps) => <TextField {...props} />}
    />
  ),
}

export default function StateJsxPicker({ instance: picker }: IJsonPickerProps) {
  const { name, parent: { name: formName } } = picker
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  )
  const value = formsData.getValue(formName, name, null)
  const dispatch = useDispatch<AppDispatch>()

  /** Saves the date value to the store. */
  const handleChange = useCallback((date: unknown) => dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName,
      name,
      value: (date as Date).toLocaleString('en-US')
    }
  }), [dispatch, formName, name])

  try {
    const constant = picker.type.replace(/\s+/, '').toLowerCase()
    const Picker = pickerMap[constant]
    return picker.nameProvided
      ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Picker instance={picker} value={value} handleChange={handleChange} />
        </LocalizationProvider>
      )
      : <TextField value={`PICKER ${NAME_NOT_SET}`} disabled />
  } catch (e) {
    error_id(26).remember_exception(e) // error 26
    log((e as Error).message)
  }

  return (null)
}
