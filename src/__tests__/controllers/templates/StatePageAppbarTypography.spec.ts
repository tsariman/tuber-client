import { describe, it, expect } from 'vitest';
import StateAppbar from '../../../controllers/StateAppbar';
import StatePage from '../../../controllers/StatePage';
import StatePageAppbarTypography from '../../../controllers/templates/StatePageAppbarTypography';

describe('StatePageAppbarTypography', () => {
  describe('constructor', () => {
    it('should create a state page appbar typography object', () => {
      expect(new StatePageAppbarTypography(
        {},
        {} as StateAppbar<StatePage>
      )).toEqual({ _defaultState: {} });
    });
  });
});