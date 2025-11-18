import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DialogPhoneInput from '../../../../mui/dialog/form/dialog.phone.input';
import type StateFormItemInput from '../../../../controllers/templates/StateFormItemInput';

// Mock StateFormItemInput for testing
const createMockPhoneInput = (label: string = 'Phone Number', value: string = ''): StateFormItemInput => ({
  label,
  name: 'phoneInput',
  _type: 'phone',
  value,
  props: {
    'data-testid': 'dialog-phone-input',
  },
  inputProps: {
    placeholder: '+1 (555) 123-4567',
  },
  helperText: 'Enter your phone number',
  error: false,
  disabled: false,
  variant: 'outlined',
  fullWidth: true,
  size: 'small',
  country: 'US',
} as unknown as StateFormItemInput);

describe('src/mui/dialog/form/dialog.phone.input.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render dialog phone input correctly', () => {
    const mockInput = createMockPhoneInput('Mobile Phone');
    
    const { getByTestId } = renderWithProviders(
      <DialogPhoneInput def={mockInput} hive={hive} />
    );
    
    expect(getByTestId('dialog-phone-input')).toBeInTheDocument();
  });

  it('should render with phone-specific label', () => {
    const mockInput = createMockPhoneInput('Contact Number');
    
    const { getByLabelText } = renderWithProviders(
      <DialogPhoneInput def={mockInput} hive={hive} />
    );
    
    expect(getByLabelText('Contact Number')).toBeInTheDocument();
  });

  it('should handle phone number value', () => {
    const mockInput = createMockPhoneInput('Phone', '+1234567890');
    
    const { container } = renderWithProviders(
      <DialogPhoneInput def={mockInput} hive={hive} />
    );
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    const mockInput = createMockPhoneInput();
    
    const { container } = renderWithProviders(
      <DialogPhoneInput def={mockInput} hive={hive} />
    );
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', '+1 (555) 123-4567');
  });

  it('should handle disabled state', () => {
    const mockInput = {
      ...createMockPhoneInput(),
      disabled: true,
    } as unknown as StateFormItemInput;
    
    const { getByTestId } = renderWithProviders(
      <DialogPhoneInput def={mockInput} hive={hive} />
    );
    
    expect(getByTestId('dialog-phone-input')).toBeDisabled();
  });

});