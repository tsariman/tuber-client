import { describe, it, expect } from 'vitest';
import StateLink from '../../controllers/StateLink';

describe('StateLink', () => {
  describe('constructor', () => {
    it('should create a state link object', () => {
      expect(new StateLink({})).toEqual({ _linkState: {} });
    });
  });
});