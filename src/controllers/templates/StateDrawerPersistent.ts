import { type DrawerProps } from '@mui/material';
import StatePageDrawer from './StatePageDrawer';
import type { TWithRequired } from '@tuber/shared';

export default class StateDrawerPersistent extends StatePageDrawer {
  
  get props(): TWithRequired<DrawerProps, 'anchor'> {
    return {
      sx: {
        width: this.drawerState.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: this.drawerState.width,
          boxSizing: 'border-box',
        },
      },
      variant: 'persistent',
      anchor: this.drawerState.anchor ?? 'left'
    };
  }

}
