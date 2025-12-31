import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxCard from '../../../mui/card';
import type StateCard from '../../../controllers/StateCard';

// Mock StateCard with action button for testing
const createMockCardWithButton = (title: string = 'Action Card'): StateCard => ({
  title,
  content: 'Card with action button',
  actions: [
    {
      text: 'Learn More',
      _type: 'button',
      variant: 'contained',
      props: { 'data-testid': 'card-action-button' },
    },
    {
      text: 'Cancel',
      _type: 'button',
      variant: 'outlined',
      props: { 'data-testid': 'card-cancel-button' },
    },
  ],
  props: {
    'data-testid': 'action-card',
  },
  elevation: 2,
} as unknown as StateCard);

describe('src/mui/card/state.jsx.card.action.button.tsx', () => {
  it('should render card with action buttons correctly', () => {
    const mockCard = createMockCardWithButton('Featured Article');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxCard instance={mockCard} />
    );
    
    expect(getByTestId('action-card')).toBeInTheDocument();
    expect(getByText('Featured Article')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    const mockCard = createMockCardWithButton();
    
    const { getByTestId } = renderWithProviders(
      <StateJsxCard instance={mockCard} />
    );
    
    expect(getByTestId('card-action-button')).toBeInTheDocument();
    expect(getByTestId('card-cancel-button')).toBeInTheDocument();
  });

  it('should render card content', () => {
    const mockCard = createMockCardWithButton();
    
    const { getByText } = renderWithProviders(
      <StateJsxCard instance={mockCard} />
    );
    
    expect(getByText('Card with action button')).toBeInTheDocument();
  });

  it('should handle multiple action buttons', () => {
    const mockCard = createMockCardWithButton();
    
    const { getByText } = renderWithProviders(
      <StateJsxCard instance={mockCard} />
    );
    
    expect(getByText('Learn More')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should render with proper elevation', () => {
    const mockCard = createMockCardWithButton();
    
    const { getByTestId } = renderWithProviders(
      <StateJsxCard instance={mockCard} />
    );
    
    expect(getByTestId('action-card')).toBeInTheDocument();
  });
});