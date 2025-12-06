import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import type { StateFormItemRadio } from '../../../controllers'
import type { THive } from '.'
import { useState } from 'react'

interface IDialogRadio {
  instance: StateFormItemRadio
  hive: THive
}

const DialogRadio = (props: IDialogRadio) => {
  const radio = props.instance
  const hive  = props.hive
  const [currentValue, setCurrentValue] = useState<string>(hive[radio.name] as string)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value
    setCurrentValue(value)
    hive[radio.name] = value
  }

  return (
    <FormControl {...radio.formControlProps}>
      <FormLabel {...radio.formLabelProps}>{ radio.text }&nbsp;</FormLabel>
      <RadioGroup {...radio.props} name={radio.name} onChange={handleChange}>
        {radio.has.items.map((radioButton, i) => (
          <FormControlLabel
            {...radioButton.formControlLabelProps}
            key={`radio-button${i}`}
            value={radioButton.name}
            control={
              <Radio
                {...radioButton.props}
                color={radioButton.state.color}
              />
            }
            label={radioButton.label}
            checked={radioButton.name === currentValue}
            disabled={radioButton.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default DialogRadio