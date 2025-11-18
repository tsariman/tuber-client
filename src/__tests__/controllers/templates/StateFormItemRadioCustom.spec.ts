import { describe, it, expect } from 'vitest';
import StateFormItemRadio from '../../../controllers/templates/StateFormItemRadio';
import StateFormItemRadioCustom from '../../../controllers/templates/StateFormItemRadioCustom';

describe('StateFormItemRadioCustom', () => {
  describe('constructor', () => {
    it('should create a state form item radio custom object', () => {
      expect(new StateFormItemRadioCustom(
        {  },
        {} as StateFormItemRadio
      )).toEqual({ _formItemRadioCustomState: {} });
    });
  });
});