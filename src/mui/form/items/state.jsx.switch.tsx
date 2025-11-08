import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { type RootState } from '../../../state';
import type { ICheckboxesData, TSwitchEventHandlerFactory } from './_items.common.logic';
import { useSelector } from 'react-redux';
import { type StateFormItemSwitch, StateFormsData } from '../../../controllers';
import FormLabel from '@mui/material/FormLabel';
import { NAME_NOT_SET } from '@tuber/shared';

interface IJsonSwitchProps { def: StateFormItemSwitch; }

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
 * };
 * ```
 * @param props 
 * @returns 
 */
export default function StateJsxSwitch (props: IJsonSwitchProps) {
  const switchGroup = props.def;
  const { name } = switchGroup;
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const values = formsData.getValue<string[]>(switchGroup.parent.name, name, []);
  const data: ICheckboxesData = {
    checkedValues: values,
    value: '',
    checked: false,
    statuses: {}
  };

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
            key={`${name}${i}`}
            control={
              <Switch
                {...$witch.props}
                name={$witch.name}
                onChange={(switchGroup.onChange as TSwitchEventHandlerFactory)(name, data)}
              />
            }
            label={$witch.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  ) : (
    <TextField value={`SWITCH ${NAME_NOT_SET}`} disabled />
  );
}
