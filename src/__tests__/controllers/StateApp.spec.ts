import { describe, it, expect, vi, beforeEach } from 'vitest';
import StateApp from '../../controllers/StateApp';
import { createMockRootState } from './test-utils';
import type { IStateApp } from '@tuber/shared';

// Mock dependencies
vi.mock('../../business.logic/parsing', () => ({
  get_origin_ending_fixed: vi.fn((origin: string) => origin.endsWith('/') ? origin.slice(0, -1) : origin),
}));

vi.mock('../../config', () => ({
  default: {
    DEBUG: false,
    DEFAULT_THEME_MODE: 'light',
  },
}));

vi.mock('../../state', () => ({
  get_state: vi.fn(() => createMockRootState()),
}));

// Mock State class
const mockParentState = {
  // Mock basic State methods used by StateApp
  die: vi.fn((_msg: string, defaultVal: unknown) => defaultVal),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

vi.mock('../../controllers/State', () => ({
  default: {
    fromRootState: vi.fn(() => mockParentState),
  },
}));

describe('StateApp', () => {
  let mockAppState: IStateApp;
  let stateApp: StateApp;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppState = {
      fetchingStateAllowed: true,
      inDebugMode: false,
      inDevelMode: false,
      origin: 'http://localhost:3000/',
      route: '/dashboard',
      showSpinner: false,
      spinnerDisabled: false,
      status: 'ready',
      title: 'Test Application',
      logoUri: '/assets/logo.png',
      logoTag: 'img',
      lastRoute: '/home',
      homepage: '/home',
      isBootstrapped: true,
      fetchMessage: 'Loading...',
      themeMode: 'dark',
    };
    stateApp = new StateApp(mockAppState, mockParentState);
  });

  describe('constructor', () => {
    it('should create StateApp with app state and parent', () => {
      expect(stateApp).toBeInstanceOf(StateApp);
      expect(stateApp.state).toBe(mockAppState);
      expect(stateApp.parent).toBe(mockParentState);
    });

    it('should create StateApp with only app state', () => {
      const stateAppNoParent = new StateApp(mockAppState);
      expect(stateAppNoParent).toBeInstanceOf(StateApp);
      expect(stateAppNoParent.state).toBe(mockAppState);
    });
  });

  describe('AbstractState implementation', () => {
    it('should return app state from state getter', () => {
      expect(stateApp.state).toBe(mockAppState);
    });

    it('should return parent or create one from get_state', () => {
      const parent = stateApp.parent;
      expect(parent).toBeDefined();
    });

    it('should return error object for props getter', () => {
      const props = stateApp.props;
      expect(props).toEqual({});
    });

    it('should return error object for theme getter', () => {
      const theme = stateApp.theme;
      expect(theme).toEqual({});
    });
  });

  describe('property getters', () => {
    it('should return fetchingStateAllowed', () => {
      expect(stateApp.fetchingStateAllowed).toBe(true);
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.fetchingStateAllowed).toBe(false);
    });

    it('should return inDebugMode', () => {
      expect(stateApp.inDebugMode).toBe(false);
      
      // Test with true value
      const debugState = new StateApp({ ...mockAppState, inDebugMode: true });
      expect(debugState.inDebugMode).toBe(true);
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.inDebugMode).toBe(false);
    });

    it('should return inDevelMode', () => {
      expect(stateApp.inDevelMode).toBe(false);
      
      // Test with true value
      const develState = new StateApp({ ...mockAppState, inDevelMode: true });
      expect(develState.inDevelMode).toBe(true);
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.inDevelMode).toBe(false);
    });

    it('should return processed origin with trailing slash removed', () => {
      expect(stateApp.origin).toBe('http://localhost:3000');
      
      // Test origin without trailing slash
      const stateNoSlash = new StateApp({ ...mockAppState, origin: 'http://example.com' });
      expect(stateNoSlash.origin).toBe('http://example.com');
    });

    it('should cache processed origin', async () => {
      const origin1 = stateApp.origin;
      const origin2 = stateApp.origin;
      expect(origin1).toBe(origin2);
      
      // Verify the parsing function was called only once
      const parsingModule = await import('../../business.logic/parsing');
      expect(parsingModule.get_origin_ending_fixed).toHaveBeenCalledTimes(1);
    });

    it('should return route or homepage as fallback', () => {
      expect(stateApp.route).toBe('/dashboard');
      
      // Test without route but with homepage
      const stateNoRoute = new StateApp({ ...mockAppState, route: undefined });
      expect(stateNoRoute.route).toBe('/home');
      
      // Test without route or homepage
      const stateEmpty = new StateApp({} as IStateApp);
      expect(stateEmpty.route).toBe('');
    });

    it('should return showSpinner', () => {
      expect(stateApp.showSpinner).toBe(false);
      
      // Test with true value
      const spinnerState = new StateApp({ ...mockAppState, showSpinner: true });
      expect(spinnerState.showSpinner).toBe(true);
      
      // Test undefined
      const stateUndefined = new StateApp({ ...mockAppState, showSpinner: undefined });
      expect(stateUndefined.showSpinner).toBeUndefined();
    });

    it('should return spinnerDisabled', () => {
      expect(stateApp.spinnerDisabled).toBe(false);
      
      // Test with true value
      const disabledState = new StateApp({ ...mockAppState, spinnerDisabled: true });
      expect(disabledState.spinnerDisabled).toBe(true);
      
      // Test undefined
      const stateUndefined = new StateApp({ ...mockAppState, spinnerDisabled: undefined });
      expect(stateUndefined.spinnerDisabled).toBeUndefined();
    });

    it('should return status', () => {
      expect(stateApp.status).toBe('ready');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.status).toBe('');
    });

    it('should return title', () => {
      expect(stateApp.title).toBe('Test Application');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.title).toBe('');
    });

    it('should return logoUri', () => {
      expect(stateApp.logoUri).toBe('/assets/logo.png');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.logoUri).toBe('');
    });

    it('should return logoTag', () => {
      expect(stateApp.logoTag).toBe('img');
      
      // Test with div value
      const divState = new StateApp({ ...mockAppState, logoTag: 'div' });
      expect(divState.logoTag).toBe('div');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.logoTag).toBe('div');
    });

    it('should return lastRoute', () => {
      expect(stateApp.lastRoute).toBe('/home');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.lastRoute).toBe('');
    });

    it('should return homepage', () => {
      expect(stateApp.homepage).toBe('/home');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.homepage).toBe('');
    });

    it('should return isBootstrapped', () => {
      expect(stateApp.isBootstrapped).toBe(true);
      
      // Test false value
      const notBootstrappedState = new StateApp({ ...mockAppState, isBootstrapped: false });
      expect(notBootstrappedState.isBootstrapped).toBe(false);
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.isBootstrapped).toBe(false);
    });

    it('should return fetchMessage', () => {
      expect(stateApp.fetchMessage).toBe('Loading...');
      
      // Test default value
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.fetchMessage).toBe('');
    });

    it('should return themeMode or default from config', () => {
      expect(stateApp.themeMode).toBe('dark');
      
      // Test default value from config
      const stateWithoutProp = new StateApp({} as IStateApp);
      expect(stateWithoutProp.themeMode).toBe('light'); // from mocked config
    });
  });

  describe('edge cases', () => {
    it('should handle empty app state gracefully', () => {
      const emptyState = new StateApp({} as IStateApp);
      
      expect(emptyState.fetchingStateAllowed).toBe(false);
      expect(emptyState.inDebugMode).toBe(false);
      expect(emptyState.inDevelMode).toBe(false);
      expect(emptyState.route).toBe('');
      expect(emptyState.status).toBe('');
      expect(emptyState.title).toBe('');
      expect(emptyState.logoUri).toBe('');
      expect(emptyState.logoTag).toBe('div');
      expect(emptyState.lastRoute).toBe('');
      expect(emptyState.homepage).toBe('');
      expect(emptyState.isBootstrapped).toBe(false);
      expect(emptyState.fetchMessage).toBe('');
      expect(emptyState.themeMode).toBe('light');
    });

    it('should handle partial app state', () => {
      const partialState = new StateApp({
        title: 'Partial App',
        isBootstrapped: true,
      } as IStateApp);
      
      expect(partialState.title).toBe('Partial App');
      expect(partialState.isBootstrapped).toBe(true);
      expect(partialState.fetchingStateAllowed).toBe(false); // default
      expect(partialState.route).toBe(''); // default
    });

    it('should handle null/undefined values in state', () => {
      const nullState = new StateApp({
        title: undefined,
        status: null,
        route: undefined,
        homepage: undefined,
      } as unknown as IStateApp);
      
      expect(nullState.title).toBe('');
      expect(nullState.status).toBe('');
      expect(nullState.route).toBe('');
    });
  });

  describe('type safety', () => {
    it('should maintain correct types for all properties', () => {
      const fetchingAllowed: boolean = stateApp.fetchingStateAllowed;
      const debugMode: boolean = stateApp.inDebugMode;
      const develMode: boolean = stateApp.inDevelMode;
      const origin: string = stateApp.origin;
      const route: string = stateApp.route;
      const showSpinner: boolean | undefined = stateApp.showSpinner;
      const spinnerDisabled: boolean | undefined = stateApp.spinnerDisabled;
      const status: string = stateApp.status;
      const title: string = stateApp.title;
      const logoUri: string = stateApp.logoUri;
      const logoTag: 'img' | 'div' = stateApp.logoTag;
      const lastRoute: string = stateApp.lastRoute;
      const homepage: string = stateApp.homepage;
      const isBootstrapped: boolean = stateApp.isBootstrapped;
      const fetchMessage: string = stateApp.fetchMessage;
      const themeMode: 'light' | 'dark' = stateApp.themeMode;
      
      // These should not throw type errors
      expect(typeof fetchingAllowed).toBe('boolean');
      expect(typeof debugMode).toBe('boolean');
      expect(typeof develMode).toBe('boolean');
      expect(typeof origin).toBe('string');
      expect(typeof route).toBe('string');
      expect(typeof status).toBe('string');
      expect(typeof title).toBe('string');
      expect(typeof logoUri).toBe('string');
      expect(['img', 'div']).toContain(logoTag);
      expect(typeof lastRoute).toBe('string');
      expect(typeof homepage).toBe('string');
      expect(typeof isBootstrapped).toBe('boolean');
      expect(typeof fetchMessage).toBe('string');
      expect(['light', 'dark']).toContain(themeMode);
      
      // Check optional properties
      if (showSpinner !== undefined) expect(typeof showSpinner).toBe('boolean');
      if (spinnerDisabled !== undefined) expect(typeof spinnerDisabled).toBe('boolean');
    });
  });
});