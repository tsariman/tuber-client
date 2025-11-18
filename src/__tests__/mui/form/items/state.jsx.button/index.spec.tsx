import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../../test-utils';
import StateJsxButton from '../../../../../mui/form/items/state.jsx.button';
import type StateFormItem from '../../../../../controllers/StateFormItem';
import type StateForm from '../../../../../controllers/StateForm';

// Mock StateFormItem for testing
const createMockButton = (text: string = 'Test Button', type: string = 'button'): StateFormItem<StateForm> => ({
  text,
  _type: type,
  props: {
    type: type === 'submit' ? 'submit' : 'button',
    'data-testid': 'form-button',
  },
  has: {
    icon: undefined,
    faIcon: undefined,
  },
  clickReduxHandler: vi.fn(() => () => {}),
  parent: {
    name: 'testForm',
  },
} as unknown as StateFormItem<StateForm>);

describe('src/mui/form/items/state.jsx.button/index.tsx', () => {
  it('should render button correctly', () => {
    const mockButton = createMockButton('Click Me');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxButton def={mockButton} />
    );
    
    expect(getByTestId('form-button')).toBeInTheDocument();
    expect(getByText('Click Me')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    const mockButton = createMockButton('Submit', 'submit');
    
    const { getByTestId } = renderWithProviders(
      <StateJsxButton def={mockButton} />
    );
    
    const button = getByTestId('form-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render regular button', () => {
    const mockButton = createMockButton('Cancel', 'button');
    
    const { getByTestId } = renderWithProviders(
      <StateJsxButton def={mockButton} />
    );
    
    const button = getByTestId('form-button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should handle button without text', () => {
    const mockButton = createMockButton('');
    
    const { getByTestId } = renderWithProviders(
      <StateJsxButton def={mockButton} />
    );
    
    expect(getByTestId('form-button')).toBeInTheDocument();
  });

  it('should be clickable', () => {
    const mockButton = createMockButton('Click Me');
    
    const { getByTestId } = renderWithProviders(
      <StateJsxButton def={mockButton} />
    );
    
    const button = getByTestId('form-button');
    expect(button).toBeEnabled();
  });
});