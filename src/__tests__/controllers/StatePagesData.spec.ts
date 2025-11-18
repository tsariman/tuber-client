import { describe, it, expect } from 'vitest';
import StatePagesData from '../../controllers/StatePagesData';

describe('StatePagesData', () => {
  describe('constructor', () => {
    it('should create a state pages data object', () => {
      expect(new StatePagesData({})).toEqual({ _pagesDataState: {} });
    });
  });
});