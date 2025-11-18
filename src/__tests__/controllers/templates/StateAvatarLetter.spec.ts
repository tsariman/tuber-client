import { describe, it, expect } from 'vitest';
import StateAvatarLetter from '../../../controllers/templates/StateAvatarLetter';

describe('StateAvatarLetter', () => {
  describe('constructor', () => {
    it('should create a state avatar letter object', () => {
      expect(new StateAvatarLetter({})).toEqual({ _avatarLetterState: {} });
    });
  });
});