import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxSelectionDialog from '../../../mui/dialog/state.jsx.selection.dialog';
import type StateDialogSelection from '../../../controllers/templates/StateDialogSelection';

// Mock StateDialogSelection for testing
const createMockSelectionDialog = (open: boolean = true, title: string = 'Select Option'): StateDialogSelection => ({
  open,
  title,
  options: [
    {
      text: 'Option 1',
      value: 'option1',
      props: { 'data-testid': 'option-1' },
    },
    {
      text: 'Option 2',
      value: 'option2',
      props: { 'data-testid': 'option-2' },
    },
  ],
  selectedValue: 'option1',
  props: {
    'data-testid': 'selection-dialog',
  },
  titleProps: {},
  listProps: {},
} as unknown as StateDialogSelection);

describe('src/mui/dialog/state.jsx.selection.dialog.tsx', () => {
  it('should render selection dialog when open', () => {
    const mockDialog = createMockSelectionDialog(true, 'Choose Item');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxSelectionDialog def={mockDialog} />
    );
    
    expect(getByTestId('selection-dialog')).toBeInTheDocument();
    expect(getByText('Choose Item')).toBeInTheDocument();
  });

  it('should render selection options', () => {
    const mockDialog = createMockSelectionDialog(true);
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxSelectionDialog def={mockDialog} />
    );
    
    expect(getByTestId('option-1')).toBeInTheDocument();
    expect(getByTestId('option-2')).toBeInTheDocument();
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });

  it('should handle selected option', () => {
    const mockDialog = createMockSelectionDialog(true);
    
    const { getByTestId } = renderWithProviders(
      <StateJsxSelectionDialog def={mockDialog} />
    );
    
    expect(getByTestId('option-1')).toBeInTheDocument();
  });

  it('should handle closed selection dialog', () => {
    const mockDialog = createMockSelectionDialog(false);
    
    const { container } = renderWithProviders(
      <StateJsxSelectionDialog def={mockDialog} />
    );
    
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });
});