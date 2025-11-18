import { describe, it, expect } from 'vitest';
import StateFormItemCustomChip from '../../../controllers/templates/StateFormItemCustomChip';

describe('StateFormItemCustomChip', () => {
  describe('constructor', () => {
    it('should create a state form item custom chip object', () => {
      expect(new StateFormItemCustomChip(
        {},
        {}
      )).toEqual({ _formItemCustomChipState: {} });
    });
  });
});