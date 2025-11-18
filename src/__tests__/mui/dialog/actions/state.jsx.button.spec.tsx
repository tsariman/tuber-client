import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import StateJsxDialogActionButton from '../../../../mui/dialog/actions/state.jsx.button';
import type { StateFormItem, StateDialog } from '../../../../controllers';

// Mock StateFormItem for testing
const createMockButton = (text: string = 'Test Button', hasIcon: boolean = false, iconPosition: 'left' | 'right' = 'left'): StateFormItem<StateDialog> => ({
  text,
  value: text,
  has: {
    icon: hasIcon ? 'check' : undefined,
    faIcon: undefined,
    iconPosition,
  },
  props: {
    'data-testid': 'dialog-button',
    href: '/test',
  },
  clickReduxHandler: vi.fn(() => () => {}),
} as unknown as StateFormItem<StateDialog>);

describe('src/mui/dialog/actions/state.jsx.button.tsx', () => {

  it('should render button with text correctly', () => {
    const mockButton = createMockButton('Click Me');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxDialogActionButton def={mockButton} />
    );
    
    expect(getByTestId('dialog-button')).toBeInTheDocument();
    expect(getByText('Click Me')).toBeInTheDocument();
  });

  it('should render button with icon on left', () => {
    const mockButton = createMockButton('Button with Icon', true, 'left');
    
    const { getByText, container } = renderWithProviders(
      <StateJsxDialogActionButton def={mockButton} />
    );
    
    expect(getByText('Button with Icon')).toBeInTheDocument();
    const icon = container.querySelector('.MuiIcon-root');
    expect(icon).toBeInTheDocument();
  });

  it('should render button with icon on right', () => {
    const mockButton = createMockButton('Right Icon', true, 'right');
    
    const { getByText, container } = renderWithProviders(
      <StateJsxDialogActionButton def={mockButton} />
    );
    
    expect(getByText('Right Icon')).toBeInTheDocument();
    const icon = container.querySelector('.MuiIcon-root');
    expect(icon).toBeInTheDocument();
  });

  it('should render button without text showing fallback', () => {
    const mockButton = createMockButton('', false);
    
    const { getByText } = renderWithProviders(
      <StateJsxDialogActionButton def={mockButton} />
    );
    
    expect(getByText('No Text!')).toBeInTheDocument();
  });

  it('should handle icon-only button', () => {
    const mockButtonIconOnly = {
      ...createMockButton('', true),
      text: undefined,
    } as unknown as StateFormItem<StateDialog>;
    
    const { container } = renderWithProviders(
      <StateJsxDialogActionButton def={mockButtonIconOnly} />
    );
    
    const icon = container.querySelector('.MuiIcon-root');
    expect(icon).toBeInTheDocument();
  });

});