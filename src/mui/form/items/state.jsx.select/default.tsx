import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import type StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect'
import StateFormsData from '../../../../controllers/StateFormsData'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../../state'
import { NAME_NOT_SET } from '@tuber/shared'
import { useCallback } from 'react'

interface IFormSelectDefault { instance: StateFormItemSelect }

const StateJsxSelectDefault = ({ instance: select }: IFormSelectDefault) => {
  const { name, parent: { name: formName } } = select
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  )
  const dispatch = useDispatch<AppDispatch>()

  /** Saves the form field value to the store. */
  const handleChange = useCallback((e: SelectChangeEvent<string>) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName,
      name,
      value: e.target.value
    }
  }), [dispatch, formName, name])

  const getValue = () =>  formsData.getValue(formName, name, '')

  return name ? (
    <FormControl {...select.formControlProps}>
      <InputLabel {...select.inputLabelProps}>
        { select.text }
      </InputLabel>
      <Select
        {...select.props}
        value={getValue()}
        onChange={handleChange}
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
  )
}

export default StateJsxSelectDefault