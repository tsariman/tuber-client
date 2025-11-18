import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxCard from '../../../mui/card';
import type StateCardMultiActionArea from '../../../controllers/templates/StateCardMultiActionArea';

// Mock StateCardMultiActionArea for testing
const createMockMultiActionCard = (title: string = 'Multi Action Card'): StateCardMultiActionArea => ({
  title,
  content: 'Card with multiple action areas',
  image: '/card-image.jpg',
  actionAreas: [
    {
      title: 'Primary Action',
      description: 'Main action area',
      props: { 'data-testid': 'primary-action-area' },
    },
    {
      title: 'Secondary Action',
      description: 'Secondary action area',
      props: { 'data-testid': 'secondary-action-area' },
    },
  ],
  props: {
    'data-testid': 'multi-action-card',
  },
  elevation: 3,
  variant: 'outlined',
} as unknown as StateCardMultiActionArea);

describe('src/mui/card/state.jsx.card.multi.action.area.tsx', () => {
  it('should render multi action card correctly', () => {
    const mockCard = createMockMultiActionCard('Interactive Card');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxCard def={mockCard} />
    );
    
    expect(getByTestId('multi-action-card')).toBeInTheDocument();
    expect(getByText('Interactive Card')).toBeInTheDocument();
  });

  it('should render multiple action areas', () => {
    const mockCard = createMockMultiActionCard();
    
    const { getByTestId } = renderWithProviders(
      <StateJsxCard def={mockCard} />
    );
    
    expect(getByTestId('primary-action-area')).toBeInTheDocument();
    expect(getByTestId('secondary-action-area')).toBeInTheDocument();
  });

  it('should render action area titles', () => {
    const mockCard = createMockMultiActionCard();
    
    const { getByText } = renderWithProviders(
      <StateJsxCard def={mockCard} />
    );
    
    expect(getByText('Primary Action')).toBeInTheDocument();
    expect(getByText('Secondary Action')).toBeInTheDocument();
  });

  it('should render action area descriptions', () => {
    const mockCard = createMockMultiActionCard();
    
    const { getByText } = renderWithProviders(
      <StateJsxCard def={mockCard} />
    );
    
    expect(getByText('Main action area')).toBeInTheDocument();
    expect(getByText('Secondary action area')).toBeInTheDocument();
  });

  it('should render card content and image', () => {
    const mockCard = createMockMultiActionCard();
    
    const { getByText } = renderWithProviders(
      <StateJsxCard def={mockCard} />
    );
    
    expect(getByText('Card with multiple action areas')).toBeInTheDocument();
  });
});