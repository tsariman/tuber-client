import type {
  TAppbarStyle,
  IStateBackground,
  IStateTypography
} from '@tuber/shared';
import type { IStateAppbar } from '../../localized/interfaces';
import StateAppbar from '../StateAppbar';
import type StateAppbarDefault from './StateAppbarDefault';
import type StatePage from '../StatePage';
import StatePageAppbarBackground from './StatePageAppbarBackground';
import StatePageAppbarTypography from './StatePageAppbarTypography';
import { error_id } from '../../business.logic/errors';
import type { CSSProperties, HTMLAttributes } from 'react';
import type { AppBarProps, SxProps } from '@mui/material';

export default class StatePageAppbar 
  extends StateAppbar<StatePage>
  implements IStateAppbar
{
  protected noAppbarBackground: boolean;
  protected noAppbarTypography: boolean;
  protected pageAppbarBackgroundDef?: StatePageAppbarBackground;
  declare protected appbarTypography?: StatePageAppbarTypography;
  private _default: StateAppbarDefault;
  private _appbarLogoProps?: IStateAppbar['logoProps'];

  constructor(appbar: IStateAppbar, parent: StatePage) {
    super(appbar, parent);
    this._default = this.parent.parent.parent.appbar;
    this.noAppbarBackground = !this.appbarState.background;
    this.appbarBackgroundState = this.appbarState.background || this._initBackground();
    this.noAppbarTypography = !this.appbarState.typography;
  }

  get theme(): CSSProperties { return this.appbarState.theme || this._default.theme; }
  get props(): AppBarProps { return this.appbarState.props || this._default.props; }
  get _type(): TAppbarStyle {
    return this.appbarState._type || this._default.appbarStyle;
  }
  get appbarStyle(): TAppbarStyle {
    return this.appbarState.appbarStyle || this._default.appbarStyle;
  }

  get background(): StatePageAppbarBackground {
    return this.pageAppbarBackgroundDef
      || (this.pageAppbarBackgroundDef = new StatePageAppbarBackground(
        this.appbarBackgroundState,
        this
      ));
  }

  /**
   * Chain-access to typography definition.
   */
  get typography(): StatePageAppbarTypography {
    this.appbarTypographyState = this.appbarState.typography || this._initTypography();
    return this.appbarTypography
      || (this.appbarTypography = new StatePageAppbarTypography(
        this.appbarTypographyState,
        this
      ));
  }

  get menuId(): string {
    return this.appbarState.menuId
      || this._default.menuId;
  }

  get mobileMenuId(): string {
    return this.appbarState.mobileMenuId 
      || this._default.mobileMenuId;
  }

  get mobileMenu2Id(): string {
    return this.appbarState.mobileMenu2Id
      || this._default.mobileMenu2Id;
  }

  get toolbarProps(): Required<IStateAppbar>['toolbarProps'] {
    return {
      ...this._default.toolbarProps,
      ...this.appbarState.toolbarProps
    };
  }

  get mobileMenuProps(): Required<IStateAppbar>['mobileMenuProps'] {
    return {
      ...this._default.mobileMenuProps,
      ...this.appbarState.mobileMenuProps
    };
  }

  get mobileMenu2Props(): Required<IStateAppbar>['mobileMenuProps'] {
    return {
      ...this._default.mobileMenu2Props,
      ...this.appbarState.mobileMenu2Props
    };
  }

  get menuIconProps(): Required<IStateAppbar>['menuIconProps'] {
    return {
      ...this._default.menuIconProps,
      ...this.appbarState.menuIconProps
    };
  }

  get menuItemsProps(): HTMLAttributes<HTMLLIElement> & { sx?: SxProps } {
    return this.appbarState.menuItemsProps ?? {};
  }

  get menuItemsSx(): SxProps {
    return this.appbarState.menuItemsSx ?? this._default.menuItemsSx;
  }

  get logoTag(): Required<IStateAppbar>['logoTag'] {
    return this.parent.parent.parent.app.logoTag
      || this.appbarState.logoTag
      || this._default.logoTag;
  }

  get logoProps(): IStateAppbar['logoProps'] {
    if (this._appbarLogoProps) {
      return this._appbarLogoProps;
    }
    const logoUri = this.parent.parent.parent.app.logoUri;
    if (logoUri) {
      if (this.logoTag.toLowerCase() === 'div') {
        return this._appbarLogoProps = {
          ...this._default.logoProps,
          sx: {
            backgroundSize: 'contain',
            backgroundImage: `url("${logoUri}")`,
            width: this.parent.parent.parent.app.state.logoWidth,
            height: this.parent.parent.parent.app.state.logoHeight
          }
        };
      }
      if (this.logoTag.toLowerCase() === 'img') {
        return this._appbarLogoProps = {
          ...this._default.logoProps,
          src: logoUri,
          ...this.appbarState.logoProps
        };
      }
    }
    return this._appbarLogoProps = {
      ...this._default.logoProps,
      ...this.appbarState.logoProps
    };
  }

  get hasLogo(): boolean {
    return !!this.parent.parent.parent.app.logoUri
      || Object.keys(this.logoProps as object).length > 0;
  }

  get textLogoProps() {
    return {
      ...this._default.textLogoProps,
      ...this.appbarState.textLogoProps
    };
  }

  get logoContainerProps(): (HTMLAttributes<HTMLDivElement> & { sx?: SxProps; }) {
    return {
      ...this._default.logoContainerProps,
      ...this.appbarState.logoContainerProps
    };
  }

  get searchContainerProps(): (HTMLAttributes<HTMLDivElement> & { sx?: SxProps; }) {
    return {
      ...this._default.searchContainerProps,
      ...this.appbarState.searchContainerProps
    };
  }

  get desktopMenuItemsProps(): Required<IStateAppbar>['desktopMenuItemsProps'] {
    return {
      ...this._default.desktopMenuItemsProps,
      ...this.appbarState.desktopMenuItemsProps
    };
  }

  get desktopMenuItems2Props(): Required<IStateAppbar>['desktopMenuItems2Props'] {
    return {
      ...this._default.desktopMenuItems2Props,
      ...this.appbarState.desktopMenuItems2Props
    };
  }

  get mobileMenuItemsProps(): Required<IStateAppbar>['mobileMenuItemsProps'] {
    return {
      ...this._default.mobileMenuItemsProps,
      ...this.appbarState.mobileMenuItemsProps
    };
  }

  get mobileMenuItems2Props(): Required<IStateAppbar>['mobileMenuItems2Props'] {
    return {
      ...this._default.mobileMenuItems2Props,
      ...this.appbarState.mobileMenuItems2Props
    };
  }

  get mobileMenuIconProps(): Required<IStateAppbar>['mobileMenuIconProps'] {
    return {
      ...this._default.mobileMenuIconProps,
      ...this.appbarState.mobileMenuIconProps
    };
  }

  get mobileMenuIcon2Props(): Required<IStateAppbar>['mobileMenuIcon2Props'] {
    return {
      ...this._default.mobileMenuIcon2Props,
      ...this.appbarState.mobileMenuIcon2Props
    };
  }

  /** For use with app bar with search fields. */
  protected handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  private _initBackground = (): IStateBackground => {
    if (this.noAppbarBackground) {
      if (this.appbarState.useDefaultBackground) {
        return this.parent.parent.parent.appbar.background;
      }
      if (this.appbarState.backgroundInherited) {
        const inheritedRoute = this.appbarState.backgroundInherited;
        const backgroundInheritedState = this.parent.parent
          .getPageState(inheritedRoute)
          ?.appbar
          ?.background;
        if (backgroundInheritedState) { return backgroundInheritedState; }
      }
    }
    return {};
  }

  private _initTypography = (): IStateTypography => {
    if (this.noAppbarTypography) {
      const defaultTypography = this.parent.parent.parent.appbar.state.typography;
      if (this.appbarState.useDefaultTypography && defaultTypography) {
        return defaultTypography;
      }
      try {
        const route = this.appbarState.typographyInherited;
        if (route) {
          const inheritedTypography = this.parent.parent.state[route].typography;
          if (inheritedTypography) {
            return inheritedTypography;
          }
        }
      } catch (e) { error_id(16).remember_exception(e); /* error 16 */ }
    }
    return {};
  }

}
