import { describe, it, expect } from 'vitest';
import StateFormItemSwitchToggle from '../../controllers/StateFormItemSwitchToggle';
import StateFormItemSwitch from '../../controllers/templates/StateFormItemSwitch';

describe('StateFormItemSwitchToggle', () => {
  describe('constructor', () => {
    it('should create a state form item switch toggle object', () => {
      expect(new StateFormItemSwitchToggle(
        {},
        {} as StateFormItemSwitch
      )).toEqual({ _formItemSwitchToggleState: {} });
    });
  });
});