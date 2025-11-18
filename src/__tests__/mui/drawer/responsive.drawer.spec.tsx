import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import ResponsiveDrawer from '../../../mui/drawer/responsive.drawer';
import type StateDrawerResponsive from '../../../controllers/templates/StateDrawerResponsive';

// Mock StateDrawerResponsive for testing
const createMockResponsiveDrawer = (open: boolean = false, mobileOpen: boolean = false): StateDrawerResponsive => ({
  open,
  mobileOpen,
  variant: 'temporary',
  anchor: 'left',
  width: 240,
  items: [
    {
      text: 'Overview',
      icon: 'dashboard',
      props: { 'data-testid': 'drawer-item-overview' },
    },
    {
      text: 'Analytics',
      icon: 'analytics',
      props: { 'data-testid': 'drawer-item-analytics' },
    },
  ],
  props: {
    'data-testid': 'responsive-drawer',
  },
  paperProps: {},
  breakpoint: 'sm',
} as unknown as StateDrawerResponsive);

describe('src/mui/drawer/responsive.drawer.tsx', () => {
  it('should render responsive drawer correctly', () => {
    const mockDrawer = createMockResponsiveDrawer(true, false);
    
    const { getByTestId } = renderWithProviders(
      <ResponsiveDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('responsive-drawer')).toBeInTheDocument();
  });

  it('should render drawer navigation items', () => {
    const mockDrawer = createMockResponsiveDrawer(true, false);
    
    const { getByTestId } = renderWithProviders(
      <ResponsiveDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('drawer-item-overview')).toBeInTheDocument();
    expect(getByTestId('drawer-item-analytics')).toBeInTheDocument();
  });

  it('should handle mobile open state', () => {
    const mockDrawer = createMockResponsiveDrawer(false, true);
    
    const { getByTestId } = renderWithProviders(
      <ResponsiveDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('responsive-drawer')).toBeInTheDocument();
  });

  it('should handle closed state', () => {
    const mockDrawer = createMockResponsiveDrawer(false, false);
    
    const { container } = renderWithProviders(
      <ResponsiveDrawer def={mockDrawer} />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle responsive breakpoints', () => {
    const mockDrawer = createMockResponsiveDrawer(true, false);
    
    const { getByTestId } = renderWithProviders(
      <ResponsiveDrawer def={mockDrawer} />
    );
    
    const drawer = getByTestId('responsive-drawer');
    expect(drawer).toBeInTheDocument();
  });
});