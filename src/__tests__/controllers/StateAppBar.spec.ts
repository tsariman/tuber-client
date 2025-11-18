import { describe, it, expect } from 'vitest';
import StateAppbar from '../../controllers/StateAppbar';

describe('StateAppbar', () => {
  describe('constructor', () => {
    it('should create a state appbar object', () => {
      expect(new StateAppbar({}, null)).toEqual({ _appbarState: {} });
    });
  });
});