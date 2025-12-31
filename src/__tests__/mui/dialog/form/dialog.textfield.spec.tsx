import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DialogTextField from '../../../../mui/dialog/form/dialog.textfield';
import type StateFormItem from '../../../../controllers/StateFormItem';
import type StateForm from '../../../../controllers/StateForm';

// Mock StateFormItem for testing
const createMockTextField = (label: string = 'Dialog Field', required: boolean = false): StateFormItem<StateForm> => ({
  label,
  name: 'dialogTextField',
  _type: 'textfield',
  required,
  value: '',
  props: {
    'data-testid': 'dialog-textfield',
  },
  inputProps: {},
  helperText: undefined,
  error: false,
  disabled: false,
  variant: 'outlined',
  fullWidth: true,
  size: 'small', // Dialog optimized
} as unknown as StateFormItem<StateForm>);

describe('src/mui/dialog/form/dialog.textfield.tsx', () => {

  it('should render dialog textfield correctly', () => {
    const mockField = createMockTextField('Dialog Email');
    const hive = {} as Record<string, unknown>;
    
    const { getByTestId } = renderWithProviders(
      <DialogTextField instance={mockField} hive={hive} />
    );
    
    expect(getByTestId('dialog-textfield')).toBeInTheDocument();
  });

  it('should render with dialog-optimized label', () => {
    const mockField = createMockTextField('Full Name');
    const hive = {} as Record<string, unknown>;
    
    const { getByLabelText } = renderWithProviders(
      <DialogTextField instance={mockField} hive={hive} />
    );
    
    expect(getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('should handle required field in dialog', () => {
    const mockField = createMockTextField('Required Field', true);
    const hive = {} as Record<string, unknown>;
    
    const { getByTestId } = renderWithProviders(
      <DialogTextField instance={mockField} hive={hive} />
    );
    
    expect(getByTestId('dialog-textfield')).toBeRequired();
  });

  it('should render with dialog-optimized size', () => {
    const mockField = createMockTextField();
    const hive = {} as Record<string, unknown>;
    
    const { container } = renderWithProviders(
      <DialogTextField instance={mockField} hive={hive} />
    );
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should handle disabled state in dialog', () => {
    const mockField = {
      ...createMockTextField(),
      disabled: true,
    } as unknown as StateFormItem<StateForm>;
    const hive = {} as Record<string, unknown>;
    
    const { getByTestId } = renderWithProviders(
      <DialogTextField instance={mockField} hive={hive} />
    );
    
    expect(getByTestId('dialog-textfield')).toBeDisabled();
  });

});