import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import StateJsxInput from '../../../../mui/form/items/state.jsx.input';

// Mock StateFormItem for input testing
const createMockInput = (label: string = 'Input Field', type: string = 'text') => ({
  label,
  name: 'inputField',
  _type: 'input',
  inputType: type,
  value: '',
  props: {
    'data-testid': 'input-field',
  },
  inputProps: {
    placeholder: `Enter ${label.toLowerCase()}`,
  },
  helperText: `Please enter your ${label.toLowerCase()}`,
  error: false,
  disabled: false,
  variant: 'outlined',
  fullWidth: true,
  required: false,
} as unknown as Record<string, unknown>);

describe('src/mui/form/items/state.jsx.input.tsx', () => {

  describe('StateJsxInput', () => {

    it('should render input field correctly', () => {
      const mockInput = createMockInput('Username', 'text');
      
      const { getByTestId } = renderWithProviders(
        <StateJsxInput def={mockInput} />
      );
      
      expect(getByTestId('input-field')).toBeInTheDocument();
    });

    it('should render with label', () => {
      const mockInput = createMockInput('Email Address');
      
      const { getByLabelText } = renderWithProviders(
        <StateJsxInput def={mockInput} />
      );
      
      expect(getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should handle different input types', () => {
      const mockInput = createMockInput('Password', 'password');
      
      const { container } = renderWithProviders(
        <StateJsxInput def={mockInput} />
      );
      
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render placeholder text', () => {
      const mockInput = createMockInput('Phone Number');
      
      const { getByPlaceholderText } = renderWithProviders(
        <StateJsxInput def={mockInput} />
      );
      
      expect(getByPlaceholderText('Enter phone number')).toBeInTheDocument();
    });

    it('should handle disabled state', () => {
      const mockInput = {
        ...createMockInput(),
        disabled: true,
      } as unknown as Record<string, unknown>;
      
      const { getByTestId } = renderWithProviders(
        <StateJsxInput def={mockInput} />
      );
      
      expect(getByTestId('input-field')).toBeDisabled();
    });

  });

});