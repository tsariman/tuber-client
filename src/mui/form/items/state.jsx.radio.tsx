import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { type StateFormItemRadio, StateFormsData } from '../../../controllers'
import { type AppDispatch, type RootState } from '../../../state'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'

interface IFormRadio { instance: StateFormItemRadio }

/**
 * Example state:
 * ```ts
 * const jsonRadio = {
 *   'label': 'Choose your gender', // human-readable
 *   'name': 'gender',  // [required] field name
 *   'has': {
 *     'items': [
 *       {
 *         'name': 'male', // [required] radio name
 *         'label': 'Male', // human-readable
 *       },
 *       // ...(more radio buttons)
 *     ],
 *     'defaultValue': '' // [required] a radio selected by default
 *   }
 * }
 * ```
 */
export default function StateJsxRadio({ instance: radioGroup }: IFormRadio) {
  const { name, parent: { name: formName } } = radioGroup
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsData = useMemo(
    () => new StateFormsData(formsDataState),
    [formsDataState]
  )
  const dispatch = useDispatch<AppDispatch>()

  /** Saves the form field value to the store. */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
  {
    type: 'formsData/formsDataUpdate',
    payload: {
      formName,
      name,
      value: e.target.value
    }
  }), [dispatch, formName, name])

  const storeValue = formsData.getValue(
    formName,
    name,
    radioGroup.has.items[0].name
  )

  return (
    <FormControl {...radioGroup.formControlProps}>
      <FormLabel {...radioGroup.formLabelProps}>
        { radioGroup.text }&nbsp;
      </FormLabel>
      <RadioGroup
        {...radioGroup.props}
        name={name}
        value={storeValue}
        onChange={handleChange}
      >
        {radioGroup.has.items.map((radio, i) => (
          <FormControlLabel
            {...radio.formControlLabelProps}
            key={`radio-button${i}`}
            value={radio.name}
            control={
              <Radio
                {...radio.props}
                color={radio.state.color}
              />
            }
            label={radio.label}
            disabled={radio.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
