import { type DrawerProps } from '@mui/material';
import StatePageDrawer from './StatePageDrawer';
import type { TWithRequired } from '@tuber/shared';

export default class StateDrawerResponsive extends StatePageDrawer {
  private _container = window !== undefined
    ? () => window.document.body
    : undefined;
  
  /** `props` for temporary drawer. */
  get props(): TWithRequired<DrawerProps, 'anchor'> {
    return {
      container: this._container,
      variant: 'temporary',
      ModalProps: {
        keepMounted: true, // Better open performance on mobile.
      },
      sx: {
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: this.width
        },
      },
      ...this.drawerState.props,
      anchor: this.drawerState.anchor ?? 'left'
    };
  }

  /** `props` for permanent drawer. */
  get propsPermanent(): DrawerProps {
    return {
      variant: 'permanent',
      sx: {
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: this.width
        },
      },
      open: true
    };
  }
}
