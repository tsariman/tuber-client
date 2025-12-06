import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import { forwardRef, useCallback, type ElementType } from 'react'
import { IMaskInput } from '../../../components/IMaskInput'
import { useDispatch, useSelector } from 'react-redux'
import type StateFormItemInput from '../../../controllers/templates/StateFormItemInput'
import StateFormsData from '../../../controllers/StateFormsData'
import type { AppDispatch, RootState } from '../../../state'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask="+1 (#00) 000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    )
  },
)

interface IDialogPhoneInput { instance: StateFormItemInput }

export default function StateJsxPhoneInput({ instance: input }: IDialogPhoneInput) {
  const { name, parent: { name: formName} } = input
  input.configure('phone')
  const formsData = new StateFormsData(useSelector((state: RootState) => state.formsData))
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(
  {
    type: 'formsData/formsDataUpdate',
    payload: {
      formName,
      name,
      value: e.target.value
    }
  }), [dispatch, formName, name])

  const value = formsData.getValue(input.parent.name, input.name, '')

  return (
    <FormControl {...input.formControlProps}>
      <InputLabel {...input.inputLabelProps}>{ input.label }</InputLabel>
      <Input
        {...input.props}
        name={input.name}
        value={value}
        onChange={handleChange}
        inputComponent={TextMaskCustom as ElementType<unknown>}
      />
    </FormControl>
  )
}
