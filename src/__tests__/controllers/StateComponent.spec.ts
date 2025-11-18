import { describe, it, expect } from 'vitest';
import StateComponent from '../../controllers/StateComponent';

describe('StateComponent', () => {
  describe('constructor', () => {
    it('should create a state component object', () => {
      expect(new StateComponent({}, null)).toEqual({ _stateComponent: {} });
    });
  });
});