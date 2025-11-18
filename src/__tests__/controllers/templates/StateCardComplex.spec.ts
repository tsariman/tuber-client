import { describe, it, expect } from 'vitest';
import StateCardComplex from '../../../controllers/templates/StateCardComplex';

describe('StateCardComplex', () => {
  describe('constructor', () => {
    it('should create a state card complex object', () => {
      expect(new StateCardComplex(
        { _type: 'complex' },
      )).toEqual({ _cardComplexState: {} });
    });
  });
});
