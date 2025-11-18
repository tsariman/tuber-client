import { describe, it, expect } from 'vitest';
import StateSession from '../../controllers/StateSession';

describe('StateSession', () => {
  describe('constructor', () => {
    it('should create a state session object', () => {
      expect(new StateSession({})).toEqual({ _sessionState: {} });
    });
  });
});