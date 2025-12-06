import { FormControl } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import { useDispatch, useSelector } from 'react-redux'
import { StateFormsData, type StateFormItemCheckbox } from '../../../controllers'
import { type AppDispatch, type RootState } from '../../../state'
import {
  get_statuses,
  update_checkboxes,
  type ICheckboxesData,
} from './_items.common.logic'
import { useCallback, useMemo } from 'react'

interface IJsonCheckboxes { def: StateFormItemCheckbox }

export default function StateJsxCheckboxes ({ def: checkboxes }: IJsonCheckboxes) {
  const { name, parent: { name: formName }} = checkboxes
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsData = useMemo(
    () => new StateFormsData(formsDataState),
    [formsDataState]
  )
  const dispatch = useDispatch<AppDispatch>()
  const checkedValues = formsData.getValue<string[]>(formName, name, [])
  const data: ICheckboxesData = useMemo(() => ({
    checkedValues,
    value: '',
    checked: false,
    statuses: get_statuses(checkedValues)
  }), [checkedValues])

  /** Saves checkboxes values to the Redux store. */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const newCheckedValues = update_checkboxes(
      data.checkedValues,
      e.target.name,
      e.target.checked
    );
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName,
        name,
        value: newCheckedValues
      }
    })
  }, [data.checkedValues, dispatch, formName, name])


  return (
    <FormControl
      component='fieldset'
      variant='standard'
      {...checkboxes.has.formControlProps}
    >
      <FormLabel component="legend" {...checkboxes.has.formLabelProps}>
        { checkboxes.text }
      </FormLabel>
      <FormGroup {...checkboxes.has.formGroupProps}>
        {checkboxes.has.items.map((box, i) => (
          <FormControlLabel
            {...box.formControlLabelProps}
            key={`form-control-label${i}`}
            label={box.label}
            control={
              <Checkbox
                {...box.props}
                checked={data.statuses[box.name] ?? false}
                onChange={handleChange}
                name={box.name}
                color={box.has.state.color || checkboxes.has.state.color}
              />
            }
          />
        ))}
      </FormGroup>
      <FormHelperText {...checkboxes.has.formHelperTextProps}>
        { checkboxes.has.helperText }
      </FormHelperText>
    </FormControl>
  )
}
