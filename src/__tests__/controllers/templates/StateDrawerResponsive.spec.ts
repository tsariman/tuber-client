import { describe, it, expect } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StateDrawerResponsive from '../../../controllers/templates/StateDrawerResponsive';

describe('StateDrawerResponsive', () => {
  describe('constructor', () => {
    it('should create a state drawer responsive object', () => {
      expect(new StateDrawerResponsive(
        {},
        {} as StatePage
      )).toEqual({ _drawerResponsiveState: {} });
    });
  });
});