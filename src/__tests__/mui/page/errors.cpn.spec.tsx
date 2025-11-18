import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../../test-utils';
import PageErrors from '../../../mui/page/errors.cpn';

// Mock dependencies
const mockGetErrorsList = vi.fn();
const mockJsonapiError = vi.fn();
const mockColorJsonCode = vi.fn();
const mockFormatJsonCode = vi.fn();

vi.mock('../../../business.logic', () => ({
  JsonapiError: mockJsonapiError,
  color_json_code: mockColorJsonCode,
  format_json_code: mockFormatJsonCode,
  get_errors_list: mockGetErrorsList,
}));

vi.mock('../../../mui/icon', () => ({
  StateJsxIcon: ({ name }: { name: string }) => (
    <div data-testid={`icon-${name}`}>Icon: {name}</div>
  ),
}));

describe('PageErrors Component', () => {
  const mockPage = {} as unknown;
  const mockErrors = [
    {
      id: 'error-1',
      code: 'ERR_001',
      title: 'First Error',
      detail: 'First error details',
    },
    {
      id: 'error-2',
      code: 'ERR_002',
      title: 'Second Error',
      detail: 'Second error details',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGetErrorsList.mockReturnValue(mockErrors);
    
    mockJsonapiError.mockImplementation((errorData) => ({
      json: errorData,
      id: errorData.id,
      code: errorData.code,
      title: errorData.title,
      detail: errorData.detail,
    }));

    mockColorJsonCode.mockReturnValue('<span>colored json</span>');
    mockFormatJsonCode.mockReturnValue('formatted json');
  });

  it('should render search input', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(screen.getByPlaceholderText('Filter...')).toBeInTheDocument();
  });

  it('should render search icon', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(screen.getByTestId('icon-search')).toBeInTheDocument();
  });

  it('should render error list items', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(screen.getByText('error-1:ERR_001')).toBeInTheDocument();
    expect(screen.getByText('error-2:ERR_002')).toBeInTheDocument();
    expect(screen.getByText('First Error')).toBeInTheDocument();
    expect(screen.getByText('Second Error')).toBeInTheDocument();
  });

  it('should show clear button when filter has text', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    const searchInput = screen.getByPlaceholderText('Filter...');
    await user.type(searchInput, 'test');

    expect(screen.getByTestId('icon-close')).toBeInTheDocument();
  });

  it('should not show clear button when filter is empty', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(screen.queryByTestId('icon-close')).not.toBeInTheDocument();
  });

  it('should clear filter when clear button is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    const searchInput = screen.getByPlaceholderText('Filter...') as HTMLInputElement;
    
    // Type something to show clear button
    await user.type(searchInput, 'test');
    expect(searchInput.value).toBe('test');
    
    // Click clear button
    const clearButton = screen.getByTestId('icon-close').parentElement;
    if (clearButton) {
      await user.click(clearButton);
    }
    
    expect(searchInput.value).toBe('');
  });

  it('should update filter value when typing in search input', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    const searchInput = screen.getByPlaceholderText('Filter...') as HTMLInputElement;
    await user.type(searchInput, 'ERR_001');

    expect(searchInput.value).toBe('ERR_001');
  });

  it('should render errors in reverse order', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    const errorItems = screen.getAllByText(/error-\d:ERR_\d+/);
    expect(errorItems[0]).toHaveTextContent('error-2:ERR_002'); // Last error first
    expect(errorItems[1]).toHaveTextContent('error-1:ERR_001'); // First error last
  });

  it('should handle empty error list', () => {
    mockGetErrorsList.mockReturnValue([]);
    
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(screen.getByPlaceholderText('Filter...')).toBeInTheDocument();
    expect(screen.queryByText(/error-\d:ERR_\d+/)).not.toBeInTheDocument();
  });

  it('should have correct ARIA labels', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(screen.getByLabelText('filter')).toBeInTheDocument();
    
    // Type something to show clear button
    const searchInput = screen.getByPlaceholderText('Filter...');
    userEvent.type(searchInput, 'test');
    
    // The clear button should have aria-label
    expect(screen.getByLabelText('clear')).toBeInTheDocument();
  });

  it('should call get_errors_list on mount', () => {
    renderWithProviders(
      <PageErrors def={mockPage as Parameters<typeof PageErrors>[0]['def']} />
    );

    expect(mockGetErrorsList).toHaveBeenCalled();
  });
});