import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import type { THive } from '.';
import { type StateFormItemSwitch } from '../../../controllers';
import {
  type ICheckboxesData,
  update_checkboxes,
  update_switches_statuses
} from '../../form/items/_items.common.logic';

interface IDialogSwitch {
  def: StateFormItemSwitch;
  hive: THive;
}

export default function DialogSwitch (props: IDialogSwitch) {
  const switchGroup = props.def;
  const hive   = props.hive;

  const [value, setValue] = useState<string[]>(hive[switchGroup.name] as string[]);
  const data: ICheckboxesData = {
    checkedValues: value,
    value: '',
    checked: false,
    statuses: {}
  };
  update_switches_statuses(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data.value = e.target.name;
    data.checked = e.target.checked;
    update_checkboxes(data);
    setValue(data.checkedValues);
  }

  return (
    <FormControl {...switchGroup.formControlProps}>
      <FormGroup {...switchGroup.formGroupProps}>
        {switchGroup.has.items.map(($witch, i) => (
          <FormControlLabel
            {...$witch.formControlLabelProps}
            key={`switch-toggle${i}`}
            control={<Switch {...$witch.props} onChange={handleChange} />}
            label={$witch.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
