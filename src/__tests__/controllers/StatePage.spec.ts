import { vi } from 'vitest';

// Mock problematic classes before importing anything
vi.mock('../../controllers/StateAppbar', () => ({
  default: class MockStateAppbar {
    constructor() {
      return {};
    }
  }
}));

vi.mock('../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    constructor() {
      return {};
    }
  }
}));

// Mock StatePageAppbar
vi.mock('../../controllers/templates/StatePageAppbar', () => ({
  default: class MockStatePageAppbar {
    parent: unknown;
    constructor(_appbar: unknown, parent: unknown) {
      this.parent = parent;
    }
  }
}));

// Mock State class
vi.mock('../../controllers/State', () => ({
  default: class MockState {
    _rootState: unknown;
    constructor(rootState: unknown) {
      this._rootState = rootState;
    }
    get app() {
      return {
        title: 'Test App',
        logoTag: 'div',
        logoUri: '',
        state: {
          logoWidth: 100,
          logoHeight: 50
        }
      };
    }
    get appbar() {
      return {
        state: {},
        props: {},
        appbarStyle: 'basic',
        menuId: 'menu-id',
        mobileMenuId: 'mobile-menu-id',
        mobileMenu2Id: 'mobile-menu2-id',
        toolbarProps: {},
        mobileMenuProps: {},
        mobileMenu2Props: {},
        menuIconProps: {},
        menuItemsSx: {},
        logoTag: 'div',
        logoProps: {},
        textLogoProps: {},
        logoContainerProps: {},
        searchContainerProps: {},
        desktopMenuItemsProps: {},
        desktopMenuItems2Props: {},
        mobileMenuItemsProps: {},
        mobileMenuItems2Props: {},
        mobileMenuIconProps: {},
        mobileMenuIcon2Props: {}
      };
    }
    get drawer() {
      return {
        state: {}
      };
    }
    get background() {
      return {
        state: {}
      };
    }
  }
}));

import { describe, it, expect, beforeEach } from 'vitest';
import StatePage from '../../controllers/StatePage';
import StateAllPages from '../../controllers/StateAllPages';
import State from '../../controllers/State';
import StatePageAppbar from '../../controllers/templates/StatePageAppbar';
import StatePageDrawer from '../../controllers/templates/StatePageDrawer';
import StatePageBackground from '../../controllers/templates/StatePageBackground';
import StatePageTypography from '../../controllers/templates/StatePageTypography';
import StateComponent from '../../controllers/StateComponent';
import type { IStatePage, IStateDrawer } from '../../localized/interfaces';
import * as parsing from '../../business.logic/parsing';
import initialState from '../../state/initial.state';

