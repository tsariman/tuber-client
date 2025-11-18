import { describe, it, expect } from 'vitest';
import StateTmp from '../../controllers/StateTmp';

describe('StateTmp', () => {
  describe('constructor', () => {
    it('should create a state tmp object', () => {
      expect(new StateTmp({})).toEqual({ _tmpState: {} });
    });
  });
});