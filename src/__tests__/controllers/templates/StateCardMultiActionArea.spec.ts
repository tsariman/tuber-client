import { describe, it, expect } from 'vitest';
import StateCardMultiActionArea from '../../../controllers/templates/StateCardMultiActionArea';

describe('StateCardMultiActionArea', () => {
  describe('constructor', () => {
    it('should create a state card multi action area object', () => {
      expect(new StateCardMultiActionArea(
        { _type: 'multi_action_area' },
      )).toEqual({ _cardMultiActionAreaState: {} });
    });
  });
});