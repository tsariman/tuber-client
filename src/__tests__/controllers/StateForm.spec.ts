import { vi } from 'vitest';

// Mock StateAllForms class
vi.mock('../../controllers/StateAllForms', () => ({
  default: class MockStateAllForms {
    parent: unknown;
    constructor() {
      this.parent = null;
    }
    getLastFormName() {
      return 'lastForm';
    }
    getStateFormName(name: string) {
      return name + 'Form';
    }
  }
}));

import { describe, it, expect, beforeEach } from 'vitest';
import StateForm from '../../controllers/StateForm';
import StateAllForms from '../../controllers/StateAllForms';
import State from '../../controllers/State';
import StateFormItem from '../../controllers/StateFormItem';
import type { IStateForm, IStateFormItem } from '../../localized/interfaces';
import initialState from '../../state/initial.state';

// Mock State class
vi.mock('../../controllers/State', () => ({
  default: class MockState {
    _rootState: unknown;
    constructor(rootState: unknown) {
      this._rootState = rootState;
    }
    get formsDataErrors() {
      return {
        getCount: vi.fn(() => 0)
      };
    }
  }
}));

describe('StateForm', () => {
  let mockAllForms: StateAllForms;
  let mockState: State;
  let basicFormState: IStateForm;
  let form: StateForm;

  beforeEach(() => {
    // Mock State with minimal required properties
    mockState = new State(initialState);

    // Mock StateAllForms
    mockAllForms = new StateAllForms({}, mockState);

    // Basic form state
    basicFormState = {
      _key: 'test-form',
      _type: 'none',
      items: [
        { _key: 'field1', type: 'text' },
        { _key: 'field2', type: 'number' }
      ],
      paperBackground: true,
      theme: { backgroundColor: '#fff' },
      props: { className: 'test-form' },
      paperProps: { elevation: 2 }
    };

    form = new StateForm(basicFormState, mockAllForms);
  });

  describe('Constructor and Basic Properties', () => {
    it('should create StateForm with provided state and parent', () => {
      expect(form).toBeInstanceOf(StateForm);
      expect(form.state).toBe(basicFormState);
      expect(form.parent).toBe(mockAllForms);
    });

    it('should initialize properties correctly', () => {
      expect(form._key).toBe('test-form');
      expect(form._type).toBe('none');
      expect(form.name).toBe('test-form');
      expect(form.paperBackground).toBe(true);
      expect(form.theme).toEqual({ backgroundColor: '#fff' });
    });

    it('should handle missing properties gracefully', () => {
      const minimalState: IStateForm = { _key: 'minimal' };
      const minimalForm = new StateForm(minimalState, mockAllForms);

      expect(minimalForm._key).toBe('minimal');
      expect(minimalForm._type).toBe('none');
      expect(minimalForm.name).toBe('minimal');
      expect(minimalForm.paperBackground).toBe(false);
      expect(minimalForm.theme).toEqual({});
      expect(minimalForm.items).toEqual([]);
    });
  });

  describe('Form Type Validation', () => {
    it('should accept valid form types', () => {
      const stackForm = new StateForm({ ...basicFormState, _type: 'stack' }, mockAllForms);
      expect(stackForm._type).toBe('stack');

      const boxForm = new StateForm({ ...basicFormState, _type: 'box' }, mockAllForms);
      expect(boxForm._type).toBe('box');

      const noneForm = new StateForm({ ...basicFormState, _type: 'none' }, mockAllForms);
      expect(noneForm._type).toBe('none');
    });

    it('should default to "none" for invalid types', () => {
      const invalidForm = new StateForm({ ...basicFormState, _type: 'invalid' as unknown as IStateForm['_type'] }, mockAllForms);
      expect(invalidForm._type).toBe('none');
    });
  });

  describe('Form Items', () => {
    it('should create and cache StateFormItem instances', () => {
      const items = form.items;
      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(StateFormItem);
      expect(items[1]).toBeInstanceOf(StateFormItem);
      expect(items[0].parent).toBe(form);
      expect(items[1].parent).toBe(form);

      // Should return cached instance
      const items2 = form.items;
      expect(items2).toBe(items);
    });

    it('should handle forms without items', () => {
      const formWithoutItems = new StateForm({ _key: 'no-items' }, mockAllForms);
      expect(formWithoutItems.items).toEqual([]);
    });
  });

  describe('Props and Configuration', () => {
    it('should return correct props with defaults', () => {
      const props = form.props;
      expect(props).toEqual({
        autoComplete: 'off',
        component: 'form',
        onSubmit: expect.any(Function),
        className: 'test-form'
      });
    });

    it('should return paperProps', () => {
      expect(form.paperProps).toEqual({ elevation: 2 });
    });

    it('should handle missing paperProps', () => {
      const formWithoutPaper = new StateForm({ _key: 'no-paper' }, mockAllForms);
      expect(formWithoutPaper.paperProps).toEqual({});
    });
  });

  describe('Endpoint Management', () => {
    it('should get and set endpoint', () => {
      expect(form.endpoint).toBe('');

      form.endpoint = '/api/test';
      expect(form.endpoint).toBe('/api/test');
    });
  });

  describe('Error Count', () => {
    it('should return error count from formsDataErrors', () => {
      expect(form.errorCount).toBe(0);
    });
  });

  describe('Form Name Resolution', () => {
    it('should use _key as name when available', () => {
      expect(form.name).toBe('test-form');
    });

    it('should use parent lastFormName when _key is missing', () => {
      const formWithoutKey = new StateForm({}, mockAllForms);
      expect(formWithoutKey.name).toBe('lastForm');
    });
  });

  describe('Error Handling', () => {
    it('should handle null/undefined state properties gracefully', () => {
      const stateWithNulls: IStateForm = {
        _key: null as unknown as string,
        _type: null as unknown as IStateForm['_type'],
        items: null as unknown as IStateFormItem[],
        theme: null as unknown as Record<string, unknown>,
        props: null as unknown as Record<string, unknown>,
        paperProps: null as unknown as Record<string, unknown>
      };
      const form = new StateForm(stateWithNulls, mockAllForms);

      expect(form._key).toBe('');
      expect(form._type).toBe('none');
      expect(form.items).toEqual([]);
      expect(form.theme).toEqual({});
      expect(form.props).toEqual({
        autoComplete: 'off',
        component: 'form',
        onSubmit: expect.any(Function)
      });
      expect(form.paperProps).toEqual({});
    });

    it('should handle missing parent gracefully', () => {
      const form = new StateForm(basicFormState, null as unknown as StateAllForms);
      expect(form.parent).toBeNull();
      expect(() => form.errorCount).toThrow(); // Should fail when accessing parent-dependent properties
    });
  });
});