import { describe, it, expect } from 'vitest';
import StateCardBasic from '../../../../src/controllers/templates/StateCardBasic';

describe('StateCardBasic', () => {
  describe('constructor', () => {
    it('should create a state card basic object', () => {
      expect(new StateCardBasic({ _type: 'basic' })).toEqual({ _cardBasicState: {} });
    });
  });
});