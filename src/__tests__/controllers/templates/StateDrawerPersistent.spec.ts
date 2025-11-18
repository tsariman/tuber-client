import { describe, it, expect } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StateDrawerPersistent from '../../../controllers/templates/StateDrawerPersistent';

describe('StateDrawerPersistent', () => {
  describe('constructor', () => {
    it('should create a state drawer persistent object', () => {
      expect(new StateDrawerPersistent(
        {},
        {} as StatePage
      )).toEqual({ _defaultState: {} });
    });
  });
});