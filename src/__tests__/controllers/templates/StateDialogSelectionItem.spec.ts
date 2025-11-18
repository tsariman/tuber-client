import { describe, it, expect } from 'vitest';
import StateDialogSelection from '../../../controllers/templates/StateDialogSelection';
import StateDialogSelectionItem from '../../../controllers/templates/StateDialogSelectionItem';

describe('StateDialogSelectionItem', () => {
  describe('constructor', () => {
    it('should create a state dialog selection item object', () => {
      expect(new StateDialogSelectionItem(
        {},
        {} as StateDialogSelection
      )).toEqual({ _dialogSelectionItemState: {} });
    });
  });
});