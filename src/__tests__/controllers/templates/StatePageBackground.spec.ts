import { describe, it, expect } from 'vitest';
import StatePage from '../../../controllers/StatePage';
import StatePageBackground from '../../../controllers/templates/StatePageBackground';

describe('StatePageBackground', () => {
  describe('constructor', () => {
    it('should create a state page background object', () => {
      expect(new StatePageBackground(
        {  },
        {} as StatePage
      )).toEqual({ _pageBackgroundState: {} });
    });
  });
});