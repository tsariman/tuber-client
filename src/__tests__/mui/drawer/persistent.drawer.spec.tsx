import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import PersistentDrawer from '../../../mui/drawer/persistent.drawer';
import type StateDrawerPersistent from '../../../controllers/templates/StateDrawerPersistent';

// Mock StateDrawerPersistent for testing
const createMockPersistentDrawer = (open: boolean = false): StateDrawerPersistent => ({
  open,
  variant: 'persistent',
  anchor: 'left',
  width: 240,
  items: [
    {
      text: 'Home',
      icon: 'home',
      props: { 'data-testid': 'drawer-item-home' },
    },
    {
      text: 'Profile',
      icon: 'person',
      props: { 'data-testid': 'drawer-item-profile' },
    },
  ],
  props: {
    'data-testid': 'persistent-drawer',
  },
  paperProps: {},
  headerContent: 'Navigation Menu',
} as unknown as StateDrawerPersistent);

describe('src/mui/drawer/persistent.drawer.tsx', () => {
  it('should render persistent drawer when open', () => {
    const mockDrawer = createMockPersistentDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <PersistentDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('persistent-drawer')).toBeInTheDocument();
  });

  it('should render drawer navigation items', () => {
    const mockDrawer = createMockPersistentDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <PersistentDrawer def={mockDrawer} />
    );
    
    expect(getByTestId('drawer-item-home')).toBeInTheDocument();
    expect(getByTestId('drawer-item-profile')).toBeInTheDocument();
  });

  it('should handle closed state', () => {
    const mockDrawer = createMockPersistentDrawer(false);
    
    const { container } = renderWithProviders(
      <PersistentDrawer def={mockDrawer} />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with persistent variant', () => {
    const mockDrawer = createMockPersistentDrawer(true);
    
    const { getByTestId } = renderWithProviders(
      <PersistentDrawer def={mockDrawer} />
    );
    
    const drawer = getByTestId('persistent-drawer');
    expect(drawer).toBeInTheDocument();
  });

  it('should handle header content', () => {
    const mockDrawer = createMockPersistentDrawer(true);
    
    const { getByText } = renderWithProviders(
      <PersistentDrawer def={mockDrawer} />
    );
    
    expect(getByText('Navigation Menu')).toBeInTheDocument();
  });
});