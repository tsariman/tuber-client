import { memo, useCallback, useMemo } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import type StateFormItem from '../../../controllers/StateFormItem'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../state'
import StateFormsData from '../../../controllers/StateFormsData'

interface ISwitchProps {
  instance: StateFormItem
}

const StateJsxDialogSingleSwitch = memo(({ instance: $switch }: ISwitchProps) => {
  const { name, disabled, parent: { name: formName } } = $switch
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsData = useMemo(
    () => new StateFormsData(formsDataState),
    [formsDataState]
  )
  const value = useMemo(() => formsData.getValue<boolean>(
    formName,
    name,
    false
  ), [formName, name, formsData])

  const dispatch = useDispatch<AppDispatch>()

  /** Save switches value to the Redux store. */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName,
      name,
      value: e.target.checked
    }
  }), [dispatch, formName, name])

  return name ? (
    <FormControlLabel
      {...$switch.has.formControlLabelProps}
      control={
        <Switch
          checked={value}
          onChange={handleChange}
          disabled={disabled}
        />
      }
      label={$switch.label}
    />
  ) : null

})

StateJsxDialogSingleSwitch.displayName = 'StateJsxDialogSingleSwitch'

export default StateJsxDialogSingleSwitch