import { describe, it, expect } from 'vitest';
import StateDataPagesRange from '../../controllers/StateDataPagesRange';

describe('StateDataPagesRange', () => {
  describe('constructor', () => {
    it('should create a state data pages range object', () => {
      expect(new StateDataPagesRange({})).toEqual({ _dataPagesRangeState: {} });
    });
  });
});