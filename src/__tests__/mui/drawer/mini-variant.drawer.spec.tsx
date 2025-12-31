import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import MiniDrawer from '../../../mui/drawer/mini-variant.drawer';
import type StatePageDrawer from '../../../controllers/templates/StatePageDrawer';

// Mock StatePageDrawer for testing
const createMockMiniDrawer = (open: boolean = false): StatePageDrawer => ({
  open,
  variant: 'permanent',
  anchor: 'left',
  width: 240,
  miniWidth: 56,
  items: [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      props: { 'data-testid': 'drawer-item-dashboard' },
    },
    {
      text: 'Settings',
      icon: 'settings',
      props: { 'data-testid': 'drawer-item-settings' },
    },
  ],
  props: {
    'data-testid': 'mini-drawer',
  },
  paperProps: {},
} as unknown as StatePageDrawer);

describe('src/mui/drawer/mini-variant.drawer.tsx', () => {
  it('should render mini drawer correctly', () => {
    const mockDrawer = createMockMiniDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <MiniDrawer instance={mockDrawer} />
    );
    
    expect(getByTestId('mini-drawer')).toBeInTheDocument();
  });

  it('should render drawer items', () => {
    const mockDrawer = createMockMiniDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <MiniDrawer instance={mockDrawer} />
    );
    
    expect(getByTestId('drawer-item-dashboard')).toBeInTheDocument();
    expect(getByTestId('drawer-item-settings')).toBeInTheDocument();
  });

  it('should handle closed state', () => {
    const mockDrawer = createMockMiniDrawer(false);
    
    const { container } = renderWithProviders(
      <MiniDrawer instance={mockDrawer} />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with mini variant styling', () => {
    const mockDrawer = createMockMiniDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <MiniDrawer instance={mockDrawer} />
    );
    
    const drawer = getByTestId('mini-drawer');
    expect(drawer).toBeInTheDocument();
  });

  it('should handle permanent variant', () => {
    const mockDrawer = createMockMiniDrawer(true);
    
    const { container } = renderWithProviders(
      <MiniDrawer instance={mockDrawer} />
    );
    
    const drawerElement = container.querySelector('[class*="MuiDrawer"]');
    expect(drawerElement).toBeInTheDocument();
  });
});