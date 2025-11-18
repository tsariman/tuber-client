import { describe, it, expect } from 'vitest';
import StateFormItemCustom from '../../controllers/StateFormItemCustom';

describe('StateFormItemCustom', () => {
  describe('constructor', () => {
    it('should create a state form item custom object', () => {
      expect(new StateFormItemCustom({}, null)).toEqual({ _formItemCustomState: {} });
    });
  });
});
