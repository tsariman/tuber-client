import { describe, it, expect } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StatePageDrawer from '../../../controllers/templates/StatePageDrawer';

describe('StatePageDrawer', () => {
  describe('constructor', () => {
    it('should create a state page drawer object', () => {
      expect(new StatePageDrawer(
        {},
        {} as StatePage
      )).toEqual({ _defaultState: {} });
    });
  });
});