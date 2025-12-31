import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import StateJsxLogo from '../../../mui/appbar/state.jsx.logo';
import type StatePageAppbar from '../../../controllers/templates/StatePageAppbar';

// Mock the logging module
vi.mock('../../../business.logic/logging', () => ({
  err: vi.fn(),
}));

// Mock StatePageAppbar for testing
const createMockAppbar = (logoTag: string, logoProps: Record<string, unknown> = {}, logoContainerProps: Record<string, unknown> = {}): StatePageAppbar => ({
  logoTag,
  logoProps,
  logoContainerProps,
} as unknown as StatePageAppbar);

describe('src/mui/appbar/state.jsx.logo.tsx', () => {
  it('should render img logo correctly', () => {
    const mockAppbar = createMockAppbar('img', { 
      src: '/test-logo.png',
      alt: 'Test Logo'
    });
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    const imgElement = container.querySelector('img');
    
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/test-logo.png');
    expect(imgElement).toHaveAttribute('alt', 'Test Logo');
  });

  it('should render path logo correctly', () => {
    const mockAppbar = createMockAppbar('path', { 
      d: 'M10 10 L20 20'
    });
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    const pathElement = container.querySelector('path');
    
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('d', 'M10 10 L20 20');
  });

  it('should render div logo correctly', () => {
    const mockAppbar = createMockAppbar('div', { 
      className: 'custom-logo'
    });
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    const divElement = container.querySelector('div.custom-logo');
    
    expect(divElement).toBeInTheDocument();
  });

  it('should handle uppercase logo tag', () => {
    const mockAppbar = createMockAppbar('IMG', { 
      src: '/test-logo.png'
    });
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    const imgElement = container.querySelector('img');
    
    expect(imgElement).toBeInTheDocument();
  });

  it('should apply logo container props', () => {
    const mockAppbar = createMockAppbar('img', 
      { src: '/test-logo.png' },
      { className: 'logo-container', 'data-testid': 'logo-wrapper' }
    );
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    const containerElement = container.querySelector('.logo-container');
    
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveAttribute('data-testid', 'logo-wrapper');
  });

  it('should return null and log error for invalid logo tag', async () => {
    const { err } = await import('../../../business.logic/logging');
    const mockAppbar = createMockAppbar('invalid', { src: '/test-logo.png' });
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    
    expect(container.firstChild).toBeNull();
    expect(err).toHaveBeenCalledWith('Invalid `invalid` logo.');
  });

  it('should render with empty props gracefully', () => {
    const mockAppbar = createMockAppbar('img');
    
    const { container } = render(<StateJsxLogo instance={mockAppbar} />);
    const imgElement = container.querySelector('img');
    
    expect(imgElement).toBeInTheDocument();
  });
});