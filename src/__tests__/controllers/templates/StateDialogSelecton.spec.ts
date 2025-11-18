import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateDialogSelection from '../../../controllers/templates/StateDialogSelection';

describe('StateDialogSelection', () => {
  describe('constructor', () => {
    it('should create a state dialog selection object', () => {
      expect(new StateDialogSelection(
        {},
        {} as State
      )).toEqual({ _dialogSelectionState: {} })
    });
  });
});