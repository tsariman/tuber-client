import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import StateJsxDialogAction from '../../../../mui/dialog/actions/state.jsx.form.button';
import type StateFormItem from '../../../../controllers/StateFormItem';
import type StateForm from '../../../../controllers/StateForm';

// Mock StateFormItem for testing
const createMockFormButton = (text: string = 'Form Button'): StateFormItem<StateForm> => ({
  text,
  props: {
    type: 'submit',
    'data-testid': 'form-button',
  },
  has: {
    icon: undefined,
    faIcon: undefined,
    iconPosition: 'left',
  },
  clickReduxHandler: vi.fn(() => () => {}),
} as unknown as StateFormItem<StateForm>);

describe('src/mui/dialog/actions/state.jsx.form.button.tsx', () => {
  it('should render form button correctly', () => {
    const mockButton = createMockFormButton('Submit Form');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    );
    
    expect(getByTestId('form-button')).toBeInTheDocument();
    expect(getByText('Submit Form')).toBeInTheDocument();
  });

  it('should handle button props correctly', () => {
    const mockButton = createMockFormButton('Save');
    
    const { getByTestId } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    );
    
    const button = getByTestId('form-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render without text', () => {
    const mockButton = createMockFormButton('');
    
    const { container } = renderWithProviders(
      <StateJsxDialogAction instance={mockButton} />
    );
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });
});