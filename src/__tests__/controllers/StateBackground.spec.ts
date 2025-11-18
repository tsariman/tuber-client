import { describe, it, expect } from 'vitest';
import StateBackground from '../../controllers/StateBackground';

describe('StateBackground', () => {
  describe('constructor', () => {
    it('should create a state background object', () => {
      expect(new StateBackground({}, null)).toEqual({ _backgroundState: {} });
    });
  });
});