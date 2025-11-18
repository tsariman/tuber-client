import { describe, it, expect } from 'vitest';
import State from '../../../controllers/State';
import StateAppbar from '../../../controllers/StateAppbar';
import StateAppbarTypography from '../../../controllers/templates/StateAppbarTypography';

describe('StateAppbarTypography', () => {
  describe('constructor', () => {
    it('should create a state appbar typography object', () => {
      expect(new StateAppbarTypography(
        {},
        {} as StateAppbar<State>
      )).toEqual({ _typographyState: {} });
    });
  });
});