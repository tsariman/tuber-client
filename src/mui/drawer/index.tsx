import { Fragment, useMemo, useCallback, type JSX } from 'react';
import Config from '../../config';
import { LAST_DRAWER_STATE } from '@tuber/shared';
import type { IStateDrawer } from '../../localized/interfaces';
import type StatePage from '../../controllers/StatePage';
import StateDrawerResponsive from '../../controllers/templates/StateDrawerResponsive';
import MiniDrawer from './mini-variant.drawer';
import PersistentDrawer from './persistent.drawer';
import ResponsiveDrawer from './responsive.drawer';
import TempDrawer from './temporary.drawer';

interface IJsonDrawerProps { def: StatePage; }

export default function StateJsxDrawer({ def: page }: IJsonDrawerProps) {
  // Memoize the last drawer state reading to avoid unnecessary Config.read calls
  const lastDrawerJson = useMemo(() => {
    return Config.read<IStateDrawer|undefined>(LAST_DRAWER_STATE);
  }, []);

  // Use useCallback to memoize the drawer state setting logic
  const setDrawerState = useCallback((drawerState: IStateDrawer) => {
    page.setDrawer(drawerState);
  }, [page]);

  // Memoize the drawer table to avoid recreating JSX elements on every render
  const drawerTable = useMemo(() => {
    const table: {[key: string]: JSX.Element} = {
      'mini': <MiniDrawer def={page.drawer} />,
      'persistent': <PersistentDrawer def={page.drawer} />,
      'responsive': <ResponsiveDrawer def={new StateDrawerResponsive(page.drawer.state, page)} />,
      'temporary': <TempDrawer def={page.drawer} />,
      'swipeable': <TempDrawer def={page.drawer} />,
      'none': <Fragment />
    };
    return table;
  }, [ page ]);

  if (page.hideDrawer) {
    return ( null );
  }

  // Apply last drawer state if it exists
  if (lastDrawerJson) {
    setDrawerState(lastDrawerJson);
  }

  if (page.hasDrawer) {
    Config.write(LAST_DRAWER_STATE, page.drawer.state);
    return drawerTable[page.drawer._type.toLowerCase()];
  }

  return ( null );
}
