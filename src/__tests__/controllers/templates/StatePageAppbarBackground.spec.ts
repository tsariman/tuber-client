import { describe, it, expect } from 'vitest';
import StateAppbar from '../../../controllers/StateAppbar';
import StatePage from '../../../controllers/StatePage';
import StatePageAppbarBackground from '../../../controllers/templates/StatePageAppbarBackground';

describe('StatePageAppbarBackground', () => {
  describe('constructor', () => {
    it('should create a state page appbar background object', () => {
      expect(new StatePageAppbarBackground(
        {},
        {} as StateAppbar<StatePage>
      )).toEqual({ _defaultState: {} });
    });
  });
});