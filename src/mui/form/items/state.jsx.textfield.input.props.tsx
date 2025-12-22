import type { InputProps } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import type { IStateFormItemAdornment } from '../../../interfaces/localized';
import StateLink from '../../../controllers/StateLink';
import type StateFormItemInputProps from '../../../controllers/StateFormItemInputProps';
import StateJsxLink from '../../link';

/**
 * Get adornment for textfield. Adornment is an icon or text that appears at
 * the start or end of the textfield. Example:  
 * ```json
 * {
 *   "start": {
 *     "icon": {}, // StateLink icon definition
 *     "text": "", // Text to display if you don't want to use an icon
 *     "textProps": {} // Props for text
 *   },
 *   "end": {
 *     "icon": {},
 *     "text": "",
 *     "textProps": {}
 *   }
 * }
 * ```
 */
export default function StateJsxTextfieldInputProps({
  start,
  end,
  props
}: StateFormItemInputProps) {
  const AdornmentSymbol = ({ state }: { state: IStateFormItemAdornment }) => {
    if (!state) return null;
    const { icon, text, textProps } = state;
    if (icon) {
      return <StateJsxLink instance={new StateLink(icon)} />;
    } else if (text) {
      return <span {...textProps}>{ text }</span>;
    }
    return ( null );
  }
  const getAdornment = (
    position: 'start' | 'end',
    state: IStateFormItemAdornment
  ) => {
    return (
      <InputAdornment position={position}>
        <AdornmentSymbol state={state} />
      </InputAdornment>
    );
  }
  const adornment: InputProps = props;
  if (start) {
    adornment.startAdornment = getAdornment('start', start);
  }
  if (end) {
    adornment.endAdornment = getAdornment('end', end);
  }
  
  return adornment;
}
