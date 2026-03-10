import { useState, memo, useMemo } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import { redux } from '../../../state'
import type StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch'
import FormHelperText from '@mui/material/FormHelperText'

interface ISwitchProps {
  instance: StateFormItemSwitch
}

/**
 * Dummy switch component for dialog actions.
 * It is rendered instead of the real switch component for users with 
 * insufficient permissions. It can run a handler that can help notify the user
 * about insufficient permissions or ask them to log in. The switch automatically
 * toggles back off after 500ms to provide visual feedback without persisting the change.
 */
const StateJsxSwitchDummy = memo(({ instance: $switch }: ISwitchProps) => {
  const { name, disabled, label } = $switch
  const [checked, setChecked] = useState(false)
  const onChange = useMemo(() => $switch.changeReduxHandler(redux), [$switch])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(prev => !prev)
    if (!checked) {
      onChange(e)
      // Automatically toggle off after 500ms
      setTimeout(() => setChecked(false), 500)
    }
  }

  return name ? (
    <FormControl
      component="fieldset"
      variant="standard"
      {...$switch.formControlProps}
    >
      <FormControlLabel
        {...$switch.formControlLabelProps}
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            value={name}
            slotProps={{ input: { 'aria-label': label } }}
          />
        }
        label={label}
      />
      <FormHelperText {...$switch.formHelperTextProps}>
        { $switch.has.helperText }
      </FormHelperText>
    </FormControl>
  ) : null
})

StateJsxSwitchDummy.displayName = 'StateJsxSwitchDummy'

export default StateJsxSwitchDummy
