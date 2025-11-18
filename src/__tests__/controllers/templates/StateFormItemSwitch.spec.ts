import { describe, it, expect } from 'vitest';
import StateForm from '../../../controllers/StateForm';
import StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch';

describe('StateFormItemSwitch', () => {
  describe('constructor', () => {
    it('should create a state form item switch object', () => {
      expect(new StateFormItemSwitch(
        { type: 'switch' },
        {} as StateForm
      )).toEqual({ _formItemSwitchState: {} });
    });
  });
});