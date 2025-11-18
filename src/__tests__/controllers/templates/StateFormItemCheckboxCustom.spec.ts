import { describe, it, expect } from 'vitest';
import StateFormItemCheckbox from '../../../controllers/templates/StateFormItemCheckbox';
import StateFormItemCheckboxCustom from '../../../controllers/templates/StateFormItemCheckboxCustom';

describe('StateFormItemCheckboxCustom', () => {
  describe('constructor', () => {
    it('should create a state form item checkbox custom object', () => {
      expect(new StateFormItemCheckboxCustom(
        { },
        {} as StateFormItemCheckbox
      )).toEqual({ _checkboxCustomState: {} });
    });
  });
});