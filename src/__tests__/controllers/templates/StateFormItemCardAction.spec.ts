import { describe, it, expect } from 'vitest';
import StateCard from '../../../controllers/StateCard';
import StateFormItemCardAction from '../../../controllers/templates/StateFormItemCardAction';

describe('StateFormItemCardAction', () => {
  describe('constructor', () => {
    it('should create a state form item card action object', () => {
      expect(new StateFormItemCardAction(
        { type: 'a' },
        {} as StateCard,
      )).toEqual({ _cardActionState: {} });
    });
  });
});