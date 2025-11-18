import { describe, it, expect } from 'vitest';
import StateAllForms from '../../controllers/StateAllForms';

describe('StateAllForms', () => {
  describe('constructor', () => {
    it('should create a state all forms object', () => {
      expect(new StateAllForms({})).toEqual({ _allFormsState: {} })
    });
  });
});