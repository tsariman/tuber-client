import { describe, it, expect } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StatePageAppbar from '../../../controllers/templates/StatePageAppbar';

describe('StatePageAppbar', () => {
  describe('constructor', () => {
    it('should create a state page appbar object', () => {
      expect(new StatePageAppbar(
        {},
        {} as StatePage
      )).toEqual({ _defaultState: {} });
    });
  });
});