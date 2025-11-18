import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateAppbarDefault from '../../../controllers/templates/StateAppbarDefault';

describe('StateAppbarDefault', () => {
  describe('constructor', () => {
    it('should create a state appbar default object', () => {
      expect(new StateAppbarDefault(
        {},
        {} as State
      )).toEqual({ _defaultState: {} });
    });
  });
});