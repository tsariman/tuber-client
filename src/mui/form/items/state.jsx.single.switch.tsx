import { FormControl, FormHelperText } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import {
  BOOL_ONOFF,
  BOOL_TRUEFALSE,
  BOOL_YESNO,
  NAME_NOT_SET,
  type TBoolVal
} from '@tuber/shared'
import type StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch'
import StateFormsData from '../../../controllers/StateFormsData'
import { type AppDispatch, type RootState } from '../../../state'
import { get_bool_type, to_bool_val } from '../_form.common.logic'
import { useCallback, useMemo } from 'react'

interface IJsonSingleSwitch {
  instance: StateFormItemSwitch
}

/**
 * Example:
 * ```ts
 * const $witchJson = {
 *    type: 'single_switch',
 *    name: 'published',
 *    label: 'Published', // Human-readable text
 *    has: {
 *      defaultValue: 'on', // on/off, yes/no, true/false
 *      helpText: 'Whether the document is visible to the public or not.',
 *    }
 * },
 * ```
 */
export default function StateJsxSingleSwitch({ 
  instance: $witch
}: IJsonSingleSwitch) {
  const { name, disabled, parent: { name: formName } } = $witch
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsData = useMemo(
    () => new StateFormsData(formsDataState),
    [formsDataState]
  )
  const getValue = useCallback(() => formsData.getValue<TBoolVal>(
    $witch.parent.name,
    $witch.name,
    'false'
  ), [$witch.name, $witch.parent.name, formsData])

  const dispatch = useDispatch<AppDispatch>()

  /** Save switches value to the Redux store. */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const map: {[x: string]: () => void} = {
      [BOOL_TRUEFALSE]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName,
          name,
          value: e.target.checked ? 'true' : 'false'
        }
      }),
      [BOOL_ONOFF]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName,
          name,
          value: e.target.checked ? 'on' : 'off'
        }
      }),
      [BOOL_YESNO]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName,
          name,
          value: e.target.checked ? 'yes' : 'no'
        }
      }),
      'DEFAULT': () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName,
          name,
          value: e.target.checked ? 'true' : 'false'
        }
      })
    }
    map[get_bool_type(getValue())]()
  }, [dispatch, formName, getValue, name])

  return name ? (
    <FormControl
      component="fieldset"
      variant="standard"
      {...$witch.formControlProps}
    >
      <FormControlLabel
        {...$witch.formControlLabelProps}
        label={$witch.label}
        control={
          <Switch
            {...$witch.props}
            disabled={disabled === true}
            checked={to_bool_val(getValue())}
            onChange={handleChange}
            value={name}
            inputProps={{ 'aria-label': $witch.label }}
          />
        }
      />
      <FormHelperText {...$witch.formHelperTextProps}>
        { $witch.has.helperText }
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
