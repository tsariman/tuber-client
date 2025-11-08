import { set_val } from '../../business.logic/parsing';
import type { IStatePage } from '@tuber/shared';
import StateTypography from '../StateTypography';
import type StateAppbar from '../StateAppbar';
import type StatePage from '../StatePage';

export default class StatePageAppbarTypography
  extends StateTypography<StateAppbar<StatePage>>
{
  patchStatePageAppbarTypography (page: IStatePage): void {
    const fontColor = page.appbar?.typography?.color;
    if (!fontColor) {
      set_val(page, 'appbar.typography.color', 'inherit');
    }
  } 
}
