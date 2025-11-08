import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { type StateFormItemRadio, StateFormsData } from '../../../controllers';
import { type RootState } from '../../../state';
import { useSelector } from 'react-redux';
import type { TFormItemDefaultEventHandler } from './_items.common.logic';

interface IDialogRadio { def: StateFormItemRadio; }

/**
 * Example JSON defintion:
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
 * };
 * ```
 */
export default function StateJsxRadio({ def: radioGroup }: IDialogRadio) {
  const { name, parent: { name: formName } } = radioGroup;
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const storeValue = formsData.getValue(
    formName,
    name,
    radioGroup.has.items[0].name
  );

  return (
    <FormControl {...radioGroup.formControlProps}>
      <FormLabel {...radioGroup.formLabelProps}>
        { radioGroup.text }&nbsp;
      </FormLabel>
      <RadioGroup
        {...radioGroup.props}
        name={name}
        onChange={(radioGroup.onChange as TFormItemDefaultEventHandler)(name)}
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
            checked={radio.name === storeValue}
            disabled={radio.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
