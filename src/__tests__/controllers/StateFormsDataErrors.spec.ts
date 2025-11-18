import { describe, it, expect } from 'vitest';
import StateFormsDataErrors from '../../controllers/StateFormsDataErrors';

describe('StateFormsDataErrors', () => {
  describe('constructor', () => {
    it('should create a state forms data errors object', () => {
      expect(new StateFormsDataErrors({})).toEqual({ _formsDataErrorsState: {} });
    });
  });
});