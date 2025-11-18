import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxMiniAppbar from '../../../mui/appbar/state.jsx.mini.appbar';
import type StatePage from '../../../controllers/StatePage';

// Mock StatePage for testing
const createMockPage = (hasDrawer: boolean = false, hasLogo: boolean = false): StatePage => ({
  appbar: {
    props: {},
    toolbarProps: {},
    parent: {
      hasDrawer,
    },
    menuIconProps: {},
    hasLogo,
    typography: {
      fontFamily: 'Arial',
      color: '#000000',
    },
    textLogoProps: {},
    items: [],
  },
  parent: {
    parent: {
      app: {
        title: 'Mini App',
      },
    },
  },
} as unknown as StatePage);

describe('src/mui/appbar/state.jsx.mini.appbar.tsx', () => {
  it('should render mini appbar correctly', () => {
    const mockPage = createMockPage();
    
    const { container } = renderWithProviders(<StateJsxMiniAppbar def={mockPage} />);
    const appbar = container.querySelector('[role="banner"]');
    
    expect(appbar).toBeInTheDocument();
  });

  it('should render menu icon when drawer is available', () => {
    const mockPage = createMockPage(true);
    
    const { container } = renderWithProviders(<StateJsxMiniAppbar def={mockPage} />);
    const menuButton = container.querySelector('button');
    
    expect(menuButton).toBeInTheDocument();
  });

  it('should display app title when no logo', () => {
    const mockPage = createMockPage(false, false);
    
    const { getByText } = renderWithProviders(<StateJsxMiniAppbar def={mockPage} />);
    
    expect(getByText('Mini App')).toBeInTheDocument();
  });

  it('should adapt to drawer open state', () => {
    const mockPage = createMockPage(true);
    const preloadedState = {
      drawer: { open: true, width: 240 },
    };
    
    const { container } = renderWithProviders(<StateJsxMiniAppbar def={mockPage} />, { preloadedState });
    const appbar = container.querySelector('[role="banner"]');
    
    expect(appbar).toBeInTheDocument();
  });
});
