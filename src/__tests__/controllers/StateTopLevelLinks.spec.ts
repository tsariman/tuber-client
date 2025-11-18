import { describe, it, expect } from 'vitest';
import StateTopLevelLinks from '../../controllers/StateTopLevelLinks';

describe('StateTopLevelLinks', () => {
  describe('constructor', () => {
    it('should create a state top level links object', () => {
      expect(new StateTopLevelLinks({})).toEqual({ _topLevelLinksState: {} });
    });
  });
});
