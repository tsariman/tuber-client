import { describe, it, expect } from 'vitest';
import StateFormItemRadioButton from '../../controllers/StateFormItemRadioButton';
import StateFormItemRadioCustom from '../../controllers/templates/StateFormItemRadioCustom';

describe('StateFormItemRadioButton', () => {
  describe('constructor', () => {
    it('should create a state form item radio button object', () => {
      expect(new StateFormItemRadioButton(
        { name: 'radio'},
        {} as StateFormItemRadioCustom
      )).toEqual({ _formItemRadioButtonState: {} });
    });
  });
});
