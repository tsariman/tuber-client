import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StateCard from '../../../controllers/StateCard';
import Card from '../../../mui/card';

// Mock StateCard for testing
const createMockCard = (type: 'basic' | 'multi_action_area' | 'complex' = 'basic'): StateCard => ({
  _type: type,
  state: {
    props: { 'data-testid': 'card' },
    contentProps: { children: 'Test content' },
    actionsProps: {},
    actions: [],
    _key: 'test-card',
  },
} as unknown as StateCard);

describe('src/mui/card/index.tsx', () => {
  it('should render basic card correctly', () => {
    const mockCard = createMockCard('basic');
    
    const { getByTestId, getByText } = render(<Card instance={mockCard} />);
    
    expect(getByTestId('card')).toBeInTheDocument();
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('should render multi action area card', () => {
    const mockCard = createMockCard('multi_action_area');
    
    const { container } = render(<Card instance={mockCard} />);
    const cardElement = container.querySelector('.MuiCard-root');
    
    expect(cardElement).toBeInTheDocument();
  });

  it('should render complex card', () => {
    const mockCard = createMockCard('complex');
    
    const { container } = render(<Card instance={mockCard} />);
    const cardElement = container.querySelector('.MuiCard-root');
    
    expect(cardElement).toBeInTheDocument();
  });

  it('should handle card without actions', () => {
    const mockCard = createMockCard('basic');
    
    const { container } = render(<Card instance={mockCard} />);
    const actionsElement = container.querySelector('.MuiCardActions-root');
    
    expect(actionsElement).toBeInTheDocument();
  });
});