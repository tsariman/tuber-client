import { vi, beforeEach, afterEach, expect } from 'vitest';
import type { RootState } from '../../state';

/**
 * Mock IState factory for testing controllers
 */
export function createMockRootState(overrides: Partial<RootState> = {}): RootState {
  const defaultState: RootState = {
    app: {
      fetchingStateAllowed: true,
      inDebugMode: false,
      inDevelMode: false,
      origin: 'http://localhost:3000',
      route: '/home',
      showSpinner: false,
      spinnerDisabled: false,
      status: 'ready',
      title: 'Test App',
      logoUri: '/logo.png',
      logoTag: 'img',
      lastRoute: '/',
      homepage: '/home',
      isBootstrapped: true,
      fetchMessage: '',
      themeMode: 'light',
    },
    appbar: {},
    appbarQueries: {},
    background: {},
    typography: {},
    icons: {},
    data: {},
    dataPagesRange: {},
    dialog: {
      open: false,
      title: 'Test Dialog',
      content: 'Dialog content',
    },
    dialogs: {},
    dialogsLight: {},
    dialogsDark: {},
    drawer: {
      open: false,
      anchor: 'left',
      width: 240,
    },
    errors: [],
    forms: {},
    formsLight: {},
    formsDark: {},
    formsData: {},
    formsDataErrors: {},
    meta: {},
    pages: {},
    pagesLight: {},
    pagesDark: {},
    pagesData: {},
    chips: {},
    snackbar: {
      open: false,
      message: '',
      autoHideDuration: 6000,
    },
    tmp: {},
    topLevelLinks: {},
    theme: {},
    themeLight: {},
    themeDark: {},
    net: {},
    pathnames: {},
    staticRegistry: {},
    dynamicRegistry: {},
    ...overrides,
  };
  
  return defaultState as RootState;
}

/**
 * Mock console methods for testing logging
 */
export function createMockConsole() {
  return {
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  };
}

/**
 * Create mock Config for testing
 */
export function createMockConfig(debug = false) {
  return {
    DEBUG: debug,
    DEFAULT_THEME_MODE: 'light' as const,
  };
}

/**
 * Setup console mocks before tests
 */
export function setupConsoleMocks() {
  const originalConsole = { ...console };
  const mockConsole = createMockConsole();
  
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(console, mockConsole);
  });
  
  afterEach(() => {
    Object.assign(console, originalConsole);
  });
  
  return mockConsole;
}

/**
 * Mock state getter function
 */
export function createMockGetState(state?: RootState) {
  return vi.fn(() => state || createMockRootState());
}

/**
 * Mock business logic functions commonly used in controllers
 */
export function createMockBusinessLogic() {
  return {
    get_origin_ending_fixed: vi.fn((origin: string) => origin.endsWith('/') ? origin.slice(0, -1) : origin),
    ler: vi.fn(),
    error_id: vi.fn(() => ({ remember_exception: vi.fn() })),
  };
}

/**
 * Helper to create a controller test suite with common setup
 */
export function createControllerTestSuite<T>(
  name: string,
  ControllerClass: new (...args: unknown[]) => T,
  createDefaultArgs: () => unknown[]
) {
  return {
    name,
    ControllerClass,
    createDefaultArgs,
    createInstance: (...args: unknown[]) => new ControllerClass(...(args.length ? args : createDefaultArgs())),
  };
}

/**
 * Assert that a controller extends AbstractState properly
 */
export function assertImplementsAbstractState(instance: unknown) {
  expect(instance).toHaveProperty('state');
  expect(instance).toHaveProperty('parent');
  expect(instance).toHaveProperty('props');
  expect(instance).toHaveProperty('theme');
  expect(typeof (instance as Record<string, unknown>).state).not.toBe('undefined');
}