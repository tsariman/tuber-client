import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateDialogForm from '../../../controllers/templates/StateDialogForm';

describe('StateDialogForm', () => {
  describe('constructor', () => {
    it('should create a state dialog form object', () => {
      expect(new StateDialogForm(
        {},
        {} as State
      )).toEqual({ _dialogFormState: {} });
    });
  });
});