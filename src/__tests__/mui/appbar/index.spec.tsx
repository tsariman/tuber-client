import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../test-utils';
import StateJsxAppbar from '../../../mui/appbar';
import type StatePage from '../../../controllers/StatePage';
import type StateApp from '../../../controllers/StateApp';
import stateMocks from '../__mocks__/appbar/index.spec';

// Mock the appbar components to avoid complex rendering
vi.mock('../../../mui/appbar/state.jsx.appbar.basic', () => ({
  default: () => <div data-testid="basic-appbar">Basic Appbar</div>
}));

vi.mock('../../../mui/appbar/state.jsx.appbar.responsive', () => ({
  default: () => <div data-testid="responsive-appbar">Responsive Appbar</div>
}));

vi.mock('../../../mui/appbar/state.jsx.appbar.mini', () => ({
  default: () => <div data-testid="mini-appbar">Mini Appbar</div>
}));

vi.mock('../../../mui/appbar/state.jsx.appbar.mid-search', () => ({
  default: () => <div data-testid="middle-search-appbar">Middle Search Appbar</div>
}));

vi.mock('../../../mui/builder.cpn', () => ({
  default: () => <div data-testid="custom-appbar">Custom Appbar</div>
}));

// Mock appbar object that matches the component's expectations
const createMockAppbar = (config: any) => ({
  appbarStyle: config.appbarStyle,
  _type: config._type,
  configure: vi.fn(),
  ...config
});

// Helper function to create mock StatePage
const createMockPage = (overrides: Partial<{
  hideAppbar: boolean;
  hasAppbar: boolean;
  hasCustomAppbar: boolean;
  appbar: ReturnType<typeof createMockAppbar> | null;
  appbarCustom: { items: unknown[] } | null;
}> = {}) => ({
  hideAppbar: false,
  hasAppbar: false,
  hasCustomAppbar: false,
  appbar: null,
  appbarCustom: null,
  ...overrides
} as unknown as StatePage);

describe('StateJsxAppbar Component', () => {
  // Minimal mock of StateApp; components under test don't read fields
  const mockApp = {} as unknown as StateApp;
  describe('Early Returns and Edge Cases', () => {
    it('should return null when hideAppbar is true', () => {
      const mockPage = createMockPage({ hideAppbar: true });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when no appbar configuration exists', () => {
      const mockPage = createMockPage({
        hasAppbar: false,
        hasCustomAppbar: false,
        appbar: { configure: vi.fn() } as any,
        appbarCustom: null
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when appbar exists but style is not defined', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar({})
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Appbar Style Selection', () => {
    it('should render BasicAppbar when appbarStyle is "basic"', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state1)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('basic-appbar')).toBeInTheDocument();
    });

    it('should render BasicAppbar when _type is "basic"', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state2)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('basic-appbar')).toBeInTheDocument();
    });

    it('should render ResponsiveAppbar when _type is "responsive"', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state5)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('responsive-appbar')).toBeInTheDocument();
    });

    it('should render MiniAppbar when appbarStyle is "mini"', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state8)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('mini-appbar')).toBeInTheDocument();
    });

    it('should render MiddleSearchAppbar when appbarStyle is "middle_search"', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state3)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('middle-search-appbar')).toBeInTheDocument();
    });

    it('should return null when style is "none"', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar({ appbarStyle: 'none' })
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Style Precedence', () => {
    it('should prioritize appbarStyle over _type when both are set', () => {
      // state4: appbarStyle 'mini' should override _type 'basic'
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state4)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('mini-appbar')).toBeInTheDocument();
    });

    it('should use appbarStyle when both appbarStyle and _type are different - case 1', () => {
      // state6: appbarStyle 'responsive' should override _type 'none'
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state6)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('responsive-appbar')).toBeInTheDocument();
    });

    it('should use appbarStyle when both appbarStyle and _type are different - case 2', () => {
      // state7: appbarStyle 'basic' should override _type 'middle_search'
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state7)
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('basic-appbar')).toBeInTheDocument();
    });
  });

  describe('Custom Appbar Handling', () => {
    it('should render custom appbar when hasCustomAppbar is true and appbarCustom exists', () => {
      const mockPage = createMockPage({
        hasAppbar: false,
        hasCustomAppbar: true,
        appbar: { configure: vi.fn() } as any,
        appbarCustom: { items: [] }
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('custom-appbar')).toBeInTheDocument();
    });

    it('should prioritize standard appbar over custom appbar when both exist', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        hasCustomAppbar: true,
        appbar: createMockAppbar(stateMocks.state1),
        appbarCustom: { items: [] }
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('basic-appbar')).toBeInTheDocument();
    });

    it('should return null when hasCustomAppbar is true but appbarCustom is null', () => {
      const mockPage = createMockPage({
        hasAppbar: false,
        hasCustomAppbar: true,
        appbar: { configure: vi.fn() } as any,
        appbarCustom: null
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Invalid or Unknown Styles', () => {
    it('should return null for unknown appbar style', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar({ appbarStyle: 'unknown-style' })
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null for unknown _type', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar({ _type: 'unknown-type' })
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Component Memoization', () => {
    it('should handle empty appbar configuration', () => {
      // state9: empty object
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar(stateMocks.state9)
      });
      const { container } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle appbar with only _type defined', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar({ _type: 'basic' })
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('basic-appbar')).toBeInTheDocument();
    });

    it('should handle appbar with only appbarStyle defined', () => {
      const mockPage = createMockPage({
        hasAppbar: true,
        appbar: createMockAppbar({ appbarStyle: 'responsive' })
      });
      const { getByTestId } = renderWithProviders(<StateJsxAppbar instance={mockPage} app={mockApp} />);
      expect(getByTestId('responsive-appbar')).toBeInTheDocument();
    });
  });
});