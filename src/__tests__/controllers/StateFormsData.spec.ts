import { describe, it, expect } from 'vitest';
import StateFormsData from '../../controllers/StateFormsData';

describe('StateFormsData', () => {
  describe('constructor', () => {
    it('should create a state forms data object', () => {
      expect(new StateFormsData({})).toEqual({ _formsDataState: {} });
    });
  });
});