import { describe, it, expect } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StatePageTypography from '../../../controllers/templates/StatePageTypography';

describe('StatePageTypography', () => {
  describe('constructor', () => {
    it('should create a state page typography object', () => {
      expect(new StatePageTypography(
        {},
        {} as StatePage
      )).toEqual({ _defaultState: {} });
    });
  });
});