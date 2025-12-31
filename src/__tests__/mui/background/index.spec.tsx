import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Background from '../../../mui/background';
import type { StateBackground, StatePage } from '../../../controllers';

// Mock StateBackground for testing
const createMockBackground = (type: string = 'color', value: string = '#ffffff'): StateBackground<StatePage> => ({
  _type: type,
  value,
  sx: {
    backgroundColor: value,
  },
} as unknown as StateBackground<StatePage>);

describe('src/mui/background/index.tsx', () => {
  it('should render color background correctly', () => {
    const mockBackground = createMockBackground('color', '#ff0000');
    
    const { container } = render(
      <Background instance={mockBackground}>
        <div data-testid="background-content">Content with background</div>
      </Background>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render image background correctly', () => {
    const mockBackground = createMockBackground('image', '/path/to/image.jpg');
    
    const { container } = render(
      <Background instance={mockBackground}>
        <div>Content with image background</div>
      </Background>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children content', () => {
    const mockBackground = createMockBackground();
    
    const { getByText } = render(
      <Background instance={mockBackground}>
        <div>Test content</div>
      </Background>
    );
    
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('should handle gradient background', () => {
    const mockBackground = createMockBackground('gradient', 'linear-gradient(45deg, #ff0000, #0000ff)');
    
    const { container } = render(
      <Background instance={mockBackground}>
        <div>Gradient content</div>
      </Background>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });
});