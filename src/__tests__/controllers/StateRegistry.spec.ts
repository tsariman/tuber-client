import { describe, it, expect, vi, beforeEach } from 'vitest';
import './setup-mocks'; // Import centralized mocks
import StateRegistry from '../../controllers/StateRegistry';
import { createMockRootState } from './test-utils';
import { ler } from '../../business.logic/logging';
import { error_id } from '../../business.logic/errors';
import State from '../../controllers/State';

// Mock State class
const mockParentState = {
  die: vi.fn((_msg: string, defaultVal: unknown) => defaultVal),
} as unknown as State;

vi.mock('../../controllers/State', () => ({
  default: {
    fromRootState: vi.fn(() => mockParentState),
  },
}));

describe('StateRegistry', () => {
  let mockRegistryState: Record<string, unknown>;
  let stateRegistry: StateRegistry;
  let mockGetState: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockRegistryState = {
      stringValue: 'test string',
      numberValue: 42,
      booleanValue: true,
      objectValue: { nested: true },
      arrayValue: [1, 2, 3],
      nullValue: null,
      undefinedValue: undefined,
    };
    
    // Get the mocked get_state function
    const stateMocks = await vi.importMock('../../state') as { get_state: ReturnType<typeof vi.fn> };
    mockGetState = stateMocks.get_state;
    mockGetState.mockReturnValue(createMockRootState());
    
    stateRegistry = new StateRegistry(mockRegistryState, mockParentState);
  });

  describe('constructor', () => {
    it('should create StateRegistry with registry state and parent', () => {
      expect(stateRegistry).toBeInstanceOf(StateRegistry);
      expect(stateRegistry.state).toBe(mockRegistryState);
      expect(stateRegistry.parent).toBe(mockParentState);
    });

    it('should create StateRegistry with only registry state', () => {
      const registryNoParent = new StateRegistry(mockRegistryState);
      expect(registryNoParent).toBeInstanceOf(StateRegistry);
      expect(registryNoParent.state).toBe(mockRegistryState);
    });
  });

  describe('AbstractState implementation', () => {
    it('should return registry state from state getter', () => {
      expect(stateRegistry.state).toBe(mockRegistryState);
    });

    it('should return parent or create one from get_state', () => {
      const parent = stateRegistry.parent;
      expect(parent).toBeDefined();
    });

    it('should return error object for props getter', () => {
      const props = stateRegistry.props;
      expect(props).toEqual({});
    });

    it('should return error object for theme getter', () => {
      const theme = stateRegistry.theme;
      expect(theme).toEqual({});
    });
  });

  describe('get method', () => {
    it('should return existing string value', () => {
      const result = stateRegistry.get('stringValue');
      expect(result).toBe('test string');
    });

    it('should return existing number value', () => {
      const result = stateRegistry.get('numberValue');
      expect(result).toBe(42);
    });

    it('should return existing boolean value', () => {
      const result = stateRegistry.get('booleanValue');
      expect(result).toBe(true);
    });

    it('should return existing object value', () => {
      const result = stateRegistry.get('objectValue');
      expect(result).toEqual({ nested: true });
    });

    it('should return existing array value', () => {
      const result = stateRegistry.get('arrayValue');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return null for null values', () => {
      const result = stateRegistry.get('nullValue');
      expect(result).toBeNull();
    });

    it('should return default value for undefined values', () => {
      const result = stateRegistry.get('undefinedValue', 'default');
      expect(result).toBe('default');
    });

    it('should return default value for non-existent keys', () => {
      const result = stateRegistry.get('nonExistentKey', 'default');
      expect(result).toBe('default');
    });

    it('should return undefined when no default provided for missing key', () => {
      const result = stateRegistry.get('nonExistentKey');
      expect(result).toBeUndefined();
    });

    it('should work with type parameter', () => {
      const stringResult = stateRegistry.get<string>('stringValue');
      const numberResult = stateRegistry.get<number>('numberValue');
      const objectResult = stateRegistry.get<{ nested: boolean }>('objectValue');
      
      expect(typeof stringResult).toBe('string');
      expect(typeof numberResult).toBe('number');
      expect(typeof objectResult).toBe('object');
      expect(objectResult?.nested).toBe(true);
    });

    it('should return typed default value when key is missing', () => {
      const stringDefault = stateRegistry.get<string>('missing', 'default string');
      const numberDefault = stateRegistry.get<number>('missing', 999);
      const objectDefault = stateRegistry.get<object>('missing', { default: true });
      
      expect(stringDefault).toBe('default string');
      expect(numberDefault).toBe(999);
      expect(objectDefault).toEqual({ default: true });
    });
  });

  describe('error handling', () => {
    it('should handle exceptions and log errors', () => {
      // Create a registry that will throw an error when accessed
      const faultyRegistry = new StateRegistry({
        get problematicKey() {
          throw new Error('Test error');
        }
      });

      
      const result = faultyRegistry.get('problematicKey', 'fallback');
      
      expect(ler).toHaveBeenCalledWith('StateRegistry.get(): error for key "problematicKey"');
      expect(error_id).toHaveBeenCalledWith(15);
      expect(result).toBe('fallback');
    });

    it('should remember exceptions in error tracking', () => {
      const faultyRegistry = new StateRegistry({
        get errorKey() {
          throw new Error('Test error');
        }
      });

      const mockRememberException = vi.fn();
      (error_id as ReturnType<typeof vi.fn>).mockReturnValue({ remember_exception: mockRememberException });

      faultyRegistry.get('errorKey', 'default');
      
      expect(mockRememberException).toHaveBeenCalled();
    });

    it('should handle null registry state gracefully', () => {
      const nullRegistry = new StateRegistry(null as unknown as Record<string, unknown>);
      expect(() => nullRegistry.get('anyKey', 'default')).not.toThrow();
    });

    it('should handle undefined registry state gracefully', () => {
      const undefinedRegistry = new StateRegistry(undefined as unknown as Record<string, unknown>);
      expect(() => undefinedRegistry.get('anyKey', 'default')).not.toThrow();
    });
  });

  describe('complex data types', () => {
    beforeEach(() => {
      mockRegistryState = {
        complexObject: {
          nested: {
            deeply: {
              value: 'deep value'
            }
          },
          array: [{ id: 1 }, { id: 2 }]
        },
        functionValue: () => 'function result',
        dateValue: new Date(2023, 0, 1), // Using constructor instead of string parsing
        regexValue: /test/g,
      };
      stateRegistry = new StateRegistry(mockRegistryState, mockParentState);
    });

    it('should handle nested objects', () => {
      const result = stateRegistry.get('complexObject');
      expect(result).toEqual({
        nested: {
          deeply: {
            value: 'deep value'
          }
        },
        array: [{ id: 1 }, { id: 2 }]
      });
    });

    it('should handle function values', () => {
      const result = stateRegistry.get('functionValue') as () => string;
      expect(typeof result).toBe('function');
      expect(result()).toBe('function result');
    });

    it('should handle Date objects', () => {
      const result = stateRegistry.get('dateValue') as Date;
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2023);
    });

    it('should handle RegExp objects', () => {
      const result = stateRegistry.get('regexValue') as RegExp;
      expect(result).toBeInstanceOf(RegExp);
      expect(result.global).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string as key', () => {
      const registryWithEmptyKey = new StateRegistry({ '': 'empty key value' });
      const result = registryWithEmptyKey.get('', 'default');
      expect(result).toBe('empty key value');
    });

    it('should handle numeric string keys', () => {
      const registryWithNumericKeys = new StateRegistry({ '123': 'numeric key' });
      const result = registryWithNumericKeys.get('123', 'default');
      expect(result).toBe('numeric key');
    });

    it('should handle special character keys', () => {
      const registryWithSpecialKeys = new StateRegistry({ 
        'key-with-dashes': 'dashed',
        'key.with.dots': 'dotted',
        'key with spaces': 'spaced'
      });
      
      expect(registryWithSpecialKeys.get('key-with-dashes')).toBe('dashed');
      expect(registryWithSpecialKeys.get('key.with.dots')).toBe('dotted');
      expect(registryWithSpecialKeys.get('key with spaces')).toBe('spaced');
    });

    it('should handle zero and false as valid values', () => {
      const registryWithFalsyValues = new StateRegistry({
        zeroValue: 0,
        falseValue: false,
        emptyString: ''
      });
      
      expect(registryWithFalsyValues.get('zeroValue')).toBe(0);
      expect(registryWithFalsyValues.get('falseValue')).toBe(false);
      expect(registryWithFalsyValues.get('emptyString')).toBe('');
    });
  });

  describe('parent state integration', () => {
    it('should create parent state when none provided', () => {
      const registryWithoutParent = new StateRegistry({});
      const parent = registryWithoutParent.parent;
      
      expect(parent).toBeDefined();
      // Should have called State.fromRootState
      expect(State.fromRootState).toHaveBeenCalled();
    });

    it('should use provided parent state', () => {
      const customParent = { custom: true } as unknown as State;
      const registryWithParent = new StateRegistry({}, customParent);
      
      expect(registryWithParent.parent).toBe(customParent);
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with generic parameters', () => {
      interface CustomType {
        id: number;
        name: string;
      }
      
      const customRegistry = new StateRegistry({
        customObject: { id: 1, name: 'test' } as CustomType
      });
      
      const result: CustomType = customRegistry.get<CustomType>('customObject', { id: 0, name: 'default' });
      expect(result.id).toBe(1);
      expect(result.name).toBe('test');
    });

    it('should work with union types', () => {
      const unionRegistry = new StateRegistry({
        unionValue: 'string value'
      });
      
      const result: string | number = unionRegistry.get<string | number>('unionValue', 0);
      expect(typeof result).toBe('string');
      expect(result).toBe('string value');
    });
  });
});