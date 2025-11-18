import { describe, it, expect } from 'vitest';
import StateDrawer from '../../controllers/StateDrawer';

describe('StateDrawer', () => {
  describe('constructor', () => {
    it('should create a state drawer object', () => {
      expect(new StateDrawer({}, null)).toEqual({ _drawerState: {} });
    });
  });
});