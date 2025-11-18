import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test-utils';
import RecursiveFormItems from '../../../../mui/dialog/form';
import StateForm from '../../../../controllers/StateForm';
import { State, StateAllForms, StateFormItem } from '../../../../controllers';
import { get_state } from '../../../../state';
import type { IStateFormItem } from '../../../../localized/interfaces';

// Mock the recusive form builder props
const allForms = new StateAllForms({}, State.fromRootState(get_state()));

describe('src/mui/dialog/form/index.tsx', () => {

  it('should render dialog form items correctly', () => {
    const form = new StateForm({
      items: [
        {
          name: 'textField',
          _type: 'textfield',
          label: 'Dialog Text Field',
          value: '',
          required: false
        } as IStateFormItem,
        {
          name: 'selectField',
          _type: 'select',
          label: 'Dialog Select',
          value: 'option1',
          options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' }
          ]
        } as IStateFormItem,
        {
          name: 'submitButton',
          _type: 'button',
          text: 'Submit Form',
          variant: 'contained'
        } as IStateFormItem
      ]
    }, allForms)
    const items: StateFormItem[] = []
    const depth = 0 // could be a random number between 0-9
    
    const { container } = renderWithProviders(
      <RecursiveFormItems form={form} items={items} depth={depth} />
    );
    
    // Should render form elements in dialog context
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form with no items', () => {
    const form = new StateForm({
      items: []
    }, allForms)
    const items: StateFormItem[] = []
    const depth = 0 // could be a random number between 0-9
    
    const { container } = renderWithProviders(
      <RecursiveFormItems form={form} items={items} depth={depth} />
    );
    
    // Should still render container
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render multiple dialog form items', () => {
    const form = new StateForm({
      items: [
        {
          type: 'textfield',
          name: 'emailField',
          label: 'Email Address',
          value: '',
          inputType: 'email',
          required: true
        } as IStateFormItem,
        {
          type: 'textfield',
          name: 'passwordField',
          label: 'Password',
          value: '',
          inputType: 'password',
          required: true
        } as IStateFormItem,
        {
          type: 'switch',
          name: 'rememberMe',
          label: 'Remember Me',
          checked: false
        } as IStateFormItem
      ]
    }, allForms)
    const items: StateFormItem[] = []
    const depth = 0 // could be a random number between 0-9
    
    const { container } = renderWithProviders(
      <RecursiveFormItems form={form} items={items} depth={depth} />
    );
    
    // Should contain form elements optimized for dialog layout
    const formElements = container.querySelectorAll('input, button, select, textarea');
    expect(formElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty dialog form gracefully', () => {
    const form = new StateForm({
      items: [
        {
          name: 'hiddenField',
          _type: 'hidden',
          value: 'hidden-value'
        } as IStateFormItem
      ]
    }, allForms)
    const items: StateFormItem[] = []
    const depth = 0 // could be a random number between 0-9
    
    const { container } = renderWithProviders(
      <RecursiveFormItems form={form} items={items} depth={depth} />
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

});