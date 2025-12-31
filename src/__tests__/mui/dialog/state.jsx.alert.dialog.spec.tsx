import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxAlertDialog from '../../../mui/dialog/state.jsx.alert.dialog';
import type StateDialogAlert from '../../../controllers/templates/StateDialogAlert';

// Mock StateDialogAlert for testing
const createMockAlertDialog = (open: boolean = true, title: string = 'Alert'): StateDialogAlert => ({
  open,
  title,
  content: 'This is an alert message',
  contentText: 'Alert content text',
  actions: [
    {
      text: 'OK',
      props: { 'data-testid': 'alert-ok-button' },
      _type: 'button',
    },
  ],
  props: {
    'data-testid': 'alert-dialog',
  },
  titleProps: {},
  contentProps: {},
  actionsProps: {},
} as unknown as StateDialogAlert);

describe('src/mui/dialog/state.jsx.alert.dialog.tsx', () => {
  it('should render alert dialog when open', () => {
    const mockDialog = createMockAlertDialog(true, 'Warning');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxAlertDialog instance={mockDialog} />
    );
    
    expect(getByTestId('alert-dialog')).toBeInTheDocument();
    expect(getByText('Warning')).toBeInTheDocument();
    expect(getByText('This is an alert message')).toBeInTheDocument();
  });

  it('should render alert dialog actions', () => {
    const mockDialog = createMockAlertDialog(true);
    
    const { getByTestId } = renderWithProviders(
      <StateJsxAlertDialog instance={mockDialog} />
    );
    
    expect(getByTestId('alert-ok-button')).toBeInTheDocument();
  });

  it('should handle closed alert dialog', () => {
    const mockDialog = createMockAlertDialog(false);
    
    const { container } = renderWithProviders(
      <StateJsxAlertDialog instance={mockDialog} />
    );
    
    // Dialog should still be in DOM but not visible
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  it('should render content text correctly', () => {
    const mockDialog = createMockAlertDialog(true);
    
    const { getByText } = renderWithProviders(
      <StateJsxAlertDialog instance={mockDialog} />
    );
    
    expect(getByText('Alert content text')).toBeInTheDocument();
  });
});