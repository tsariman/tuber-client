import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import StateJsxTextfield from '../../../../mui/form/items/state.jsx.textfield';
import type StateFormItem from '../../../../controllers/StateFormItem';
import type StateForm from '../../../../controllers/StateForm';

// Mock StateFormItem for testing
const createMockTextfield = (label: string = 'Test Field', required: boolean = false): StateFormItem<StateForm> => ({
  label,
  name: 'testField',
  _type: 'textfield',
  required,
  value: '',
  props: {
    'data-testid': 'test-textfield',
  },
  inputProps: {},
  helperText: undefined,
  error: false,
  disabled: false,
  variant: 'outlined',
  fullWidth: true,
} as unknown as StateFormItem<StateForm>);

describe('src/mui/form/items/state.jsx.textfield.tsx', () => {

  describe('StateJsxTextfield', () => {

    it('should render textfield correctly', () => {
      const mockField = createMockTextfield('Name');
      
      const { getByTestId } = renderWithProviders(
        <StateJsxTextfield def={mockField} />
      );
      
      expect(getByTestId('test-textfield')).toBeInTheDocument();
    });

    it('should render with label', () => {
      const mockField = createMockTextfield('Email Address');
      
      const { getByLabelText } = renderWithProviders(
        <StateJsxTextfield def={mockField} />
      );
      
      expect(getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should handle required field', () => {
      const mockField = createMockTextfield('Required Field', true);
      
      const { getByTestId } = renderWithProviders(
        <StateJsxTextfield def={mockField} />
      );
      
      expect(getByTestId('test-textfield')).toBeRequired();
    });

    it('should render as input element', () => {
      const mockField = createMockTextfield();
      
      const { container } = renderWithProviders(
        <StateJsxTextfield def={mockField} />
      );
      
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('should handle disabled state', () => {
      const mockField = {
        ...createMockTextfield(),
        disabled: true,
      } as unknown as StateFormItem<StateForm>;
      
      const { getByTestId } = renderWithProviders(
        <StateJsxTextfield def={mockField} />
      );
      
      expect(getByTestId('test-textfield')).toBeDisabled();
    });

  });

});