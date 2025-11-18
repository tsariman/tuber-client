import { describe, it, expect } from 'vitest';
import StateForm from '../../controllers/StateForm';
import StateFormItemGroup from '../../controllers/StateFormItemGroup';

describe('StateFormItemGroup', () => {
  describe('constructor', () => {
    it('should create a state form item group object', () => {
      expect(new StateFormItemGroup({}, {} as StateForm)).toEqual({ _formItemGroupState: {} });
    });
  });
});