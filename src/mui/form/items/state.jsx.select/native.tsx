import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { NAME_NOT_SET } from '@tuber/shared'
import type StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect'
import StateFormsData from '../../../../controllers/StateFormsData'
import { type AppDispatch, type RootState } from '../../../../state'
import { useCallback, useMemo } from 'react'

interface IDialogSelectNative { instance: StateFormItemSelect }

const StateJsxSelectNative = ({ instance: select }: IDialogSelectNative) => {
  const { name, parent: { name: formName } } = select
  select.configure('native')
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsData = useMemo(
    () => new StateFormsData(formsDataState),
    [formsDataState]
  )
  const getValue = () => formsData.getValue(formName, name, '')
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName,
      name,
      value: e.target.value
    }
  }), [dispatch, formName, name])

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
        onChange={handleChange}
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
  )
}

export default StateJsxSelectNative