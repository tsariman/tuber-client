import { FormControl, FormHelperText } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { NAME_NOT_SET } from '@tuber/shared'
import type StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch'
import StateFormsData from '../../../controllers/StateFormsData'
import { type AppDispatch, type RootState } from '../../../state'
import { useCallback, useMemo } from 'react'

interface IJsonSingleSwitch {
  instance: StateFormItemSwitch
}

/**
 * Example:
 * ```ts
 * const $witchJson = {
 *    type: 'switch_single',
 *    name: 'is_published',
 *    label: 'Published', // Human-readable text
 *    has: {
 *      defaultValue: 'on', // on/off, yes/no, true/false
 *      helpText: 'Whether the document is visible to the public or not.',
 *    }
 * },
 * ```
 */
export default function StateJsxSingleSwitch({ 
  instance: $switch
}: IJsonSingleSwitch) {
  const { label, name, disabled, parent: { name: formName } } = $switch
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
    <FormControl
      component="fieldset"
      variant="standard"
      {...$switch.formControlProps}
    >
      <FormControlLabel
        {...$switch.formControlLabelProps}
        label={label}
        control={
          <Switch
            {...$switch.props}
            disabled={disabled === true}
            checked={value}
            onChange={handleChange}
            value={name}
            slotProps={{ input: { 'aria-label': label }}}
          />
        }
      />
      <FormHelperText {...$switch.formHelperTextProps}>
        { $switch.has.helperText }
      </FormHelperText>
    </FormControl>
  ) : (
    <TextField
      variant='standard'
      value={`SWITCH ${NAME_NOT_SET}`}
      disabled
    />
  )
}
