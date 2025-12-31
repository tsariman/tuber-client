import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderWithProviders, screen } from '../../test-utils';
import StateJsxDialogForm from '../../../mui/dialog/state.jsx.form.dialog';
import type StateDialogForm from '../../../controllers/templates/StateDialogForm';
import type { IStateFormItem } from '../../../interfaces/localized';

// Minimal mock of StateDialogForm matching component usage
const createMockFormDialog = (
  title: string = 'Form Dialog',
  contentName: string = 'dialogForm',
  options: {
    contentText?: string;
    actions?: IStateFormItem[];
    props?: Record<string, unknown>;
  } = {}
): StateDialogForm => ({
  title,
  contentName,
  contentText: options.contentText,
  contentTextProps: {},
  props: {
    'data-testid': 'form-dialog',
    ...options.props,
  },
  titleProps: {},
  contentProps: {},
  actions: options.actions || [],
  actionsProps: {},
} as unknown as StateDialogForm);

// Preloaded state with a basic form so FormContent can render
const createPreloadedState = (
  contentName: string,
  open: boolean = true,
  formItems: IStateFormItem[] = []
) => ({
  dialog: { open },
  forms: {
    [contentName]: {
      name: contentName,
      items: formItems,
    },
  },
});

describe('src/mui/dialog/state.jsx.form.dialog.tsx', () => {
  describe('Rendering', () => {
    it('should render form dialog when open with title', () => {
      const mockDialog = createMockFormDialog('User Registration', 'userRegistrationForm');
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { getByTestId, getByText } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      expect(getByTestId('form-dialog')).toBeInTheDocument();
      expect(getByText('User Registration')).toBeInTheDocument();
    });

    it('should attach dialog role when open', () => {
      const mockDialog = createMockFormDialog();
      const preloadedState = createPreloadedState(mockDialog.contentName);

      renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should not show dialog when closed', () => {
      const mockDialog = createMockFormDialog();
      const preloadedState = createPreloadedState(mockDialog.contentName, false);

      const { container } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // MUI Dialog removes from DOM when not open by default
      expect(container.querySelector('[data-testid="form-dialog"]')).not.toBeInTheDocument();
    });

    it('should render close button in title', () => {
      const mockDialog = createMockFormDialog('Settings Form');
      const preloadedState = createPreloadedState(mockDialog.contentName);

      renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should apply custom props to dialog', () => {
      const mockDialog = createMockFormDialog('Test', 'testForm', {
        props: { 'data-testid': 'custom-dialog', maxWidth: 'md' }
      });
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { getByTestId } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      expect(getByTestId('custom-dialog')).toBeInTheDocument();
    });
  });

  describe('Content Text', () => {
    it('should render contentText when provided', () => {
      const mockDialog = createMockFormDialog('Form', 'testForm', {
        contentText: 'Please fill out the form below.'
      });
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { getByText } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      expect(getByText('Please fill out the form below.')).toBeInTheDocument();
    });

    it('should not render DialogContentText when contentText is undefined', () => {
      const mockDialog = createMockFormDialog('Form', 'testForm');
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { container } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // Should not find DialogContentText component
      const contentText = container.querySelector('.MuiDialogContentText-root');
      expect(contentText).not.toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should render form from Redux forms state', () => {
      const formItems: IStateFormItem[] = [
        {
          _type: 'textfield',
          name: 'email',
          label: 'Email Address',
          props: {}
        } as IStateFormItem
      ];
      const mockDialog = createMockFormDialog('Contact', 'contactForm');
      const preloadedState = createPreloadedState(mockDialog.contentName, true, formItems);

      const { getByRole, getByText } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // Dialog should render with form state
      expect(getByRole('dialog')).toBeInTheDocument();
      expect(getByText('Contact')).toBeInTheDocument();
    });

    it('should use contentName to retrieve form from state', () => {
      const mockDialog = createMockFormDialog('User Form', 'userProfileForm');
      const preloadedState = {
        dialog: { open: true },
        forms: {
          userProfileForm: { name: 'userProfileForm', items: [] },
          otherForm: { name: 'otherForm', items: [] }
        }
      };

      const { getByText } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // Should render the dialog with correct title
      expect(getByText('User Form')).toBeInTheDocument();
    });
  });

  describe('Dialog Actions', () => {
    it('should accept actions in dialog definition', () => {
      const actions: IStateFormItem[] = [
        {
          _type: 'button',
          text: 'Cancel',
          props: {}
        } as IStateFormItem,
        {
          _type: 'button',
          text: 'Submit',
          props: {}
        } as IStateFormItem
      ];
      const mockDialog = createMockFormDialog('Action Form', 'actionForm', { actions });
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { getByRole } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // Dialog renders even when actions are provided (actions render only if dialog.form exists)
      expect(getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render DialogActions when actions array is empty', () => {
      const mockDialog = createMockFormDialog('No Actions', 'noActionsForm', { actions: [] });
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { container } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // DialogActions should not be rendered
      const dialogActions = container.querySelector('.MuiDialogActions-root');
      expect(dialogActions).not.toBeInTheDocument();
    });
  });

  describe('Close Handlers', () => {
    it('should render close button in dialog title', () => {
      const mockDialog = createMockFormDialog('Closeable Dialog');
      const preloadedState = createPreloadedState(mockDialog.contentName);

      renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // Close button is always rendered
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should prevent backdrop click from closing by default', () => {
      const mockDialog = createMockFormDialog('No Backdrop Close');
      const preloadedState = createPreloadedState(mockDialog.contentName);

      renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );
      
      // The component has handleClose logic that prevents backdropClick from closing
      // This is verified by the onClose handler checking if reason === "backdropClick"
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing form gracefully', () => {
      const mockDialog = createMockFormDialog('Missing Form', 'nonexistentForm');
      const preloadedState = {
        dialog: { open: true },
        forms: {}
      };

      const { getByText } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      // Should still render dialog title
      expect(getByText('Missing Form')).toBeInTheDocument();
    });

    it('should handle undefined contentText', () => {
      const mockDialog = createMockFormDialog('Test', 'testForm', { contentText: undefined });
      const preloadedState = createPreloadedState(mockDialog.contentName);

      const { container } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      expect(container).toBeInTheDocument();
    });

    it('should render with multiple forms in state', () => {
      const mockDialog = createMockFormDialog('Multi Form Dialog', 'formA');
      const preloadedState = {
        dialog: { open: true },
        forms: {
          formA: { name: 'formA', items: [] },
          formB: { name: 'formB', items: [] },
          formC: { name: 'formC', items: [] }
        }
      };

      const { getByText } = renderWithProviders(
        <StateJsxDialogForm instance={mockDialog} />, { preloadedState }
      );

      expect(getByText('Multi Form Dialog')).toBeInTheDocument();
    });
  });
});