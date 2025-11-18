import { describe, it, expect } from 'vitest';
import StateTypography from '../../controllers/StateTypography';

describe('StateTypography', () => {
  describe('constructor', () => {
    it('should create a state typography object', () => {
      expect(new StateTypography({}, null)).toEqual({ _typographyState: {} });
    });
  });
});