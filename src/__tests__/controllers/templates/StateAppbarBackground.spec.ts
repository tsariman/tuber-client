import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateAppbar from '../../../controllers/StateAppbar';
import StateAppbarBackground from '../../../controllers/templates/StateAppbarBackground';

describe('StateAppbarBackground', () => {
  describe('constructor', () => {
    it('should create a state appbar background object', () => {
      expect(new StateAppbarBackground(
        {},
        {} as StateAppbar<State>
      )).toEqual({ _backgroundState: {} });
    });
  });
});