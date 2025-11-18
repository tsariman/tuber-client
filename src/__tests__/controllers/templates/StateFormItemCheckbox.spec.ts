import { describe, it, expect } from 'vitest';
import StateForm from '../../../controllers/StateForm';
import StateFormItemCheckbox from '../../../controllers/templates/StateFormItemCheckbox';

describe('StateFormItemCheckbox', () => {
  describe('constructor', () => {
    it('should create a state form item checkbox object', () => {
      expect(new StateFormItemCheckbox(
        { type: 'checkboxes' },
        {} as StateForm,
      )).toEqual({ _formItemCheckboxState: {} });
    });
  });
});