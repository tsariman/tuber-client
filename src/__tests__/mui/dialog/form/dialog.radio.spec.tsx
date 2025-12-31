import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DialogRadio from '../../../../mui/dialog/form/dialog.radio';
import type StateFormItemRadio from '../../../../controllers/templates/StateFormItemRadio';

// Mock StateFormItemRadio for testing
const createMockRadio = (label: string = 'Select Option'): StateFormItemRadio => ({
  label,
  name: 'radioGroup',
  _type: 'radio',
  value: 'option1',
  options: [
    {
      label: 'Option 1',
      value: 'option1',
      props: { 'data-testid': 'radio-option-1' },
    },
    {
      label: 'Option 2',
      value: 'option2',
      props: { 'data-testid': 'radio-option-2' },
    },
    {
      label: 'Option 3',
      value: 'option3',
      props: { 'data-testid': 'radio-option-3' },
    },
  ],
  props: {
    'data-testid': 'dialog-radio',
  },
  helperText: 'Choose one option',
  error: false,
  disabled: false,
  row: false,
} as unknown as StateFormItemRadio);

describe('src/mui/dialog/form/dialog.radio.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render dialog radio group correctly', () => {
    const mockRadio = createMockRadio('Choose Priority');
    
    const { getByTestId } = renderWithProviders(
      <DialogRadio instance={mockRadio} hive={hive} />
    );
    
    expect(getByTestId('dialog-radio')).toBeInTheDocument();
  });

  it('should render multiple radio options', () => {
    const mockRadio = createMockRadio('Select Mode');
    
    const { getByTestId } = renderWithProviders(
      <DialogRadio instance={mockRadio} hive={hive} />
    );
    
    expect(getByTestId('radio-option-1')).toBeInTheDocument();
    expect(getByTestId('radio-option-2')).toBeInTheDocument();
    expect(getByTestId('radio-option-3')).toBeInTheDocument();
  });

  it('should handle selected value', () => {
    const mockRadio = createMockRadio();
    
    const { getByRole } = renderWithProviders(
      <DialogRadio instance={mockRadio} hive={hive} />
    );
    
    const radioGroup = getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
  });

  it('should render radio option labels', () => {
    const mockRadio = createMockRadio();
    
    const { getByText } = renderWithProviders(
      <DialogRadio instance={mockRadio} hive={hive} />
    );
    
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
    expect(getByText('Option 3')).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    const mockRadio = {
      ...createMockRadio(),
      disabled: true,
    } as unknown as StateFormItemRadio;
    
    const { getByRole } = renderWithProviders(
      <DialogRadio instance={mockRadio} hive={hive} />
    );
    
    const radioGroup = getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
  });

});