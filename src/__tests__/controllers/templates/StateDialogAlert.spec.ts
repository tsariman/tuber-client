import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateDialogAlert from '../../../controllers/templates/StateDialogAlert';

describe('StateDialogAlert', () => {
  describe('constructor', () => {
    it('should create a state dialog alert object', () => {
      expect(new StateDialogAlert(
        {},
        {} as State
      )).toEqual({ _dialogAlertState: {} });
    });
  });
});