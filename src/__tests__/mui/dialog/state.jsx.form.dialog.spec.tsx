import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import StateJsxDialogForm from '../../../mui/dialog/state.jsx.form.dialog';
import type StateDialogForm from '../../../controllers/templates/StateDialogForm';

// Mock StateDialogForm for testing
const createMockFormDialog = (open: boolean = true, title: string = 'Form Dialog'): StateDialogForm => ({
  open,
  title,
  form: {
    name: 'dialogForm',
    items: [
      {
        _type: 'textfield',
        name: 'username',
        label: 'Username',
        props: { 'data-testid': 'username-field' },
      },
      {
        _type: 'button',
        text: 'Submit',
        props: { 'data-testid': 'submit-button' },
      },
    ],
  },
  actions: [
    {
      text: 'Cancel',
      props: { 'data-testid': 'cancel-button' },
      _type: 'button',
    },
  ],
  props: {
    'data-testid': 'form-dialog',
  },
  titleProps: {},
  contentProps: {},
  actionsProps: {},
} as unknown as StateDialogForm);

describe('src/mui/dialog/state.jsx.form.dialog.tsx', () => {
  it('should render form dialog when open', () => {
    const mockDialog = createMockFormDialog(true, 'User Registration');
    
    const { getByTestId, getByText } = renderWithProviders(
      <StateJsxDialogForm def={mockDialog} />
    );
    
    expect(getByTestId('form-dialog')).toBeInTheDocument();
    expect(getByText('User Registration')).toBeInTheDocument();
  });

  it('should render form elements', () => {
    const mockDialog = createMockFormDialog(true);
    
    const { getByTestId } = renderWithProviders(
      <StateJsxDialogForm def={mockDialog} />
    );
    
    expect(getByTestId('username-field')).toBeInTheDocument();
    expect(getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should render dialog actions', () => {
    const mockDialog = createMockFormDialog(true);
    
    const { getByTestId } = renderWithProviders(
      <StateJsxDialogForm def={mockDialog} />
    );
    
    expect(getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('should handle closed form dialog', () => {
    const mockDialog = createMockFormDialog(false);
    
    const { container } = renderWithProviders(
      <StateJsxDialogForm def={mockDialog} />
    );
    
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  it('should render form with multiple fields', () => {
    const mockDialog = createMockFormDialog(true);
    
    const { container } = renderWithProviders(
      <StateJsxDialogForm def={mockDialog} />
    );
    
    const inputs = container.querySelectorAll('input, button');
    expect(inputs.length).toBeGreaterThan(0);
  });
});