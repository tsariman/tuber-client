import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { type RadioProps } from '@mui/material/Radio'
import { Fragment, useState } from 'react'
import type { THive } from '.'
import type {
  StateForm,
  StateFormItem,
  StateFormItemCheckboxBox
} from '../../../controllers'
import {
  type ICheckboxesData,
  update_checkboxes
} from '../../form/items/_items.common.logic'

interface IDialogCheckboxes {
  instance: StateFormItem<StateForm, StateFormItemCheckboxBox>
  hive: THive
}

const DialogCheckboxes = ({
  instance: checkboxes,
  hive
}: IDialogCheckboxes) => {
  const defaultCheckedValues = hive[checkboxes.name] as string[]
  const [
    checkedValues,
    setCheckedValues
  ] = useState<string[]>(defaultCheckedValues)
  const data: ICheckboxesData = {
    checkedValues,
    value: '',
    checked: false,
    statuses: {}
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data.value = e.target.value
    data.checked = e.target.checked
    const newCheckedValues = update_checkboxes(
      data.checkedValues,
      e.target.name,
      e.target.checked
    )
    setCheckedValues(newCheckedValues)
    hive[checkboxes.name] = newCheckedValues
  }

  return (
    <Fragment>
      {checkboxes.has.items.map((box, i) => (
        box.hasLabel
        ? (
          <FormControlLabel
            {...box.formControlLabelProps}
            key={`form-control-label${i}`}
            label={box.label}
            control={
              <Checkbox
                {...box.props}
                checked={data.statuses[box.name]}
                onChange={handleChange}
                value={box.name}
                color={
                  box.color || (checkboxes.has.color as RadioProps['color'])
                }
              />
            }
          />
        ) : (
          <Checkbox
            {...box.props}
            checked={data.statuses[box.name]}
            onChange={handleChange}
            color={
              box.color || (checkboxes.has.color as RadioProps['color'])
            }
            disabled={box.disabled}
          />
        )
      ))}
    </Fragment>
  )
}

export default DialogCheckboxes