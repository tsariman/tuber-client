import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxCustomizedDialog from '../../../mui/dialog/state.jsx.customized.dialog';
import type StateDialogCustomized from '../../../controllers/templates/StateDialogCustomized';

// Mock StateDialogCustomized for testing
const createMockCustomizedDialog = (open: boolean = true, title: string = 'Custom Dialog'): StateDialogCustomized => ({
  open,
  title,
  content: 'Customized dialog content',
  maxWidth: 'md',
  fullWidth: true,
  props: {
    'data-testid': 'customized-dialog',
  },
  titleProps: {},
  contentProps: {},
  paperProps: {},
  actions: [],
} as unknown as StateDialogCustomized);

describe('src/mui/dialog/state.jsx.customized.dialog.tsx', () => {
  it('should render customized dialog when open', () => {
    const mockDialog = createMockCustomizedDialog(true, 'Settings');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxCustomizedDialog def={mockDialog} />
    );
    
    expect(getByTestId('customized-dialog')).toBeInTheDocument();
    expect(getByText('Settings')).toBeInTheDocument();
  });

  it('should render customized dialog content', () => {
    const mockDialog = createMockCustomizedDialog(true);
    
    const { getByText } = renderWithProviders(
      <StateJsxCustomizedDialog def={mockDialog} />
    );
    
    expect(getByText('Customized dialog content')).toBeInTheDocument();
  });

  it('should handle closed customized dialog', () => {
    const mockDialog = createMockCustomizedDialog(false);
    
    const { container } = renderWithProviders(
      <StateJsxCustomizedDialog def={mockDialog} />
    );
    
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  it('should render with full width', () => {
    const mockDialog = createMockCustomizedDialog(true);
    
    const { getByTestId } = renderWithProviders(
      <StateJsxCustomizedDialog def={mockDialog} />
    );
    
    expect(getByTestId('customized-dialog')).toBeInTheDocument();
  });
});