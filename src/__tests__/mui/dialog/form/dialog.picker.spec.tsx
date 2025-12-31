import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DialogPicker from '../../../../mui/dialog/form/dialog.picker';
import type StateFormItem from '../../../../controllers/StateFormItem';
import type StateForm from '../../../../controllers/StateForm';

// Mock StateFormItem for picker testing
const createMockPicker = (label: string = 'Select Date', type: string = 'date'): StateFormItem<StateForm> => ({
  label,
  name: 'datePicker',
  _type: type,
  value: '2025-11-17',
  props: {
    'data-testid': 'dialog-picker',
  },
  inputProps: {
    placeholder: 'Select a date',
  },
  helperText: 'Choose your preferred date',
  error: false,
  disabled: false,
  variant: 'outlined',
  fullWidth: true,
  size: 'small',
  format: 'MM/DD/YYYY',
  minDate: undefined,
  maxDate: undefined,
} as unknown as StateFormItem<StateForm>);

describe('src/mui/dialog/form/dialog.picker.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render dialog picker correctly', () => {
    const mockPicker = createMockPicker('Birth Date', 'date');
    
    const { getByTestId } = renderWithProviders(
      <DialogPicker instance={mockPicker} hive={hive} />
    );
    
    expect(getByTestId('dialog-picker')).toBeInTheDocument();
  });

  it('should render with picker label', () => {
    const mockPicker = createMockPicker('Event Date');
    
    const { getByLabelText } = renderWithProviders(
      <DialogPicker instance={mockPicker} hive={hive} />
    );
    
    expect(getByLabelText('Event Date')).toBeInTheDocument();
  });

  it('should handle date value', () => {
    const mockPicker = createMockPicker('Appointment', 'datetime');
    
    const { container } = renderWithProviders(
      <DialogPicker instance={mockPicker} hive={hive} />
    );
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    const mockPicker = createMockPicker();
    
    const { container } = renderWithProviders(
      <DialogPicker instance={mockPicker} hive={hive} />
    );
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Select a date');
  });

  it('should handle disabled state', () => {
    const mockPicker = {
      ...createMockPicker(),
      disabled: true,
    } as unknown as StateFormItem<StateForm>;
    
    const { getByTestId } = renderWithProviders(
      <DialogPicker instance={mockPicker} hive={hive} />
    );
    
    expect(getByTestId('dialog-picker')).toBeDisabled();
  });

});