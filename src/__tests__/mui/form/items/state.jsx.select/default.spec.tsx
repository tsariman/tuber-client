import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../../test-utils';
import StateJsxSelectDefault from '../../../../../mui/form/items/state.jsx.select/default';
import type StateFormItemSelect from '../../../../../controllers/templates/StateFormItemSelect';

// Mock StateFormItemSelect for default select testing
const createMockDefaultSelect = (label: string = 'Default Select'): StateFormItemSelect => ({
  label,
  name: 'defaultSelect',
  _type: 'select',
  value: '',
  options: [
    {
      label: 'Select an option...',
      value: '',
      disabled: true,
      props: { 'data-testid': 'default-option' },
    },
    {
      label: 'First Choice',
      value: 'choice1',
      props: { 'data-testid': 'choice-1' },
    },
    {
      label: 'Second Choice',
      value: 'choice2',
      props: { 'data-testid': 'choice-2' },
    },
  ],
  props: {
    'data-testid': 'default-select',
  },
  helperText: 'Please select an option',
  error: false,
  disabled: false,
  variant: 'standard',
  fullWidth: true,
  multiple: false,
} as unknown as StateFormItemSelect);

describe('src/mui/form/items/state.jsx.select/default.tsx', () => {
  it('should render default select correctly', () => {
    const mockSelect = createMockDefaultSelect('Status');
    
    const { getByTestId } = renderWithProviders(
      <StateJsxSelectDefault def={mockSelect} />
    );
    
    expect(getByTestId('default-select')).toBeInTheDocument();
  });

  it('should render with default placeholder', () => {
    const mockSelect = createMockDefaultSelect();
    
    const { getByTestId } = renderWithProviders(
      <StateJsxSelectDefault def={mockSelect} />
    );
    
    expect(getByTestId('default-option')).toBeInTheDocument();
  });

  it('should render select options', () => {
    const mockSelect = createMockDefaultSelect();
    
    const { getByTestId } = renderWithProviders(
      <StateJsxSelectDefault def={mockSelect} />
    );
    
    expect(getByTestId('choice-1')).toBeInTheDocument();
    expect(getByTestId('choice-2')).toBeInTheDocument();
  });

  it('should handle empty initial value', () => {
    const mockSelect = createMockDefaultSelect();
    
    const { container } = renderWithProviders(
      <StateJsxSelectDefault def={mockSelect} />
    );
    
    const select = container.querySelector('select, input[role="button"]');
    expect(select).toBeInTheDocument();
  });

  it('should render helper text', () => {
    const mockSelect = createMockDefaultSelect();
    
    const { getByText } = renderWithProviders(
      <StateJsxSelectDefault def={mockSelect} />
    );
    
    expect(getByText('Please select an option')).toBeInTheDocument();
  });
});