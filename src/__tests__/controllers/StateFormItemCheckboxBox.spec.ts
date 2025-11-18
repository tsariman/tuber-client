import { describe, it, expect } from 'vitest';
import StateFormItemCheckboxBox from '../../controllers/StateFormItemCheckboxBox';
import StateFormItemCheckboxCustom from '../../controllers/templates/StateFormItemCheckboxCustom';

describe('StateFormItemCheckboxBox', () => {
  describe('constructor', () => {
    it('should create a state form item checkbox box object', () => {
      expect(new StateFormItemCheckboxBox({
        name: 'checkbox'
      }, {} as StateFormItemCheckboxCustom)).toEqual({ _formItemCheckboxBoxState: {} });
    });
  });
});
