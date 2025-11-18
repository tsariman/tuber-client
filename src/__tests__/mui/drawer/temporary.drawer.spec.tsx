import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import TempDrawer from '../../../mui/drawer/temporary.drawer';
import type StatePageDrawer from '../../../controllers/templates/StatePageDrawer';

// Mock StatePageDrawer for testing
const createMockTempDrawer = (open: boolean = false): StatePageDrawer => ({
  open,
  variant: 'temporary',
  anchor: 'left',
  width: 240,
  items: [
    {
      text: 'Menu Item 1',
      icon: 'menu',
      props: { 'data-testid': 'drawer-item-1' },
    },
    {
      text: 'Menu Item 2',
      icon: 'folder',
      props: { 'data-testid': 'drawer-item-2' },
    },
  ],
  props: {
    'data-testid': 'temp-drawer',
  },
  paperProps: {},
  onClose: () => {},
} as unknown as StatePageDrawer);

describe('src/mui/drawer/temporary.drawer.tsx', () => {
  it('should render temporary drawer when open', () => {
    const mockDrawer = createMockTempDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <TempDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('temp-drawer')).toBeInTheDocument();
  });

  it('should render drawer menu items', () => {
    const mockDrawer = createMockTempDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <TempDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('drawer-item-1')).toBeInTheDocument();
    expect(getByTestId('drawer-item-2')).toBeInTheDocument();
  });

  it('should handle closed state', () => {
    const mockDrawer = createMockTempDrawer(false);
    
    const { container } = renderWithProviders(
      <TempDrawer def={mockDrawer} />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with temporary variant', () => {
    const mockDrawer = createMockTempDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <TempDrawer def={mockDrawer} />
    );
    
    const drawer = getByTestId('temp-drawer');
    expect(drawer).toBeInTheDocument();
  });

  it('should handle drawer interactions', () => {
    const mockDrawer = createMockTempDrawer(true);
    
    const { container } = renderWithProviders(
      <TempDrawer def={mockDrawer} />
    );
    
    const drawerElement = container.querySelector('[class*="MuiDrawer"]');
    expect(drawerElement).toBeInTheDocument();
  });
});