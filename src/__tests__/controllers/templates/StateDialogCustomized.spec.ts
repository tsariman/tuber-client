import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateDialogCustomized from '../../../controllers/templates/StateDialogCustomized';

describe('StateDialogCustomized', () => {
  describe('constructor', () => {
    it('should create a state dialog customized object', () => {
      expect(new StateDialogCustomized(
        {},
        {} as State
      )).toEqual({ _dialogCustomizedState: {} });
    });
  });
});