import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DialogSwitch from '../../../../mui/dialog/form/dialog.switch';
import type StateFormItemSwitch from '../../../../controllers/templates/StateFormItemSwitch';

// Mock StateFormItemSwitch for testing
const createMockSwitch = (label: string = 'Dialog Switch', checked: boolean = false): StateFormItemSwitch => ({
  label,
  name: 'dialogSwitch',
  _type: 'switch',
  checked,
  value: checked,
  props: {
    'data-testid': 'dialog-switch',
  },
  disabled: false,
  required: false,
  color: 'primary',
  size: 'small', // Dialog optimized
} as unknown as StateFormItemSwitch);

describe('src/mui/dialog/form/dialog.switch.tsx', () => {

  it('should render dialog switch correctly', () => {
    const mockSwitch = createMockSwitch('Enable Feature');
    const hive = {} as Record<string, unknown>;
    
    const { getByTestId } = renderWithProviders(
      <DialogSwitch def={mockSwitch} hive={hive} />
    );
    
    expect(getByTestId('dialog-switch')).toBeInTheDocument();
  });

  it('should render with dialog-optimized label', () => {
    const mockSwitch = createMockSwitch('Dark Mode');
    const hive = {} as Record<string, unknown>;
    
    const { getByText } = renderWithProviders(
      <DialogSwitch def={mockSwitch} hive={hive} />
    );
    
    expect(getByText('Dark Mode')).toBeInTheDocument();
  });

  it('should handle checked state in dialog', () => {
    const mockSwitch = createMockSwitch('Enabled Option', true);
    const hive = {} as Record<string, unknown>;
    
    const { getByRole } = renderWithProviders(
      <DialogSwitch def={mockSwitch} hive={hive} />
    );
    
    const switchElement = getByRole('checkbox');
    expect(switchElement).toBeChecked();
  });

  it('should handle unchecked state in dialog', () => {
    const mockSwitch = createMockSwitch('Disabled Option', false);
    const hive = {} as Record<string, unknown>;
    
    const { getByRole } = renderWithProviders(
      <DialogSwitch def={mockSwitch} hive={hive} />
    );
    
    const switchElement = getByRole('checkbox');
    expect(switchElement).not.toBeChecked();
  });

  it('should handle disabled state in dialog', () => {
    const mockSwitch = {
      ...createMockSwitch(),
      disabled: true,
    } as unknown as StateFormItemSwitch;
    const hive = {} as Record<string, unknown>;
    
    const { getByRole } = renderWithProviders(
      <DialogSwitch def={mockSwitch} hive={hive} />
    );
    
    const switchElement = getByRole('checkbox');
    expect(switchElement).toBeDisabled();
  });

});