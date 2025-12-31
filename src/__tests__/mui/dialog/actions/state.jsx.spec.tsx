import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import StateJsxDialogAction from '../../../../mui/dialog/actions/state.jsx';
import type StateDialog from '../../../../controllers/StateDialog';
import type { IStateFormItem } from '../../../../interfaces/localized';

// Mock form items and dialog for testing
const createMockFormItems = (hasButtons: boolean = true): IStateFormItem[] => {
  if (!hasButtons) return [];
  
  return [
    {
      type: 'state_button',
      label: 'Cancel',
      props: { 'data-testid': 'cancel-button' },
    },
    {
      type: 'state_button', 
      label: 'OK',
      props: { 'data-testid': 'ok-button' },
    },
  ];
};

const createMockDialog = (): StateDialog => ({
  _type: 'alert',
  title: 'Test Dialog',
} as unknown as StateDialog);

describe('src/mui/dialog/actions/state.jsx', () => {
  it('should render dialog actions correctly', () => {
    const mockFormItems = createMockFormItems(true);
    const mockDialog = createMockDialog();
    
    const { container } = renderWithProviders(
      <StateJsxDialogAction array={mockFormItems} parent={mockDialog} />
    );
    
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should render empty when no actions', () => {
    const mockFormItems = createMockFormItems(false);
    const mockDialog = createMockDialog();
    
    const { container } = renderWithProviders(
      <StateJsxDialogAction array={mockFormItems} parent={mockDialog} />
    );
    
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(0);
  });

  it('should filter non-button items', () => {
    const mockFormItems: IStateFormItem[] = [
      {
        type: 'textfield',
        has: {
          defaultValue: 'Not a button'
        }
      },
      {
        type: 'state_button',
        has: {
          text: 'I am a button'
        },
        props: { 'data-testid': 'actual-button' },
      },
    ];
    const mockDialog = createMockDialog();
    
    const { container } = renderWithProviders(
      <StateJsxDialogAction array={mockFormItems} parent={mockDialog} />
    );
    
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
  });

  it('should handle empty form items array', () => {
    const mockDialog = createMockDialog();
    
    const { container } = renderWithProviders(
      <StateJsxDialogAction array={[]} parent={mockDialog} />
    );
    
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});