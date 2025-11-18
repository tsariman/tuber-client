import { describe, it, expect } from 'vitest';
import StateFormItemInputProps from '../../controllers/StateFormItemInputProps';

describe('StateFormItemInputProps', () => {
  describe('constructor', () => {
    it('should create a state form item input props object', () => {
      expect(new StateFormItemInputProps({}, null)).toEqual({ _formItemInputPropsState: {} });
    });
  });
});