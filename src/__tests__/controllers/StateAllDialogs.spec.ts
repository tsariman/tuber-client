import { describe, it, expect } from 'vitest';
import StateAllDialogs from '../../controllers/StateAllDialogs';

describe('StateAllDialogs', () => {
  describe('constructor', () => {
    it('should create a state all dialogs object', () => {
      const allDialogsState = {
        '1': {
          title: 'Dialog 1',
          contentText: 'Dialog 1 description'
        },
        '2': {
          title: 'Dialog 2',
          contentText: 'Dialog 2 description'
        }
      };
      const state = new StateAllDialogs(allDialogsState);
      expect(state.state).toEqual(allDialogsState);
    });
  });

  describe('state', () => {
    it('should return the state', () => {
      const allDialogsState = {
        '1': {
          title: 'Dialog 1',
          contentText: 'Dialog 1 description'
        },
        '2': {
          title: 'Dialog 2',
          contentText: 'Dialog 2 description'
        }
      };
      const state = new StateAllDialogs(allDialogsState);
      expect(state.state).toEqual(allDialogsState);
    });
  });
});