import { describe, it, expect } from 'vitest';
import StateForm from '../../../controllers/StateForm'
import StateFormItemInput from '../../../controllers/templates/StateFormItemInput';

describe('StateFormItemInput', () => {
  describe('constructor', () => {
    it('should create a state form item input object', () => {
      expect(new StateFormItemInput(
        { type: 'text' },
        {} as StateForm
      )).toEqual({ _formItemInputState: {} });
    });
  });
});