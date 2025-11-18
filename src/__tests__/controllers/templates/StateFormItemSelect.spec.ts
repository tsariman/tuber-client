import { describe, it, expect } from 'vitest';
import StateForm from '../../../controllers/StateForm';
import StateFormItemSelect from '../../../controllers/templates/StateFormItemSelect';

describe('StateFormItemSelect', () => {
  describe('constructor', () => {
    it('should create a state form item select object', () => {
      expect(new StateFormItemSelect(
        { type: 'state_select' },
        {} as StateForm
      )).toEqual({ _formItemSelectState: {} });
    });
  });
});