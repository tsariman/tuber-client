import { describe, it, expect } from 'vitest';
import StateForm from '../../../controllers/StateForm';
import StateFormItemRadio from '../../../controllers/templates/StateFormItemRadio';

describe('StateFormItemRadio', () => {
  describe('constructor', () => {
    it('should create a state form item radio object', () => {
      expect(new StateFormItemRadio(
        { type: 'radio_buttons'},
        {} as StateForm
      )).toEqual({ _formItemRadioState: {} });
    });
  });
});