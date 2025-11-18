/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReduxHandlerFactory from '../../event/ReduxHandlerFactory';
import { actions, type IRedux } from '../../state';
import type { THandleDirectiveRule } from '@tuber/shared';

// Global variable for mock
let mockPolicyInstance: any;

// Mock dependencies
vi.mock('../../state/net.actions', () => ({
  post_fetch: vi.fn(),
  post_req_state: vi.fn(() => vi.fn())
}));

vi.mock('../../business.logic', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    FormValidationPolicy: class {
      constructor(redux: any, formName: string) {
        void redux;
        void formName;
        Object.assign(this, mockPolicyInstance);
      }
    },
    get_val: vi.fn(),
    get_origin_ending_fixed: vi.fn(() => 'http://localhost:3000'),
    remember_jsonapi_errors: vi.fn(),
    ler: vi.fn(),
    pre: vi.fn()
  };
});

vi.mock('../../state', async () => {
  const actual = await vi.importActual('../../state');
  return {
    ...actual,
    actions: {
      formsDataClear: vi.fn(),
      dialogClose: vi.fn(),
      dynamicRegistryAdd: vi.fn()
    }
  };
});

vi.mock('../../controllers/StateNet', () => ({
  default: class MockStateNet {
    constructor() {}
    get headers() { return {}; }
  }
}));

vi.mock('../../config', () => ({
  default: {
    read: vi.fn(() => 'light')
  }
}));

describe('ReduxHandlerFactory', () => {
  let mockRedux: IRedux;
  let mockStore: any;
  let mockDispatch: any;
  let mockGetState: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch = vi.fn();
    mockGetState = vi.fn(() => ({
      app: { origin: 'http://localhost:3000' },
      pathnames: { testState: '/api/test' },
      net: {},
      dynamicRegistry: {}
    }));

    mockStore = {
      dispatch: mockDispatch,
      getState: mockGetState
    };

    mockRedux = {
      store: mockStore,
      actions
    };
  });

  describe('constructor', () => {
    it('should initialize with directive', () => {
      const directive = { type: '$form' as const };
      const factory = new ReduxHandlerFactory(directive);
      expect(factory).toBeDefined();
    });
  });

  describe('getDirectiveCallback', () => {
    it('should return submit form handler for $form type', () => {
      const directive = { type: '$form' as const, formName: 'testForm', endpoint: '/api/test' };
      const factory = new ReduxHandlerFactory(directive);
      const handler = factory.getDirectiveCallback();
      expect(handler).toBeDefined();
      expect(typeof handler).toBe('function');
    });

    it('should return submit form handler for $form_dialog type', () => {
      const directive = { type: '$form_dialog' as const, formName: 'testForm', endpoint: '/api/test' };
      const factory = new ReduxHandlerFactory(directive);
      const handler = factory.getDirectiveCallback();
      expect(handler).toBeDefined();
    });

    it('should return post request handler for $form_none type', () => {
      const directive = { type: '$form_none' as const, endpoint: '/api/test' };
      const factory = new ReduxHandlerFactory(directive);
      const handler = factory.getDirectiveCallback();
      expect(handler).toBeDefined();
    });

    it('should return filter handler for $filter type', () => {
      const directive = { type: '$filter' as const };
      const factory = new ReduxHandlerFactory(directive);
      const handler = factory.getDirectiveCallback();
      expect(handler).toBeDefined();
    });

    it('should return get request handler for $none type', () => {
      const directive = { type: '$none' as const };
      const factory = new ReduxHandlerFactory(directive);
      const handler = factory.getDirectiveCallback();
      expect(handler).toBeDefined();
    });

    it('should return undefined for invalid type', () => {
      const directive = { type: 'invalid' as any };
      const factory = new ReduxHandlerFactory(directive);
      const handler = factory.getDirectiveCallback();
      expect(handler).toBeUndefined();
    });
  });

  describe('form submission', () => {
    it('should submit form data successfully', async () => {
      const directive = {
        type: '$form' as const,
        formName: 'testForm',
        endpoint: '/api/test',
        rules: ['close_dialog', 'disable_on_submit'] as THandleDirectiveRule[]
      };

      const factory = new ReduxHandlerFactory(directive);

      // Mock FormValidationPolicy
      const mockPolicy = {
        applyValidationSchemes: vi.fn().mockReturnValue([]),
        getFilteredData: vi.fn().mockReturnValue({ field1: 'value1' }),
        emit: vi.fn()
      };
      mockPolicyInstance = mockPolicy;

      const handler = factory.getDirectiveCallback();
      const eventHandler = handler!(mockRedux);

      const mockEvent = {
        currentTarget: { disabled: false }
      } as any;

      await eventHandler(mockEvent);

      expect(mockPolicy.applyValidationSchemes).toHaveBeenCalled();
      expect(actions.formsDataClear).toHaveBeenCalledWith('testForm');
      expect(mockEvent.currentTarget.disabled).toBe(true);
    });

    it('should not submit if validation fails', async () => {
      const directive = {
        type: '$form' as const,
        formName: 'testForm',
        endpoint: '/api/test'
      };

      const factory = new ReduxHandlerFactory(directive);

      const mockPolicy = {
        applyValidationSchemes: vi.fn().mockReturnValue([{ name: 'field1', message: 'Required' }]),
        getFilteredData: vi.fn(),
        emit: vi.fn()
      };
      mockPolicyInstance = mockPolicy;

      const handler = factory.getDirectiveCallback();
      const eventHandler = handler!(mockRedux);

      const mockEvent = { currentTarget: {} } as any;

      await eventHandler(mockEvent);

      expect(mockPolicy.emit).toHaveBeenCalledWith('field1', 'Required');
      expect(actions.formsDataClear).not.toHaveBeenCalled();
    });
  });

  describe('post request', () => {
    it('should make post request for $form_none', async () => {
      const directive = { type: '$form_none' as const, endpoint: '/api/test' };
      const factory = new ReduxHandlerFactory(directive);

      const handler = factory.getDirectiveCallback();
      const eventHandler = handler!(mockRedux);

      await eventHandler({});

      // Since post_req_state is a thunk, it should be dispatched
      expect(mockDispatch).toHaveBeenCalled();
      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(typeof dispatchedAction).toBe('function');
    });
  });

  describe('filter resources', () => {
    it('should throw error for unimplemented filter', async () => {
      const directive = { type: '$filter' as const };
      const factory = new ReduxHandlerFactory(directive);

      const handler = factory.getDirectiveCallback();
      const eventHandler = handler!(mockRedux);

      await expect(eventHandler({})).rejects.toThrow('_filterResourcesList() NOT implemented.');
    });
  });

  describe('get request', () => {
    it('should throw error for unimplemented get request', async () => {
      const directive = { type: '$none' as const };
      const factory = new ReduxHandlerFactory(directive);

      const handler = factory.getDirectiveCallback();
      const eventHandler = handler!(mockRedux);

      await expect(eventHandler({})).rejects.toThrow('_makeGetRequest() NOT implemented.');
    });
  });
});
