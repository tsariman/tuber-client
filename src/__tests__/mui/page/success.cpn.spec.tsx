import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../../test-utils';
import PageSuccess from '../../../mui/page/success.cpn';

// Mock the StateJsxIcon component
vi.mock('../../../mui/icon', () => ({
  StateJsxIcon: ({ name, config }: { name: string; config: unknown }) => (
    <div data-testid={`icon-${name}`} data-config={JSON.stringify(config)}>
      Icon: {name}
    </div>
  ),
}));

describe('PageSuccess Component', () => {
  const createMockPage = (message = 'Success!', color = '#000000') => ({
    parent: {
      parent: {
        tmp: {
          get: () => message,
        },
        app: {
          route: 'test-route',
        },
      },
    },
    data: {
      message: 'Page data message',
    },
    typography: {
      color,
    },
  } as unknown);

  it('should render success icon', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    expect(screen.getByTestId('icon-check_circle_outline')).toBeInTheDocument();
  });

  it('should render success message', () => {
    const testMessage = 'Operation completed successfully!';
    const mockPage = createMockPage(testMessage);

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(testMessage);
  });

  it('should apply typography color to message', () => {
    const testColor = '#ff0000';
    const mockPage = createMockPage('Success!', testColor);

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    const messageDiv = screen.getByText('Success!').parentElement;
    expect(messageDiv).toHaveStyle({ color: testColor });
  });

  it('should have correct styling for message container', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    const messageDiv = screen.getByText('Success!').parentElement;
    expect(messageDiv).toHaveStyle({
      width: '100%',
      textAlign: 'center',
    });
  });

  it('should render icon with correct configuration', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    const icon = screen.getByTestId('icon-check_circle_outline');
    const config = JSON.parse(icon.getAttribute('data-config') || '{}');
    expect(config).toEqual({
      sx: { fontSize: '29.5rem !important' },
    });
  });

  it('should render both icon and message', () => {
    const mockPage = createMockPage();

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    expect(screen.getByTestId('icon-check_circle_outline')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should handle empty message', () => {
    const mockPage = createMockPage('');

    renderWithProviders(
      <PageSuccess def={mockPage as Parameters<typeof PageSuccess>[0]['def']} />
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('');
  });
});