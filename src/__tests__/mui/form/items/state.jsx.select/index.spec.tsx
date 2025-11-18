import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../../test-utils';
import DialogSelect from '../../../../../mui/form/items/state.jsx.select';
import type { StateForm, StateFormItem } from '../../../../../controllers';
import type { IStateFormItemSelectOption } from '@tuber/shared';

// Mock StateFormItem for select testing
const createMockSelect = (label: string = 'Select Option') => ({
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
} as unknown as StateFormItem<StateForm, IStateFormItemSelectOption>);

describe('src/mui/form/items/state.jsx.select/index.tsx', () => {
  it('should render select field correctly', () => {
    const mockSelect = createMockSelect('Choose Category');
    
    const { getByTestId } = renderWithProviders(
      <DialogSelect def={mockSelect} />
    );
    
    expect(getByTestId('select-field')).toBeInTheDocument();
  });

  it('should render with select label', () => {
    const mockSelect = createMockSelect('Priority Level');
    
    const { getByLabelText } = renderWithProviders(
      <DialogSelect def={mockSelect} />
    );
    
    expect(getByLabelText('Priority Level')).toBeInTheDocument();
  });

  it('should handle selected value', () => {
    const mockSelect = createMockSelect();
    
    const { container } = renderWithProviders(
      <DialogSelect def={mockSelect} />
    );
    
    const select = container.querySelector('select, input[role="button"]');
    expect(select).toBeInTheDocument();
  });

  it('should render helper text', () => {
    const mockSelect = createMockSelect();
    
    const { getByText } = renderWithProviders(
      <DialogSelect def={mockSelect} />
    );
    
    expect(getByText('Choose an option')).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    const mockSelect = {
      ...createMockSelect(),
      disabled: true,
    } as unknown as StateFormItem<StateForm, IStateFormItemSelectOption>;
    
    const { getByTestId } = renderWithProviders(
      <DialogSelect def={mockSelect} />
    );
    
    expect(getByTestId('select-field')).toBeDisabled();
  });
});