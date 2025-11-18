import { describe, it, expect } from 'vitest';
import StateData from '../../controllers/StateData';

describe('StateData', () => {
  describe('constructor', () => {
    it('should create a state data object', () => {
      expect(new StateData({})).toEqual({ _dataState: {} });
    });
  });
});