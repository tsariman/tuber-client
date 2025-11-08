import { describe, it, expect, vi, beforeEach } from 'vitest';
import './setup-mocks'; // Import centralized mocks
import StateAllPages from '../../controllers/StateAllPages';
import type { IStateAllPages, IStatePage } from '../../localized/interfaces';
import StateApp from '../../controllers/StateApp';
import { log } from '../../business.logic/logging';

// Mock StatePage class
vi.mock('../../controllers/StatePage', () => ({
  default: class MockStatePage {
    private _pageState: IStatePage;
    public parent: StateAllPages;
    
    constructor(pageState: IStatePage, parent: StateAllPages) {
        this._pageState = pageState;
        this.parent = parent;
    }
    
    get _key(): string { 
      return this._pageState._key ?? ''; 
    }
    
    get state(): IStatePage { 
      return this._pageState; 
    }
  }
}));

// Mock State class
const mockParentState = {
  die: vi.fn((_msg: string, defaultVal: unknown) => defaultVal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

vi.mock('../../controllers/State', () => ({
  default: {
    fromRootState: vi.fn(() => mockParentState),
  },
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/test-path',
  },
  writable: true,
});

describe('StateAllPages', () => {
  let mockAllPagesState: IStateAllPages;
  let stateAllPages: StateAllPages;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAllPagesState = {
      '/home': {
        _type: 'generic',
        route: '/home',
        title: 'Home Page',
      } as IStatePage,
      '/about': {
        _type: 'generic',
        route: '/about',
        title: 'About Page',
      } as IStatePage,
      '/users/:id': {
        _type: 'generic',
        route: '/users/:id',
        title: 'User Profile',
      } as IStatePage,
      '/posts/:id/comments/:commentId': {
        _type: 'complex',
        route: '/posts/:id/comments/:commentId',
        title: 'Comment Detail',
      } as IStatePage,
      '/blank': {
        _type: 'generic',
        route: '/blank',
        title: 'Blank Page',
      } as IStatePage,
      '/landing': {
        _type: 'generic',
        route: '/landing',
        title: 'Landing Page',
      } as IStatePage,
    };
    
    stateAllPages = new StateAllPages(mockAllPagesState, mockParentState);
  });

  describe('constructor', () => {
    it('should create StateAllPages with pages state and parent', () => {
      expect(stateAllPages).toBeInstanceOf(StateAllPages);
      expect(stateAllPages.state).toBe(mockAllPagesState);
      expect(stateAllPages.parent).toBe(mockParentState);
    });

    it('should create StateAllPages with only pages state', () => {
      const pagesNoParent = new StateAllPages(mockAllPagesState);
      expect(pagesNoParent).toBeInstanceOf(StateAllPages);
      expect(pagesNoParent.state).toBe(mockAllPagesState);
    });
  });

  describe('AbstractState implementation', () => {
    it('should return pages state from state getter', () => {
      expect(stateAllPages.state).toBe(mockAllPagesState);
    });

    it('should return parent or create one from get_state', () => {
      const parent = stateAllPages.parent;
      expect(parent).toBeDefined();
    });

    it('should return error object for props getter', () => {
      const props = stateAllPages.props;
      expect(props).toEqual({});
    });

    it('should return error object for theme getter', () => {
      const theme = stateAllPages.theme;
      expect(theme).toEqual({});
    });
  });

  describe('path variable detection', () => {
    it('should detect routes without path variables', () => {
      const hasPathVars = stateAllPages['_has_path_vars']('/home');
      expect(hasPathVars).toBe(false);
      
      const noPathVars = stateAllPages['_no_path_vars']('/home');
      expect(noPathVars).toBe(true);
    });

    it('should detect routes with path variables', () => {
      const hasPathVars = stateAllPages['_has_path_vars']('/users/123');
      expect(hasPathVars).toBe(true);
      
      const noPathVars = stateAllPages['_no_path_vars']('/users/123');
      expect(noPathVars).toBe(false);
    });

    it('should handle root route correctly', () => {
      const hasPathVars = stateAllPages['_has_path_vars']('/');
      expect(hasPathVars).toBe(false);
    });

    it('should handle trailing slashes', () => {
      const hasPathVars1 = stateAllPages['_has_path_vars']('/home/');
      const hasPathVars2 = stateAllPages['_has_path_vars']('/users/123/');
      
      expect(hasPathVars1).toBe(false);
      expect(hasPathVars2).toBe(true);
    });
  });

  describe('route template matching', () => {
    it('should match exact routes', () => {
      const match = stateAllPages['_route_match_template']('/home', '/home');
      expect(match).toBe(true);
    });

    it('should match root route exactly', () => {
      const match = stateAllPages['_route_match_template']('/', '/');
      expect(match).toBe(true);
      
      const noMatch = stateAllPages['_route_match_template']('/home', '/');
      expect(noMatch).toBe(false);
    });

    it('should match parameterized routes', () => {
      const match1 = stateAllPages['_route_match_template']('/users/:id', '/users/123');
      expect(match1).toBe(true);
      
      const match2 = stateAllPages['_route_match_template']('/posts/:id/comments/:commentId', '/posts/456/comments/789');
      expect(match2).toBe(true);
    });

    it('should not match routes with different base paths', () => {
      const match = stateAllPages['_route_match_template']('/users/:id', '/posts/123');
      expect(match).toBe(false);
    });

    it('should not match routes with different segment counts', () => {
      const match1 = stateAllPages['_route_match_template']('/users/:id', '/users/123/profile');
      expect(match1).toBe(false);
      
      const match2 = stateAllPages['_route_match_template']('/users/:id/profile', '/users/123');
      expect(match2).toBe(false);
    });
  });

  describe('getPageState method', () => {
    it('should return page state for exact route match', () => {
      const pageState = stateAllPages.getPageState('/home');
      expect(pageState).toBe(mockAllPagesState['/home']);
    });

    it('should return page state for route with leading slash added', () => {
      const pageState = stateAllPages.getPageState('home');
      expect(pageState).toBe(mockAllPagesState['/home']);
    });

    it('should return page state for route with leading slash removed', () => {
      mockAllPagesState['about'] = mockAllPagesState['/about'];
      const pageState = stateAllPages.getPageState('/about');
      expect(pageState).toBeDefined();
    });

    it('should return page state for parameterized routes', () => {
      const pageState = stateAllPages.getPageState('/users/123');
      expect(pageState).toBe(mockAllPagesState['/users/:id']);
    });

    it('should return page state for complex parameterized routes', () => {
      const pageState = stateAllPages.getPageState('/posts/456/comments/789');
      expect(pageState).toBe(mockAllPagesState['/posts/:id/comments/:commentId']);
    });

    it('should return null for non-existent routes', () => {
      const pageState = stateAllPages.getPageState('/non-existent');
      expect(pageState).toBeNull();
    });

    it('should return null for partial parameterized route matches', () => {
      const pageState = stateAllPages.getPageState('/users/123/extra');
      expect(pageState).toBeNull();
    });
  });

  describe('pageAt method', () => {
    it('should return StatePage instance for existing route', () => {
      const page = stateAllPages.pageAt('/home');
      expect(page).toBeDefined();
      expect(page?.state).toBe(mockAllPagesState['/home']);
      expect(page?.parent).toBe(stateAllPages);
    });

    it('should return StatePage instance for parameterized route', () => {
      const page = stateAllPages.pageAt('/users/123');
      expect(page).toBeDefined();
      expect(page?.state).toBe(mockAllPagesState['/users/:id']);
    });

    it('should return null for non-existent route', () => {
      const page = stateAllPages.pageAt('/non-existent');
      expect(page).toBeNull();
    });
  });

  describe('getPage method', () => {
    let mockStateApp: StateApp;

    beforeEach(() => {
      mockStateApp = new StateApp({
        route: '/home',
        homepage: '/home',
      });
    });

    it('should return page for app route', () => {
      const page = stateAllPages.getPage(mockStateApp);
      expect(page).toBeDefined();
      expect(page.state).toBe(mockAllPagesState['/home']);
    });

    it('should return homepage for root route', () => {
      const rootRouteApp = new StateApp({
        route: '/',
        homepage: '/home',
      });
      const page = stateAllPages.getPage(rootRouteApp);
      expect(page).toBeDefined();
      expect(page._key).toBe(mockAllPagesState['/home']._key || '');
    });

    it('should return page for parameterized route', () => {
      const paramRouteApp = new StateApp({
        route: '/users/123',
        homepage: '/home',
      });
      const page = stateAllPages.getPage(paramRouteApp);
      expect(page).toBeDefined();
      expect(page._key).toBe(mockAllPagesState['/users/:id']._key || '');
    });

    it('should fallback to window.location.pathname when route not found', () => {
      const nonExistentRouteApp = new StateApp({
        route: '/non-existent',
        homepage: '/home',
      });
      window.location.pathname = '/home';
      
      const page = stateAllPages.getPage(nonExistentRouteApp);
      expect(page).toBeDefined();
      expect(page.state).toBe(mockAllPagesState['/home']);
    });

    it('should return blank page and log message for bad route', () => {
      const badRouteApp = new StateApp({
        route: '/bad-route',
        homepage: '/home',
      });
      window.location.pathname = '/';
      
      const page = stateAllPages.getPage(badRouteApp);
      expect(page).toBeDefined();
      expect(page.state).toBe(mockAllPagesState['/blank']);
      expect(log).toHaveBeenCalledWith("'/bad-route' page not loaded. Fetching now..");
    });

    it('should fallback to homepage when homepage is empty string', () => {
      const emptyHomepageApp = new StateApp({
        route: '',
        homepage: '/home',
      });
      
      const page = stateAllPages.getPage(emptyHomepageApp);
      expect(page).toBeDefined();
      expect(page.state).toBe(mockAllPagesState['/home']);
    });

    it('should return landing page as final fallback', () => {
      const fallbackApp = new StateApp({
        route: '',
        homepage: '/non-existent',
      });
      
      const page = stateAllPages.getPage(fallbackApp);
      expect(page).toBeDefined();
      expect(page.state).toBe(mockAllPagesState['/landing']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty pages state', () => {
      const emptyPages = new StateAllPages({});
      const page = emptyPages.getPageState('/any-route');
      expect(page).toBeNull();
    });

    it('should handle undefined route gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = stateAllPages.getPageState(undefined as any);
      expect(page).toBeNull();
    });

    it('should handle null route gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = stateAllPages.getPageState(null as any);
      expect(page).toBeNull();
    });

    it('should handle routes with multiple slashes', () => {
      const page = stateAllPages.getPageState('//home//');
      expect(page).toBeDefined();
    });

    it('should handle routes with query parameters', () => {
      const page = stateAllPages.getPageState('/home?query=test');
      // This should not match since query params are included in the route
      expect(page).toBeNull();
    });
  });

  describe('performance considerations', () => {
    it('should efficiently handle large number of pages', () => {
      const largePageState: IStateAllPages = {};
      
      // Create 1000 pages
      for (let i = 0; i < 1000; i++) {
        largePageState[`/page-${i}`] = {
          _type: 'generic',
          route: `/page-${i}`,
          title: `Page ${i}`,
        } as IStatePage;
      }
      
      const largePagesController = new StateAllPages(largePageState);
      
      const startTime = performance.now();
      const page = largePagesController.getPageState('/page-500');
      const endTime = performance.now();
      
      expect(page).toBeDefined();
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
    });

    it('should efficiently handle parameterized route matching', () => {
      const startTime = performance.now();
      const page = stateAllPages.getPageState('/users/123');
      const endTime = performance.now();
      
      expect(page).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5); // Should be very fast
    });
  });
});