import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import { forwardRef, useState } from 'react'
// TODO install library if you want phone input component
// import { IMaskInput } from 'react-imask'
import type { THive } from '.'
import type StateFormItemInput from '../../../controllers/templates/StateFormItemInput'
import { IMaskInput } from '../../../components/IMaskInput'

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
  }
)

interface IDialogPhoneInput {
  instance: StateFormItemInput
  hive: THive
}

const DialogPhoneInput = (props: IDialogPhoneInput) => {
  const hive  = props.hive
  const input = props.instance
  input.configure('phone')

  const [value, setValue] = useState<string>(hive[input.name] as string)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    hive[input.name] = v
  }

  return (
    <FormControl {...input.formControlProps}>
      <InputLabel {...input.inputLabelProps}>{ input.label }</InputLabel>
      { /* @ts-expect-error Not my job to fix lib errors.  */ }
      <Input {...input.props} name={input.name} value={value} onChange={handleChange} inputComponent={TextMaskCustom} />
    </FormControl>
  )
}

export default DialogPhoneInput