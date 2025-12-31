import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import AppPage from '../../components/app.cpn';

// Mock the child components
vi.mock('../../components/complex.app.cpn', () => ({
  default: () => <div data-testid="complex-app">Complex App Component</div>,
}));

vi.mock('../../components/generic.app.cpn', () => ({
  default: () => <div data-testid="generic-app">Generic App Component</div>,
}));

// Mock the controllers
const mockGetPage = vi.fn();

vi.mock('../../controllers/StateApp', () => ({
  default: class MockStateApp {
    constructor() {}
  },
}));

vi.mock('../../controllers/StateAllPages', () => ({
  default: class MockStateAllPages {
    getPage = mockGetPage;
  },
}));

interface MockPage {
  _type: 'generic' | 'complex';
}

describe('AppPage Component', () => {
  const mockApp = {} as unknown;
  const mockAllPages = {
    getPage: mockGetPage,
  } as unknown;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render GenericApp when page type is generic', () => {
    const mockPage: MockPage = { _type: 'generic' };
    mockGetPage.mockReturnValue(mockPage);

    renderWithProviders(
      <AppPage instance={mockAllPages as Parameters<typeof AppPage>[0]['instance']} app={mockApp as Parameters<typeof AppPage>[0]['app']} />
    );

    expect(screen.getByTestId('generic-app')).toBeInTheDocument();
    expect(screen.queryByTestId('complex-app')).not.toBeInTheDocument();
  });

  it('should render ComplexApp when page type is complex', () => {
    const mockPage: MockPage = { _type: 'complex' };
    mockGetPage.mockReturnValue(mockPage);

    renderWithProviders(
      <AppPage instance={mockAllPages as Parameters<typeof AppPage>[0]['instance']} app={mockApp as Parameters<typeof AppPage>[0]['app']} />
    );

    expect(screen.getByTestId('complex-app')).toBeInTheDocument();
    expect(screen.queryByTestId('generic-app')).not.toBeInTheDocument();
  });

  it('should call getPage with app parameter', () => {
    const mockPage: MockPage = { _type: 'generic' };
    mockGetPage.mockReturnValue(mockPage);

    renderWithProviders(
      <AppPage instance={mockAllPages as Parameters<typeof AppPage>[0]['instance']} app={mockApp as Parameters<typeof AppPage>[0]['app']} />
    );

    expect(mockGetPage).toHaveBeenCalledWith(mockApp);
  });

  it('should render Fragment wrapper', () => {
    const mockPage: MockPage = { _type: 'generic' };
    mockGetPage.mockReturnValue(mockPage);

    const { container } = renderWithProviders(
      <AppPage instance={mockAllPages as Parameters<typeof AppPage>[0]['instance']} app={mockApp as Parameters<typeof AppPage>[0]['app']} />
    );

    // Fragment doesn't create extra DOM nodes
    expect(container.firstChild).toEqual(screen.getByTestId('generic-app'));
  });
});