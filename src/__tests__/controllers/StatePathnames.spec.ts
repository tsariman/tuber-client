import { describe, it, expect } from 'vitest';
import StatePathnames from '../../controllers/StatePathnames';

describe('StatePathnames', () => {
  describe('constructor', () => {
    it('should create a state pathnames object', () => {
      expect(new StatePathnames({
        DIALOGS: '',
        FORMS: '',
        PAGES: '',
      })).toEqual({ _pathnamesState: {} });
    });
  });
});
