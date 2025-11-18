import { describe, it, expect } from 'vitest';
import StateAvatarImage from '../../../controllers/templates/StateAvatarImage';

describe('StateAvatarImage', () => {
  describe('constructor', () => {
    it('should create a state avatar image object', () => {
      expect(new StateAvatarImage({})).toEqual({ _avatarImageState: {} });
    });
  });
});