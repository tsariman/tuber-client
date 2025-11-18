import { describe, it, expect } from 'vitest';
import StateCard from '../../controllers/StateCard';

describe('StateCard', () => {
  describe('constructor', () => {
    it('should create a state card object', () => {
      expect(new StateCard({ _type: 'basic' })).toEqual({ _cardState: {} });
    });
  });
});
