import { describe, it, expect } from 'vitest';
import StateAvatar from '../../controllers/StateAvatar';

describe('StateAvatar', () => {
  describe('constructor', () => {
    it('should create a state avatar object', () => {
      expect(new StateAvatar({})).toEqual({ _avatarState: {} });
    });
  });
});
