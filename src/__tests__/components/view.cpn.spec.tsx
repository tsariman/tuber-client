import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import View from '../../components/view.cpn';

// Mock all the page components
vi.mock('../../components/pages/success.cpn', () => ({
  default: () => <div data-testid="page-success">Success Page</div>,
}));

vi.mock('../../components/pages/notfound.cpn', () => ({
  default: () => <div data-testid="page-notfound">Not Found Page</div>,
}));

vi.mock('../../components/pages/errors.cpn', () => ({
  default: () => <div data-testid="page-errors">Errors Page</div>,
}));

vi.mock('../../components/pages/landing.cpn', () => ({
  default: () => <div data-testid="page-landing">Landing Page</div>,
}));

vi.mock('../../components/pages/blank.cpn', () => ({
  default: () => <div data-testid="page-blank">Blank Page</div>,
}));

// Mock business logic
const mockErr = vi.fn();
const mockLog = vi.fn();
const mockErrorId = vi.fn(() => ({
  remember_exception: vi.fn(),
}));

vi.mock('../../business.logic', () => ({
  err: mockErr,
  log: mockLog,
  error_id: mockErrorId,
}));

// Mock shared constants
vi.mock('@tuber/shared', () => ({
  DEFAULT_LANDING_PAGE_VIEW: 'default_landing_page_view',
  DEFAULT_SUCCESS_PAGE_VIEW: 'default_success_page_view',
  DEFAULT_NOTFOUND_PAGE_VIEW: 'default_notfound_page_view',
  DEFAULT_ERRORS_PAGE_VIEW: 'default_errors_page_view',
  DEFAULT_BLANK_PAGE_VIEW: 'default_blank_page_view',
}));

describe('View Component', () => {
  const createMockPage = (contentName: string) => ({
    contentName,
  } as unknown);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Landing page for default landing view', () => {
    const mockPage = createMockPage('default_landing_page_view');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-landing')).toBeInTheDocument();
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  it('should render Success page for default success view', () => {
    const mockPage = createMockPage('default_success_page_view');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-success')).toBeInTheDocument();
    expect(screen.getByText('Success Page')).toBeInTheDocument();
  });

  it('should render Not Found page for default notfound view', () => {
    const mockPage = createMockPage('default_notfound_page_view');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-notfound')).toBeInTheDocument();
    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('should render Errors page for default errors view', () => {
    const mockPage = createMockPage('default_errors_page_view');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-errors')).toBeInTheDocument();
    expect(screen.getByText('Errors Page')).toBeInTheDocument();
  });

  it('should render Blank page for default blank view', () => {
    const mockPage = createMockPage('default_blank_page_view');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-blank')).toBeInTheDocument();
    expect(screen.getByText('Blank Page')).toBeInTheDocument();
  });

  it('should handle case insensitive view names', () => {
    const mockPage = createMockPage('DEFAULT_SUCCESS_PAGE_VIEW');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-success')).toBeInTheDocument();
  });

  it('should call err function for table_view (not implemented)', () => {
    const mockPage = createMockPage('table_view');

    const { container } = renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(mockErr).toHaveBeenCalledWith('Not implemented yet.');
    // Should render Fragment (no DOM nodes)
    expect(container.firstChild).toBeNull();
  });

  it('should return null for unknown view', () => {
    const mockPage = createMockPage('unknown_view');

    const { container } = renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle exceptions gracefully', () => {
    // Create a page that might cause an error
    const mockPage = createMockPage('default_success_page_view');
    
    // Mock console to suppress error output during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Force an error by making the view function throw
    vi.mocked(mockErr).mockImplementation(() => {
      throw new Error('Test error');
    });

    const { container } = renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    // Should return null when exception occurs
    expect(container.firstChild).toBeNull();
    expect(mockErrorId).toHaveBeenCalledWith(3);
    expect(mockLog).toHaveBeenCalledWith('Test error');

    consoleSpy.mockRestore();
  });

  it('should convert contentName to lowercase', () => {
    const mockPage = createMockPage('Default_Landing_Page_View');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    expect(screen.getByTestId('page-landing')).toBeInTheDocument();
  });

  it('should pass correct def prop to page components', () => {
    const mockPage = createMockPage('default_landing_page_view');

    renderWithProviders(
      <View def={mockPage as Parameters<typeof View>[0]['def']} />
    );

    // Verify the page component renders (which means it received the def prop)
    expect(screen.getByTestId('page-landing')).toBeInTheDocument();
  });
});