import { InputAdornment, type InputAdornmentProps } from '@mui/material';
import { StateJsxUnifiedIconProvider } from '../../../mui/icon';
import StateFormItemCustom from '../../../controllers/StateFormItemCustom';
import type { IAdornment } from '@tuber/shared';

const StateJsxAdornmentIcon = ({ i }: { i?: string; fa?: string;}) => {
  const icon = new StateFormItemCustom({ icon: i }, {});
  return <StateJsxUnifiedIconProvider instance={icon} />;
}

/**
 * Converts the adornment's json definition to a component.
 * 
 * i.e.
 * ```ts
 * const adornment = {
 *   position: 'start' | 'end'
 *   icon?: string
 *   faIcon?: string
 *   text?: string
 *   // ...more props
 * }
 * ```
 * @param def 
 * @returns 
 */
export const StateJsxAdornment = (def ?:IAdornment) => {
  const { icon, faIcon, text, ...inputAdornmentProps } = def || {};
  return def ? (
    <InputAdornment {...(inputAdornmentProps as InputAdornmentProps)}>
      <StateJsxAdornmentIcon i={icon} fa={faIcon} />
      { text ? ' ' + text : '' }
    </InputAdornment>
  ) : undefined;
}
