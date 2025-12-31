import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import StateJsxDrawer from '../../../mui/drawer';
import type StatePage from '../../../controllers/StatePage';

// Mock Config module
vi.mock('../../../config', () => ({
  default: {
    read: vi.fn(() => null),
    write: vi.fn(),
  },
}));

// Mock StatePage for testing
const createMockPage = (hasDrawer: boolean = false, hideDrawer: boolean = false, drawerType: string = 'mini'): StatePage => ({
  hideDrawer,
  hasDrawer,
  drawer: {
    _type: drawerType,
    state: { _type: drawerType },
  },
  setDrawer: vi.fn(),
} as unknown as StatePage);

describe('src/mui/drawer/index.tsx', () => {
  it('should return null when drawer is hidden', () => {
    const mockPage = createMockPage(false, true);
    
    const { container } = render(<StateJsxDrawer instance={mockPage} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should return null when no drawer is available', () => {
    const mockPage = createMockPage(false, false);
    
    const { container } = render(<StateJsxDrawer instance={mockPage} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should render mini drawer when hasDrawer is true', () => {
    const mockPage = createMockPage(true, false, 'mini');
    
    const { container } = render(<StateJsxDrawer instance={mockPage} />);
    
    // Should render some drawer content
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render responsive drawer', () => {
    const mockPage = createMockPage(true, false, 'responsive');
    
    const { container } = render(<StateJsxDrawer instance={mockPage} />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render fragment for none type', () => {
    const mockPage = createMockPage(true, false, 'none');
    
    const { container } = render(<StateJsxDrawer instance={mockPage} />);
    
    // Fragment should render as empty
    expect(container.firstChild).toBeNull();
  });
});