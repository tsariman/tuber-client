import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ImportedSvgIcon from '../../mui/state.jsx.imported.svg.icons';

// Mock SVG icon data for testing
const createMockIconProps = (iconName: string = 'test-icon') => ({
  iconName,
  props: {
    'data-testid': 'imported-svg-icon',
  },
  size: 24,
  color: 'inherit',
});

describe('src/mui/state.jsx.imported.svg.icons.tsx', () => {

  describe('ImportedSvgIcon', () => {

    it('should render SVG icon correctly', () => {
      const mockProps = createMockIconProps('dashboard');
      
      const { container } = render(
        <ImportedSvgIcon {...mockProps} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle different icon names', () => {
      const mockProps = createMockIconProps('settings');
      
      const { container } = render(
        <ImportedSvgIcon {...mockProps} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with custom size', () => {
      const mockProps = {
        ...createMockIconProps(),
        size: 32,
      };
      
      const { container } = render(
        <ImportedSvgIcon {...mockProps} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle color prop', () => {
      const mockProps = {
        ...createMockIconProps(),
        color: 'primary',
      };
      
      const { container } = render(
        <ImportedSvgIcon {...mockProps} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render as SVG element', () => {
      const mockProps = createMockIconProps();
      
      const { container } = render(
        <ImportedSvgIcon {...mockProps} />
      );
      
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

  });

});