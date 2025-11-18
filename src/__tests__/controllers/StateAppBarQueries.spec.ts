import { describe, it, expect } from 'vitest';
import StateAppbarQueries from '../../controllers/StateAppbarQueries';

describe('StateAppbarQueries', () => {
  describe('constructor', () => {
    it('should create a state appbar queries object', () => {
      expect(new StateAppbarQueries({})).toEqual({ _appbarQueriesState: {} });
    });
  });
});