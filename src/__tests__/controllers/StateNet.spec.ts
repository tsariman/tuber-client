import { describe, it, expect } from 'vitest';
import StateNet from '../../controllers/StateNet';

describe('StateNet', () => {
  describe('constructor', () => {
    it('should create a state net object', () => {
      expect(new StateNet({})).toEqual({ _netState: {} });
    });
  });
});