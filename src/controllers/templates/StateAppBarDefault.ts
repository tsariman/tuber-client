import type {
  AppBarProps,
  IconButtonProps,
  MenuProps,
  SxProps,
  TypographyProps
} from '@mui/material'
import type { TObj } from '@tuber/shared'
import type { IStateAppbar } from '../../interfaces/localized'
import type State from '../State'
import StateAppbar from '../StateAppbar'
import StateAppbarBackground from './StateAppbarBackground'
import StateAppbarTypography from './StateAppbarTypography'
import { type HTMLAttributes } from 'react'

/** Wrapper class for `initialState.appbar` */
export default class StateAppbarDefault
  extends StateAppbar<State>
  implements IStateAppbar
{
  get props(): AppBarProps { return { ...this.appbarState.props } }
  get logoTag(): Required<IStateAppbar>['logoTag'] {
    return this.appbarState.logoTag || 'div'
  }
  get toolbarProps(): Required<IStateAppbar>['toolbarProps'] {
    return this.appbarState.toolbarProps || {}
  }
  get logoProps(): TObj { return this.appbarState.logoProps ?? {} }
  get menuIconProps(): IconButtonProps {
    return {
      size: 'large',
      edge: 'start',
      color: 'inherit',
      'aria-label': 'open drawer',
      sx: { mr: 2, color: this.typography.color },
      ...this.appbarState.menuIconProps
    }
  }
  get searchContainerProps(): HTMLAttributes<HTMLDivElement> & { sx?: SxProps } {
    return {
      ...this.appbarState.searchContainerProps
    }
  }
  get desktopMenuItemsProps(): Required<IStateAppbar>['desktopMenuItemsProps'] {
    return {
      sx : { display: { xs: 'none', md: 'flex' } },
      ...this.appbarState.desktopMenuItemsProps
    }
  }
  get desktopMenuItems2Props(): Required<IStateAppbar>['desktopMenuItems2Props'] {
    return {
      ...this.desktopMenuItemsProps,
      ...this.appbarState.desktopMenuItems2Props
    }
  }
  get mobileMenuItemsProps(): Required<IStateAppbar>['mobileMenuItemsProps'] {
    return {
      sx : { display: { xs: 'flex', md: 'none' } },
      ...this.appbarState.mobileMenuItemsProps
    }
  }
  get mobileMenuItems2Props(): Required<IStateAppbar>['mobileMenuItems2Props'] {
    return {
      ...this.mobileMenuItemsProps,
      ...this.appbarState.mobileMenuItems2Props
    }
  }
  get mobileMenuIconProps(): Required<IStateAppbar>['mobileMenuIconProps'] {
    return this.appbarState.mobileMenuIconProps || {}
  }
  get mobileMenuIcon2Props(): Required<IStateAppbar>['mobileMenuIcon2Props'] {
    return this.appbarState.mobileMenuIcon2Props || {}
  }
  get mobileMenuProps(): MenuProps {
    return {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      keepMounted: true,
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      open: false,
      ...this.appbarState.mobileMenuProps
    }
  }
  get mobileMenu2Props(): MenuProps {
    return {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      keepMounted: true,
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      open: false,
      ...this.appbarState.mobileMenu2Props
    }
  }
  get menuId(): string {
    return this.appbarState.menuId || 'primary-search-account-menu'
  }
  get mobileMenuId(): string {
    return this.appbarState.mobileMenuId || 'primary-menu-mobile'
  }
  get mobileMenu2Id(): string {
    return this.appbarState.mobileMenu2Id || 'primary-menu2-mobile'
  }
  get menuItemsSx(): SxProps { return this.appbarState.menuItemsSx ?? {} }
  get textLogoProps(): TypographyProps {
    return {
      variant: 'h6',
      noWrap: true,
      component: 'div',
      sx: {
        display: { xs: 'none', sm: 'block' },
        color: this.typography.color
      },
      ...this.appbarState.textLogoProps
    }
  }
  get logoContainerProps(): HTMLAttributes<HTMLDivElement> & { sx?: SxProps } {
    return {
      ...this.appbarState.logoContainerProps,
      sx: {
        flexGrow: 1,
        ...this.appbarState.logoContainerProps?.sx
      },
    }
  }

  /**
   * Chain-access to appbar background definition.
   */
  get background(): StateAppbarBackground<State> {
    return this.appbarBackground
      || (this.appbarBackground = new StateAppbarBackground<State>(
        this.appbarBackgroundState,
        this
      ))
  }

  /**
   * Chain-access to typography definition.
   */
  get typography(): StateAppbarTypography<State> {
    return this.appbarTypography
      || (this.appbarTypography = new StateAppbarTypography<State>(
        this.appbarTypographyState,
        this
      ))
  }

}
