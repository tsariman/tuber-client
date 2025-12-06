import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import type { AppDispatch, RootState } from '../../../state'
import { get_statuses, update_checkboxes, type ICheckboxesData } from './_items.common.logic'
import { useDispatch, useSelector } from 'react-redux'
import type StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch'
import StateFormsData from '../../../controllers/StateFormsData'
import FormLabel from '@mui/material/FormLabel'
import { NAME_NOT_SET } from '@tuber/shared'
import { useCallback, useMemo } from 'react'

interface IJsonSwitchProps { instance: StateFormItemSwitch }

/**
 * Switch use example:
 * 
 * ```ts
 * const $witch = {
 *   'type': 'switch',
 *   'name': '', // [required] unique name
 *   'label': '', // [optional]
 *   'has': {
 *     'items': [
 *       {
 *         'name': 'switch1', // [required] unique name
 *         'label': 'Switch1', // [required] human readable name
 *       },
 *       // ... (more switch defintions)
 *     ],
 *     'helperText': '', // [optional]
 *     'onchangeHandle': '<functionIdentifier>'
 *   }
 * }
 * ```
 * @param props 
 * @returns 
 */
export default function StateJsxSwitch (props: IJsonSwitchProps) {
  const switchGroup = props.instance
  const { name, parent: { name: formName } } = switchGroup
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsData = useMemo(
    () => new StateFormsData(formsDataState),
    [formsDataState]
  )
  const dispatch = useDispatch<AppDispatch>()
  const checkedValues = formsData.getValue<string[]>(switchGroup.parent.name, name, [])
  const data: ICheckboxesData = useMemo(() => ({
    checkedValues,
    value: '',
    checked: false,
    statuses: get_statuses(checkedValues)
  }), [checkedValues])

  /** Saves switches values to the Redux store. */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const newCheckedValues = update_checkboxes(
      data.checkedValues,
      e.target.name,
      e.target.checked
    )
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName,
        name,
        value: newCheckedValues
      }
    })
  }, [data.checkedValues, dispatch, formName, name])

  return name ? (
    <FormControl {...switchGroup.formControlProps}>
      <FormLabel
        component="legend"
        {...switchGroup.formLabelProps}
      >
        { switchGroup.label }
      </FormLabel>
      <FormGroup {...switchGroup.formGroupProps}>
        {switchGroup.has.items.map(($witch, i) => (
          <FormControlLabel
            {...$witch.formControlLabelProps}
            key={`${name}-${i}`}
            control={
              <Switch
                {...$witch.props}
                checked={data.statuses[$witch.name] ?? false}
                name={$witch.name}
                onChange={handleChange}
              />
            }
            label={$witch.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  ) : (
    <TextField value={`SWITCH ${NAME_NOT_SET}`} disabled />
  )
}
