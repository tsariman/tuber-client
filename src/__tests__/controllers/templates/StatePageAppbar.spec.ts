import { describe, it, expect, vi } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StatePageAppbar from '../../../controllers/templates/StatePageAppbar';
import type { IStateAppbar } from '../../../interfaces/localized';

// Mock dependencies
vi.mock('../../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    get props() { return {}; }
    get appbarStyle() { return 'basic'; }
    get menuId() { return 'menu'; }
    get mobileMenuId() { return 'mobile-menu'; }
    get mobileMenu2Id() { return 'mobile-menu2'; }
    get toolbarProps() { return {}; }
    get mobileMenuProps() { return {}; }
    get mobileMenu2Props() { return {}; }
    get menuIconProps() { return {}; }
    get menuItemsSx() { return {}; }
    get logoTag() { return 'div'; }
    get logoProps() { return {}; }
    get textLogoProps() { return {}; }
    get logoContainerProps() { return {}; }
    get searchContainerProps() { return {}; }
    get desktopMenuItemsProps() { return {}; }
    get desktopMenuItems2Props() { return {}; }
    get mobileMenuItemsProps() { return {}; }
    get mobileMenuItems2Props() { return {}; }
    get mobileMenuIconProps() { return {}; }
    get mobileMenuIcon2Props() { return {}; }
    get background() { return {}; }
    get state() { return { typography: {} }; }
  }
}));

vi.mock('../../../controllers/StateApp', () => ({
  default: class MockStateApp {
    get logoTag() { return 'img'; }
    get logoUri() { return 'logo.png'; }
    get state() { return { logoWidth: 100, logoHeight: 50 }; }
  }
}));

vi.mock('../../../controllers/StateAllPages', () => ({
  default: class MockStateAllPages {
    getPageState(route: string) {
      return route === 'inherited' ? { appbar: { background: { color: 'blue' } } } : null;
    }
  }
}));

vi.mock('../../../controllers/StatePage', () => ({
  default: class MockStatePage {}
}));

describe('StatePageAppbar', () => {
  const mockAppbarState: IStateAppbar = {
    props: { position: 'static' },
    appbarStyle: 'basic',
    menuId: 'test-menu',
    mobileMenuId: 'test-mobile-menu',
    mobileMenu2Id: 'test-mobile-menu2',
    toolbarProps: { variant: 'dense' },
    mobileMenuProps: { anchor: 'right' },
    mobileMenu2Props: { anchor: 'left' },
    menuIconProps: { color: 'primary' },
    menuItemsProps: { role: 'menu' },
    menuItemsSx: { padding: 1 },
    logoTag: 'img',
    logoProps: { alt: 'logo' },
    textLogoProps: { variant: 'h6' },
    logoContainerProps: { className: 'logo' },
    searchContainerProps: { className: 'search' },
    desktopMenuItemsProps: { direction: 'row' },
    desktopMenuItems2Props: { direction: 'row' },
    mobileMenuItemsProps: { direction: 'column' },
    mobileMenuItems2Props: { direction: 'column' },
    mobileMenuIconProps: { fontSize: 'large' },
    mobileMenuIcon2Props: { fontSize: 'large' },
    background: { color: 'red' },
    typography: { fontSize: 14 }
  };

  const mockParent = {} as StatePage;

  describe('constructor', () => {
    it('should create a StatePageAppbar instance', () => {
      const appbar = new StatePageAppbar(mockAppbarState, mockParent);
      expect(appbar).toBeInstanceOf(StatePageAppbar);
      expect(appbar.state).toEqual(mockAppbarState);
    });

    it('should initialize background and typography flags', () => {
      const appbarWithBg = new StatePageAppbar(mockAppbarState, mockParent);
      expect(appbarWithBg['noAppbarBackground']).toBe(false);
      expect(appbarWithBg['noAppbarTypography']).toBe(false);

      const appbarWithout = new StatePageAppbar({}, mockParent);
      expect(appbarWithout['noAppbarBackground']).toBe(true);
      expect(appbarWithout['noAppbarTypography']).toBe(true);
    });
  });

  describe('configure', () => {
    it('should configure the appbar with required dependencies', () => {
      const appbar = new StatePageAppbar(mockAppbarState, mockParent);
      const mockDefault = {} as any;
      const mockApp = {} as any;
      const mockAllPages = {} as any;

      appbar.configure({ $default: mockDefault, app: mockApp, allPages: mockAllPages });

      expect(appbar['_defaultDef']).toBe(mockDefault);
      expect(appbar['_appDef']).toBe(mockApp);
      expect(appbar['_allPagesDef']).toBe(mockAllPages);
    });
  });

  describe('getters', () => {
    let appbar: StatePageAppbar;
    let mockDefault: any;
    let mockApp: any;
    let mockAllPages: any;

    beforeEach(async () => {
      appbar = new StatePageAppbar(mockAppbarState, mockParent);
      const { default: MockDefault } = await import('../../../controllers/templates/StateAppbarDefault');
      const { default: MockApp } = await import('../../../controllers/StateApp');
      const { default: MockAllPages } = await import('../../../controllers/StateAllPages');
      mockDefault = new MockDefault();
      mockApp = new MockApp();
      mockAllPages = new MockAllPages();
      appbar.configure({ $default: mockDefault, app: mockApp, allPages: mockAllPages });
    });

    it('should return props from state or default', () => {
      expect(appbar.props).toEqual(mockAppbarState.props);
    });

    it('should return appbarStyle from state or default', () => {
      expect(appbar.appbarStyle).toBe(mockAppbarState.appbarStyle);
    });

    it('should return menuId from state or default', () => {
      expect(appbar.menuId).toBe(mockAppbarState.menuId);
    });

    it('should return logoProps correctly', () => {
      const logoProps = appbar.logoProps;
      expect(logoProps).toHaveProperty('src', 'logo.png');
      expect(logoProps).toHaveProperty('alt', 'logo');
    });

    it('should return hasLogo correctly', () => {
      expect(appbar.hasLogo).toBe(true);
    });
  });
});