describe('StatePage', () => {
  let mockAllPages: StateAllPages;
  let mockState: State;
  let basicPageState: IStatePage;
  let page: StatePage;

  beforeEach(() => {
    // Mock State with minimal required properties
    mockState = new State(initialState);

    // Mock StateAllPages
    mockAllPages = {
      parent: mockState,
      getPageState: vi.fn((route: string) => {
        if (route === '/inherited-appbar') {
          return { appbar: { items: [{ type: 'button', label: 'Inherited' }] } };
        }
        if (route === '/inherited-drawer') {
          return { drawer: { items: [{ type: 'link', label: 'Inherited' }], open: true, width: 250 } };
        }
        if (route === '/inherited-background') {
          return { background: { color: '#ffffff' } };
        }
        if (route === '/inherited-custom-appbar') {
          return { appbarCustom: { type: 'div', content: 'Inherited Custom' } };
        }
        if (route === '/inherited-content') {
          return { content: 'inherited content data' };
        }
        if (route === '/inherited-content-inherited') {
          return { contentInherited: '/other-content' };
        }
        return null;
      })
    } as unknown as StateAllPages;

    // Basic page state
    basicPageState = {
      _id: 'test-page-id',
      _type: 'generic',
      _key: 'test-page',
      title: 'Test Page',
      forcedTitle: 'Forced Title',
      content: 'page content data',
      layout: 'layout_none',
      hideAppbar: false,
      hideDrawer: false,
      useDefaultAppbar: false,
      useDefaultDrawer: false,
      useDefaultBackground: true,
      useDefaultTypography: false,
      inherited: '/inherited-appbar',
      appbarInherited: '/inherited-appbar',
      drawerInherited: '/inherited-drawer',
      backgroundInherited: '/inherited-background',
      contentInherited: '/inherited-content',
      generateDefaultDrawer: false,
      data: { key: 'value' },
      meta: { description: 'Test page' },
      typography: { fontFamily: 'Arial' }
    };

    page = new StatePage(basicPageState, mockAllPages);
  });

  describe('Constructor and Basic Properties', () => {
    it('should create StatePage with provided state and parent', () => {
      expect(page).toBeInstanceOf(StatePage);
      expect(page.state).toBe(basicPageState);
      expect(page.parent).toBe(mockAllPages);
    });

    it('should initialize properties correctly', () => {
      expect(page._id).toBe('test-page-id');
      expect(page._type).toBe('generic');
      expect(page._key).toBe('test-page');
      expect(page.title).toBe('Test Page');
      expect(page.forcedTitle).toBe('Forced Title');
      expect(page.content).toBe('page content data');
      expect(page.layout).toBe('layout_none');
    });

    it('should handle missing properties gracefully', () => {
      const minimalState: IStatePage = {};
      const minimalPage = new StatePage(minimalState, mockAllPages);

      expect(minimalPage._id).toMatch(/^[a-f0-9]{24}$/); // MongoDB ObjectId format
      expect(minimalPage._type).toBe('generic');
      expect(minimalPage._key).toBe('');
      expect(minimalPage.title).toBe('');
      expect(minimalPage.forcedTitle).toBe('');
      expect(minimalPage.content).toBe('');
      expect(minimalPage.layout).toBe('layout_none');
    });
  });

  describe('Appbar Properties', () => {
    it('should return appbarJson from state', () => {
      const pageWithAppbar = new StatePage({
        ...basicPageState,
        appbar: { items: [{ type: 'link', href: '/test' }] }
      }, mockAllPages);

      expect(pageWithAppbar.appbarJson).toEqual({ items: [{ type: 'link', href: '/test' }] });
    });

    it('should return empty appbarJson when no appbar defined', () => {
      const pageWithoutAppbar = new StatePage({}, mockAllPages);
      expect(pageWithoutAppbar.appbarJson).toEqual({});
    });

    it('should create and cache StatePageAppbar instance', () => {
      const appbar = page.appbar;
      expect(appbar).toBeInstanceOf(StatePageAppbar);
      expect(appbar.parent).toBe(page);

      // Should return cached instance
      const appbar2 = page.appbar;
      expect(appbar2).toBe(appbar);
    });

    it('should create and cache StateComponent for appbarCustom', () => {
      const pageWithCustomAppbar = new StatePage({
        appbarCustom: {}
      }, mockAllPages);

      const appbarCustom = pageWithCustomAppbar.appbarCustom;
      expect(appbarCustom).toBeInstanceOf(StateComponent);
      expect(appbarCustom.parent).toBe(pageWithCustomAppbar);

      // Should return cached instance
      const appbarCustom2 = pageWithCustomAppbar.appbarCustom;
      expect(appbarCustom2).toBe(appbarCustom);
    });
  });

  describe('Drawer Properties', () => {
    it('should create and cache StatePageDrawer instance', () => {
      const drawer = page.drawer;
      expect(drawer).toBeInstanceOf(StatePageDrawer);
      expect(drawer.parent).toBe(page);

      // Should return cached instance
      const drawer2 = page.drawer;
      expect(drawer2).toBe(drawer);
    });

    it('should allow setting drawer via setDrawer method', () => {
      const newDrawer: IStateDrawer = {
        items: [{ type: 'link' }],
        open: true,
        width: 400
      };

      page.setDrawer(newDrawer);

      // Access drawer to trigger initialization
      const drawer = page.drawer;
      expect(drawer).toBeInstanceOf(StatePageDrawer);
    });
  });

  describe('Background Properties', () => {
    it('should create and cache StatePageBackground instance', () => {
      const background = page.background;
      expect(background).toBeInstanceOf(StatePageBackground);
      expect(background.parent).toBe(page);

      // Should return cached instance
      const background2 = page.background;
      expect(background2).toBe(background);
    });
  });

  describe('Typography Properties', () => {
    it('should create and cache StatePageTypography instance', () => {
      const typography = page.typography;
      expect(typography).toBeInstanceOf(StatePageTypography);
      expect(typography.parent).toBe(page);

      // Should return cached instance
      const typography2 = page.typography;
      expect(typography2).toBe(typography);
    });
  });

  describe('Content Properties', () => {
    it('should return correct content properties', () => {
      expect(page.content).toBe('page content data');
      expect(page.contentType).toBe('$view');
      expect(page.contentName).toBe('default_landing_page_view');
      expect(page.contentEndpoint).toBe('');
      expect(page.contentArgs).toBe('');
      expect(page.view).toBe('default_landing_page_viewView');
    });

    it('should parse content when accessed', () => {
      const parseSpy = vi.spyOn(parsing, 'get_parsed_content').mockReturnValue({
        type: 'parsed-type',
        name: 'parsed-name',
        endpoint: 'parsed-endpoint',
        args: 'parsed-args'
      });

      const pageWithContent = new StatePage({
        content: 'raw content'
      }, mockAllPages);

      expect(pageWithContent.contentType).toBe('parsed-type');
      expect(pageWithContent.contentName).toBe('parsed-name');
      expect(pageWithContent.contentEndpoint).toBe('parsed-endpoint');
      expect(pageWithContent.contentArgs).toBe('parsed-args');

      parseSpy.mockRestore();
    });

    it('should inherit content from another page', () => {
      const parseSpy = vi.spyOn(parsing, 'get_parsed_content').mockReturnValue({
        type: 'inherited-type',
        name: 'inherited-name'
      });

      const pageWithInheritance = new StatePage({
        inherited: '/inherited-content'
      }, mockAllPages);

      expect(pageWithInheritance.contentType).toBe('inherited-type');
      expect(pageWithInheritance.contentName).toBe('inherited-name');

      parseSpy.mockRestore();
    });

    it('should handle contentInherited property', () => {
      const parseSpy = vi.spyOn(parsing, 'get_parsed_content').mockReturnValue({
        type: 'content-inherited-type',
        name: 'content-inherited-name'
      });

      const pageWithContentInheritance = new StatePage({
        contentInherited: '/inherited-content'
      }, mockAllPages);

      expect(pageWithContentInheritance.contentType).toBe('content-inherited-type');

      parseSpy.mockRestore();
    });
  });

  describe('Boolean Flags', () => {
    it('should return correct hasAppbar flag', () => {
      // Has appbar defined
      expect(page.hasAppbar).toBe(true);

      // No appbar but has inherited
      const pageWithInherited = new StatePage({
        appbarInherited: '/inherited-appbar'
      }, mockAllPages);
      expect(pageWithInherited.hasAppbar).toBe(true);

      // No appbar but uses default
      const pageWithDefault = new StatePage({
        useDefaultAppbar: true
      }, mockAllPages);
      expect(pageWithDefault.hasAppbar).toBe(true);

      // No appbar at all
      const pageWithoutAppbar = new StatePage({}, mockAllPages);
      expect(pageWithoutAppbar.hasAppbar).toBe(false);
    });

    it('should return correct hasCustomAppbar flag', () => {
      // Has custom appbar defined
      const pageWithCustom = new StatePage({
        appbarCustom: {}
      }, mockAllPages);
      expect(pageWithCustom.hasCustomAppbar).toBe(true);

      // Has inherited custom appbar
      const pageWithInheritedCustom = new StatePage({
        appbarCustomInherited: '/inherited-custom-appbar'
      }, mockAllPages);
      expect(pageWithInheritedCustom.hasCustomAppbar).toBe(true);

      // No custom appbar
      expect(page.hasCustomAppbar).toBe(false);
    });

    it('should return correct hasDrawer flag', () => {
      // Has drawer defined
      const pageWithDrawer = new StatePage({
        drawer: { items: [], open: false, width: 300 }
      }, mockAllPages);
      expect(pageWithDrawer.hasDrawer).toBe(true);

      // No drawer but has inherited
      const pageWithInheritedDrawer = new StatePage({
        drawerInherited: '/inherited-drawer'
      }, mockAllPages);
      expect(pageWithInheritedDrawer.hasDrawer).toBe(true);

      // No drawer but uses default
      const pageWithDefaultDrawer = new StatePage({
        useDefaultDrawer: true
      }, mockAllPages);
      expect(pageWithDefaultDrawer.hasDrawer).toBe(true);

      // No drawer at all
      const pageWithoutDrawer = new StatePage({}, mockAllPages);
      expect(pageWithoutDrawer.hasDrawer).toBe(false);
    });

    it('should return correct hide flags', () => {
      expect(page.hideAppbar).toBe(false);
      expect(page.hideDrawer).toBe(false);

      const pageWithHides = new StatePage({
        hideAppbar: true,
        hideDrawer: true
      }, mockAllPages);

      expect(pageWithHides.hideAppbar).toBe(true);
      expect(pageWithHides.hideDrawer).toBe(true);
    });

    it('should return correct useDefault flags', () => {
      expect(page.useDefaultAppbar).toBe(false);
      expect(page.useDefaultDrawer).toBe(false);
      expect(page.useDefaultBackground).toBe(true);
      expect(page.useDefaultTypography).toBe(false);

      const pageWithDefaults = new StatePage({
        useDefaultAppbar: true,
        useDefaultDrawer: true,
        useDefaultBackground: false,
        useDefaultTypography: true
      }, mockAllPages);

      expect(pageWithDefaults.useDefaultAppbar).toBe(true);
      expect(pageWithDefaults.useDefaultDrawer).toBe(true);
      expect(pageWithDefaults.useDefaultBackground).toBe(false);
      expect(pageWithDefaults.useDefaultTypography).toBe(true);
    });

    it('should return correct inheritance flags', () => {
      expect(page.inherit).toBe('/inherited-appbar');
      expect(page.appbarInherited).toBe('/inherited-appbar');
      expect(page.drawerInherited).toBe('/inherited-drawer');
      expect(page.backgroundInherited).toBe('/inherited-background');
      expect(page.contentInherited).toBe('/inherited-content');
      expect(page.generateDefaultDrawer).toBe(false);
    });
  });

  describe('Data and Meta Properties', () => {
    it('should return correct data and meta', () => {
      expect(page.data).toEqual({ key: 'value' });
      expect(page.meta).toEqual({ description: 'Test page' });
    });

    it('should handle missing data and meta', () => {
      const pageWithoutData = new StatePage({}, mockAllPages);
      expect(pageWithoutData.data).toEqual({});
      expect(pageWithoutData.meta).toEqual({});
    });
  });

  describe('Private Initialization Methods', () => {
    // Note: Private methods are tested through their public interfaces
    it('should initialize appbar correctly when defined in state', () => {
      const pageWithAppbar = new StatePage({
        appbar: { items: [{ type: 'link' }] }
      }, mockAllPages);

      const appbar = pageWithAppbar.appbar;
      expect(appbar).toBeInstanceOf(StatePageAppbar);
    });

    it('should initialize drawer correctly when defined in state', () => {
      const pageWithDrawer = new StatePage({
        drawer: { items: [{ type: 'link' }], open: true, width: 250 }
      }, mockAllPages);

      const drawer = pageWithDrawer.drawer;
      expect(drawer).toBeInstanceOf(StatePageDrawer);
    });

    it('should initialize background correctly when defined in state', () => {
      const pageWithBackground = new StatePage({
        background: { color: '#ff0000' }
      }, mockAllPages);

      const background = pageWithBackground.background;
      expect(background).toBeInstanceOf(StatePageBackground);
    });
  });

  describe('Not Implemented Properties', () => {
    it('should return empty object for not implemented properties', () => {
      expect(page.props).toEqual({});
    });
  });

  describe('Error Handling', () => {
    it('should handle null/undefined state properties gracefully', () => {
      const stateWithNulls: IStatePage = {
        title: null as unknown as string,
        _key: null as unknown as string,
        content: null as unknown as string,
        data: null as unknown as Record<string, unknown>,
        meta: null as unknown as Record<string, unknown>
      };
      const page = new StatePage(stateWithNulls, mockAllPages);

      expect(page.title).toBe('');
      expect(page._key).toBe('');
      expect(page.content).toBe('');
      expect(page.data).toEqual({});
      expect(page.meta).toEqual({});
    });

    it('should handle missing parent gracefully', () => {
      const page = new StatePage(basicPageState, null as unknown as StateAllPages);
      expect(page.parent).toBeNull();
      expect(() => page.appbar).toThrow(); // Should fail when accessing parent-dependent properties
    });
  });
});