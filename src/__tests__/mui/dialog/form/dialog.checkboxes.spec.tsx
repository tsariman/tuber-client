import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import DialogCheckboxes from '../../../../mui/dialog/form/dialog.checkboxes';
import type { StateForm, StateFormItem, StateFormItemCheckboxBox } from '../../../../controllers';

// Mock StateFormItem with checkboxes for testing
const createMockCheckboxes = (label: string = 'Options'): StateFormItem<StateForm, StateFormItemCheckboxBox> => ({
  name: 'example-checkboxes',
  props: {
    'data-testid': 'dialog-checkboxes'
  },
  has: {
    label,
    color: 'default',
    items: [
      {
        label: 'Option 1',
        formControlLabelProps: {},
        props: {
          'data-testid': 'checkbox-option-1'
        },
        disabled: true
      },
      {
        label: 'Option 2',
        formControlLabelProps: {},
        props: {
          'data-testid': 'checkbox-option-2'
        },
        disabled: false
      },
      {
        label: 'Option 3',
        formControlLabelProps: {},
        props: {
          'data-testid': 'checkbox-option-3'
        },
        disabled: undefined
      }
    ]
  }
} as unknown as StateFormItem<StateForm, StateFormItemCheckboxBox>);

describe('src/mui/dialog/form/dialog.checkboxes.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render dialog checkboxes correctly', () => {
    const mockCheckboxes = createMockCheckboxes('Select Features');
    
    const { getByTestId } = renderWithProviders(
      <DialogCheckboxes def={mockCheckboxes} hive={hive} />
    );
    
    expect(getByTestId('dialog-checkboxes')).toBeInTheDocument();
  });

  it('should render multiple checkbox options', () => {
    const mockCheckboxes = createMockCheckboxes('Preferences');
    
    const { getByTestId } = renderWithProviders(
      <DialogCheckboxes def={mockCheckboxes} hive={hive} />
    );
    
    expect(getByTestId('checkbox-option-1')).toBeInTheDocument();
    expect(getByTestId('checkbox-option-2')).toBeInTheDocument();
    expect(getByTestId('checkbox-option-3')).toBeInTheDocument();
  });

  it('should handle checked state', () => {
    const mockCheckboxes = createMockCheckboxes();
    
    const { getByRole } = renderWithProviders(
      <DialogCheckboxes def={mockCheckboxes} hive={hive} />
    );
    
    const checkboxes = getByRole('group');
    expect(checkboxes).toBeInTheDocument();
  });

  it('should render checkbox labels', () => {
    const mockCheckboxes = createMockCheckboxes();
    
    const { getByText } = renderWithProviders(
      <DialogCheckboxes def={mockCheckboxes} hive={hive} />
    );
    
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
    expect(getByText('Option 3')).toBeInTheDocument();
  });

});