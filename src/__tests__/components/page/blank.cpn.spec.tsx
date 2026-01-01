import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import PageBlank from '../../../components/page/blank.cpn';
import { post_req_state } from '../../../state/net.actions';
import Config from '../../../config';

// Mock dependencies
const mockDispatch = vi.fn();

// Shared mutable mock state used by useSelector
type MockState = {
  app: { route: string | null; fetchingStateAllowed: boolean };
  net: { headers: Record<string, string> };
  pathnames: { PAGES: string };
};

const mockState: MockState = {
  app: {
    route: 'test-route',
    fetchingStateAllowed: true,
  },
  net: {
    headers: { 'Content-Type': 'application/json' },
  },
  pathnames: {
    PAGES: '/pages',
  },
};

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (s: MockState) => unknown) => selector(mockState),
  };
});

vi.mock('../../../config', () => {
  const mockRead = vi.fn();
  const mockWrite = vi.fn();
  return {
    default: {
      read: mockRead,
      write: mockWrite,
    },
  };
});

// Mock action creator so we can assert calls
vi.mock('../../../state/net.actions', () => {
  return {
    post_req_state: vi.fn((path: string, payload: unknown, headers: unknown) => ({
      type: 'net/post_req_state',
      meta: { path },
      payload,
      headers,
    })),
  };
});

// Mock lightweight controller classes used by PageBlank
vi.mock('../../../controllers/StateApp', () => {
  return {
    default: class StateApp {
      route: string | null;
      fetchingStateAllowed: boolean;
      constructor(app: { route: string | null; fetchingStateAllowed: boolean }) {
        this.route = app.route ?? null;
        this.fetchingStateAllowed = Boolean(app.fetchingStateAllowed);
      }
    },
  };
});

vi.mock('../../../controllers/StateNet', () => {
  return {
    default: class StateNet {
      headers: Record<string, string>;
      constructor(net: { headers: Record<string, string> }) {
        this.headers = net.headers ?? {};
      }
    },
  };
});

vi.mock('../../../controllers/StatePathnames', () => {
  return {
    default: class StatePathnames {
      PAGES: string;
      constructor(pathnames: { PAGES: string }) {
        this.PAGES = pathnames.PAGES ?? '/pages';
      }
    },
  };
});

vi.mock('../../../controllers/StatePage', () => {
  return {
    default: class StatePage {},
  };
});

describe('PageBlank Component', () => {
  const mockPage = {
    parent: {
      parent: {
        app: {
          route: 'test-route',
          fetchingStateAllowed: true,
        },
        net: {
          headers: { 'Content-Type': 'application/json' },
        },
        pathnames: {
          PAGES: '/pages',
        },
      },
    },
  } as unknown;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mockState defaults
    mockState.app.route = 'test-route';
    mockState.app.fetchingStateAllowed = true;
    mockState.net.headers = { 'Content-Type': 'application/json' };
    mockState.pathnames.PAGES = '/pages';
    vi.mocked(Config.read).mockImplementation((key: string, defaultValue: unknown) => {
      if (key === 'theme_mode') return 'light';
      if (key.endsWith('_load_attempts')) return 0;
      return defaultValue;
    });
  });

  it('should render Fragment (empty component)', () => {
    const { container } = renderWithProviders(
      <PageBlank instance={mockPage as Parameters<typeof PageBlank>[0]['instance']} />
    );

    // Fragment renders no DOM nodes
    expect(container.firstChild).toBeNull();
  });

  it('should dispatch post_req_state when conditions are met', () => {
    renderWithProviders(
      <PageBlank instance={mockPage as Parameters<typeof PageBlank>[0]['instance']} />
    );

    expect(post_req_state).toHaveBeenCalledWith(
      '/pages',
      { key: 'test-route', mode: 'light' },
      { 'Content-Type': 'application/json' }
    );
  });

  it('should increment load attempts counter', () => {
    renderWithProviders(
      <PageBlank instance={mockPage as Parameters<typeof PageBlank>[0]['instance']} />
    );

    expect(vi.mocked(Config.write)).toHaveBeenCalledWith('test-route_load_attempts', 1);
  });

  it('should not dispatch when route is missing', () => {
    const mockPageNoRoute = {
      parent: {
        parent: {
          app: {
            route: null,
            fetchingStateAllowed: true,
          },
          net: { headers: {} },
          pathnames: { PAGES: '/pages' },
        },
      },
    } as unknown;
    mockState.app.route = null;
    renderWithProviders(
      <PageBlank instance={mockPageNoRoute as Parameters<typeof PageBlank>[0]['instance']} />
    );

    expect(post_req_state).not.toHaveBeenCalled();
  });

  it('should not dispatch when fetchingStateAllowed is false', () => {
    const mockPageNoFetching = {
      parent: {
        parent: {
          app: {
            route: 'test-route',
            fetchingStateAllowed: false,
          },
          net: { headers: {} },
          pathnames: { PAGES: '/pages' },
        },
      },
    } as unknown;
    mockState.app.route = 'test-route';
    mockState.app.fetchingStateAllowed = false;
    renderWithProviders(
      <PageBlank instance={mockPageNoFetching as Parameters<typeof PageBlank>[0]['instance']} />
    );

    expect(post_req_state).not.toHaveBeenCalled();
  });

  it('should not dispatch when max attempts reached', () => {
    vi.mocked(Config.read).mockImplementation((key: string, defaultValue: unknown) => {
      if (key === 'test-route_load_attempts') return 3; // Max attempts is 3
      if (key.endsWith('_load_attempts')) return 3;
      return defaultValue;
    });
    mockState.app.route = 'test-route';
    renderWithProviders(
      <PageBlank instance={mockPage as Parameters<typeof PageBlank>[0]['instance']} />
    );

    expect(post_req_state).not.toHaveBeenCalled();
    expect(vi.mocked(Config.write)).not.toHaveBeenCalled();
  });

  it('should use correct theme mode from config', () => {
    vi.mocked(Config.read).mockImplementation((key: string, defaultValue: unknown) => {
      if (key === 'theme_mode') return 'dark';
      if (key.endsWith('_load_attempts')) return 0;
      return defaultValue;
    });
    mockState.app.route = 'test-route';
    renderWithProviders(
      <PageBlank instance={mockPage as Parameters<typeof PageBlank>[0]['instance']} />
    );

    expect(post_req_state).toHaveBeenCalledWith(
      '/pages',
      { key: 'test-route', mode: 'dark' },
      { 'Content-Type': 'application/json' }
    );
  });
});