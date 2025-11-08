import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import PageBlank from '../../../components/pages/blank.cpn';

// Mock dependencies
const mockDispatch = vi.fn();
const mockPostReqState = vi.fn();
const mockConfigRead = vi.fn();
const mockConfigWrite = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('../../../state/net.actions', () => ({
  post_req_state: mockPostReqState,
}));

vi.mock('../../../config', () => ({
  default: {
    read: mockConfigRead,
    write: mockConfigWrite,
  },
}));

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
    mockConfigRead.mockReturnValue('light');
    mockConfigRead.mockImplementation((key, defaultValue) => {
      if (key.endsWith('_load_attempts')) return 0;
      return defaultValue;
    });
  });

  it('should render Fragment (empty component)', () => {
    const { container } = renderWithProviders(
      <PageBlank def={mockPage as Parameters<typeof PageBlank>[0]['def']} />
    );

    // Fragment renders no DOM nodes
    expect(container.firstChild).toBeNull();
  });

  it('should dispatch post_req_state when conditions are met', () => {
    renderWithProviders(
      <PageBlank def={mockPage as Parameters<typeof PageBlank>[0]['def']} />
    );

    expect(mockPostReqState).toHaveBeenCalledWith(
      '/pages',
      { key: 'test-route', mode: 'light' },
      { 'Content-Type': 'application/json' }
    );
  });

  it('should increment load attempts counter', () => {
    renderWithProviders(
      <PageBlank def={mockPage as Parameters<typeof PageBlank>[0]['def']} />
    );

    expect(mockConfigWrite).toHaveBeenCalledWith('test-route_load_attempts', 1);
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

    renderWithProviders(
      <PageBlank def={mockPageNoRoute as Parameters<typeof PageBlank>[0]['def']} />
    );

    expect(mockPostReqState).not.toHaveBeenCalled();
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

    renderWithProviders(
      <PageBlank def={mockPageNoFetching as Parameters<typeof PageBlank>[0]['def']} />
    );

    expect(mockPostReqState).not.toHaveBeenCalled();
  });

  it('should not dispatch when max attempts reached', () => {
    mockConfigRead.mockImplementation((key, defaultValue) => {
      if (key === 'test-route_load_attempts') return 3; // Max attempts is 3
      if (key.endsWith('_load_attempts')) return 3;
      return defaultValue;
    });

    renderWithProviders(
      <PageBlank def={mockPage as Parameters<typeof PageBlank>[0]['def']} />
    );

    expect(mockPostReqState).not.toHaveBeenCalled();
    expect(mockConfigWrite).not.toHaveBeenCalled();
  });

  it('should use correct theme mode from config', () => {
    mockConfigRead.mockImplementation((key, defaultValue) => {
      if (key === 'THEME_MODE') return 'dark';
      if (key.endsWith('_load_attempts')) return 0;
      return defaultValue;
    });

    renderWithProviders(
      <PageBlank def={mockPage as Parameters<typeof PageBlank>[0]['def']} />
    );

    expect(mockPostReqState).toHaveBeenCalledWith(
      '/pages',
      { key: 'test-route', mode: 'dark' },
      { 'Content-Type': 'application/json' }
    );
  });
});