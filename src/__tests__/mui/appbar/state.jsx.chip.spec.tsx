import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxChip from '../../../mui/appbar/state.jsx.chip';
import StateFormItemCustomChip from '../../../controllers/templates/StateFormItemCustomChip';

// Mock StateFormItemCustomChip for testing
const createMockChip = (id: string, label: string): StateFormItemCustomChip<unknown> => ({
  id,
  label,
  variant: 'filled',
  color: 'primary',
  props: {},
  onClick: () => () => {},
  onDelete: () => () => {},
} as unknown as StateFormItemCustomChip<unknown>);

describe('src/mui/appbar/state.jsx.chip.tsx', () => {
  it('should render empty when no chips are provided', () => {
    const { container } = renderWithProviders(<StateJsxChip def={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should render single chip correctly', () => {
    const mockChips = [createMockChip('chip1', 'Test Chip')];
    
    const { getByText } = renderWithProviders(<StateJsxChip def={mockChips} />);
    expect(getByText('Test Chip')).toBeInTheDocument();
  });

  it('should render multiple chips correctly', () => {
    const mockChips = [
      createMockChip('chip1', 'First Chip'),
      createMockChip('chip2', 'Second Chip'),
      createMockChip('chip3', 'Third Chip'),
    ];
    
    const { getByText } = renderWithProviders(<StateJsxChip def={mockChips} />);
    expect(getByText('First Chip')).toBeInTheDocument();
    expect(getByText('Second Chip')).toBeInTheDocument();
    expect(getByText('Third Chip')).toBeInTheDocument();
  });

  it('should render chips with correct MUI Chip elements', () => {
    const mockChips = [createMockChip('chip1', 'Test Chip')];
    
    const { container } = renderWithProviders(<StateJsxChip def={mockChips} />);
    const chipElement = container.querySelector('.MuiChip-root');
    expect(chipElement).toBeInTheDocument();
  });

  it('should handle empty chip array gracefully', () => {
    const { container } = renderWithProviders(<StateJsxChip def={[]} />);
    expect(container.querySelector('.MuiChip-root')).not.toBeInTheDocument();
  });
});