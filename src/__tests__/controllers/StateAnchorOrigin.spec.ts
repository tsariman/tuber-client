import { describe, it, expect } from 'vitest';
import StateAnchorOrigin from '../../controllers/StateAnchorOrigin';
import StateSnackbar from '../../controllers/StateSnackbar';

describe('StateAnchorOrigin', () => {
  describe('constructor', () => {
    it('should create a state anchor origin object', () => {
      expect(new StateAnchorOrigin({
        vertical: 'top',
        horizontal: 'left'
      }, {} as StateSnackbar)).toEqual({ _anchorOriginState: {} });
    });
  });
});