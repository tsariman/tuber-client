import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import StateJsxInput from '../../../../mui/form/items/state.jsx.input';
import { StateFactory, StateForm } from '../../../../controllers';
import stateMocks from './__mocks__/state.jsx.input.spec';

const allForms = StateFactory.createStateAllForms()
const form = new StateForm({
  'items': [
    stateMocks.state1,
    stateMocks.state2,
    stateMocks.state3,
    stateMocks.state4,
    stateMocks.state5,
    stateMocks.state6,
    stateMocks.state7,
    stateMocks.state8,
    stateMocks.state9
  ]
}, allForms)

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
        <StateJsxInput instance={form.items[0]} />
      );
      
      expect(getByTestId('input-field')).toBeInTheDocument();
    });

    it('should render with label', () => {
      const mockInput = createMockInput('Email Address');
      
      const { getByLabelText } = renderWithProviders(
        <StateJsxInput instance={form.items[1]} />
      );
      
      expect(getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should handle different input types', () => {
      const mockInput = createMockInput('Password', 'password');
      
      const { container } = renderWithProviders(
        <StateJsxInput instance={form.items[2]} />
      );
      
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render placeholder text', () => {
      const mockInput = createMockInput('Phone Number');
      
      const { getByPlaceholderText } = renderWithProviders(
        <StateJsxInput instance={form.items[3]} />
      );
      
      expect(getByPlaceholderText('Enter phone number')).toBeInTheDocument();
    });

    it('should handle disabled state', () => {
      const mockInput = {
        ...createMockInput(),
        disabled: true,
      } as unknown as Record<string, unknown>;
      
      const { getByTestId } = renderWithProviders(
        <StateJsxInput instance={form.items[4]} />
      );
      
      expect(getByTestId('input-field')).toBeDisabled();
    });

  });

});