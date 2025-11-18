import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../test-utils';
import StateJsxBadgedIcon, { StateJsxUnifiedIconProvider, StateJsxIcon } from '../../mui/icon';
import type StateFormItemCustom from '../../controllers/StateFormItemCustom';

// Mock StateFormItemCustom for testing
const createMockItem = (iconType: 'icon' | 'svgIcon' | 'muiIcon' | 'none' = 'icon', hasBadge: boolean = false): StateFormItemCustom<unknown> => {
  const baseItem = {
    icon: iconType === 'icon' ? 'menu' : undefined,
    svgIcon: iconType === 'svgIcon' ? 'menu' : 'none',
    muiIcon: iconType === 'muiIcon' ? 'menu' : undefined,
    iconProps: {},
    badge: hasBadge ? { color: 'error' } : undefined,
  };
  
  return baseItem as unknown as StateFormItemCustom<unknown>;
};

describe('src/mui/state.jsx.icons.tsx', () => {

  describe('StateJsxIcon', () => {

    it('should render icon correctly', () => {
      const { container } = renderWithProviders(
        <StateJsxIcon name="menu" />
      );
      
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    it('should apply config props to icon', () => {
      const config = { fontSize: 'large' as const, color: 'primary' as const };
      
      const { container } = renderWithProviders(
        <StateJsxIcon name="menu" config={config} />
      );
      
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

  });

  describe('StateJsxUnifiedIconProvider', () => {

    it('should render svg icon', () => {
      const mockItem = createMockItem('svgIcon');
      
      const { container } = renderWithProviders(
        <StateJsxUnifiedIconProvider def={mockItem} />
      );
      
      // Should render some icon content
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render state icon', () => {
      const mockItem = createMockItem('icon');
      
      const { container } = renderWithProviders(
        <StateJsxUnifiedIconProvider def={mockItem} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render none icon with error symbol', () => {
      const mockItem = createMockItem('none');
      
      const { getByText } = renderWithProviders(
        <StateJsxUnifiedIconProvider def={mockItem} />
      );
      
      expect(getByText('❌')).toBeInTheDocument();
    });

  });

  describe('StateJsxBadgedIcon', () => {

    it('should render icon without badge', () => {
      const mockItem = createMockItem('icon', false);
      
      const { container } = renderWithProviders(
        <StateJsxBadgedIcon def={mockItem} />
      );
      
      const badge = container.querySelector('.MuiBadge-root');
      expect(badge).not.toBeInTheDocument();
    });

    it('should render icon with badge', () => {
      const mockItem = createMockItem('icon', true);
      
      const { container } = renderWithProviders(
        <StateJsxBadgedIcon def={mockItem} />
      );
      
      const badge = container.querySelector('.MuiBadge-root');
      expect(badge).toBeInTheDocument();
    });

  });

});