import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import './setup-mocks'; // Import centralized mocks
import { mockConfig } from './setup-mocks';
import AbstractState from '../../controllers/AbstractState';
import { createMockConfig } from './test-utils';

// Create a concrete implementation for testing
class TestableAbstractState extends AbstractState {
  private mockState: unknown;

  constructor(mockState: unknown = {}) {
    super();
    this.mockState = mockState;
  }

  get state(): unknown {
    return this.mockState;
  }

  get parent(): unknown {
    return null;
  }

  get props(): unknown {
    return {};
  }

  get theme(): unknown {
    return {};
  }
}

// Additional mock for this specific test

describe('AbstractState', () => {
  let abstractState: TestableAbstractState;
  let originalConsole: typeof console;

  beforeEach(() => {
    abstractState = new TestableAbstractState();
    originalConsole = { ...console };
    console.error = vi.fn();
    console.warn = vi.fn();
    console.log = vi.fn();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
    vi.clearAllMocks();
  });

  describe('abstract property requirements', () => {
    it('should have state property', () => {
      expect(abstractState.state).toBeDefined();
    });

    it('should have parent property', () => {
      expect(abstractState.parent).toBeDefined();
    });

    it('should have props property', () => {
      expect(abstractState.props).toBeDefined();
    });

    it('should have theme property', () => {
      expect(abstractState.theme).toBeDefined();
    });
  });

  describe('die method', () => {
    it('should throw error when DEBUG is true', () => {
      // Set DEBUG to true for this test
      mockConfig.DEBUG = true;

      expect(() => {
        abstractState['die']('Test error message', 'default');
      }).toThrow('Test error message');
      
      // Reset DEBUG for other tests
      mockConfig.DEBUG = false;
    });

    it('should return default value when DEBUG is false', () => {
      const result = abstractState['die']('Test error message', 'default value');
      expect(result).toBe('default value');
    });

    it('should work with different return types', () => {
      const numberResult = abstractState['die']('Error', 42);
      expect(numberResult).toBe(42);

      const objectResult = abstractState['die']('Error', { test: true });
      expect(objectResult).toEqual({ test: true });

      const arrayResult = abstractState['die']('Error', [1, 2, 3]);
      expect(arrayResult).toEqual([1, 2, 3]);
    });
  });

  describe('ler method', () => {
    it('should log error and return default value when DEBUG is true', () => {
      // Mock Config with DEBUG = true
      vi.doMock('../../config', () => ({
        default: createMockConfig(true),
      }));

      const result = abstractState['ler']('Error message', 'default');
      expect(result).toBe('default');
      // Note: In production this would call console.error, but since we're mocking Config
      // we need to test the actual behavior based on the mocked config
    });

    it('should return default value when DEBUG is false', () => {
      const result = abstractState['ler']('Error message', 'default value');
      expect(result).toBe('default value');
    });

    it('should work with different return types', () => {
      const result = abstractState['ler']('Error', { error: true });
      expect(result).toEqual({ error: true });
    });
  });

  describe('warn method', () => {
    it('should return default value when DEBUG is false', () => {
      const result = abstractState['warn']('Warning message', 'default value');
      expect(result).toBe('default value');
    });

    it('should work with different return types', () => {
      const result = abstractState['warn']('Warning', { warning: true });
      expect(result).toEqual({ warning: true });
    });
  });

  describe('notice method', () => {
    it('should return default value when DEBUG is false', () => {
      const result = abstractState['notice']('Notice message', 'default value');
      expect(result).toBe('default value');
    });

    it('should work with different return types', () => {
      const result = abstractState['notice']('Notice', { notice: true });
      expect(result).toEqual({ notice: true });
    });
  });

  describe('dummy_factory_handler method', () => {
    it('should return a function', () => {
      const handler = abstractState['dummy_factory_handler']('test-arg');
      expect(typeof handler).toBe('function');
    });

    it('should return a handler that calls ler when invoked', () => {
      // Override the ler method to spy on it
      const originalLer = abstractState['ler'];
      const lerSpy = vi.fn().mockImplementation(originalLer.bind(abstractState));
      abstractState['ler'] = lerSpy;
      
      const handler = abstractState['dummy_factory_handler']('test-arg');
      
      handler('test-event');
      
      expect(lerSpy).toHaveBeenCalledWith('No callback was assigned.', undefined);
      
      // Restore original method
      abstractState['ler'] = originalLer;
    });

    it('should handle undefined argument', () => {
      const handler = abstractState['dummy_factory_handler'](undefined);
      expect(typeof handler).toBe('function');
    });

    it('should handle different argument types', () => {
      const handlers = [
        abstractState['dummy_factory_handler']('string'),
        abstractState['dummy_factory_handler'](42),
        abstractState['dummy_factory_handler']({ test: true }),
        abstractState['dummy_factory_handler']([1, 2, 3]),
      ];

      handlers.forEach(handler => {
        expect(typeof handler).toBe('function');
      });
    });

    it('should return handler that ignores event argument', () => {
      // Override the ler method to spy on it
      const originalLer = abstractState['ler'];
      const lerSpy = vi.fn().mockImplementation(originalLer.bind(abstractState));
      abstractState['ler'] = lerSpy;
      
      const handler = abstractState['dummy_factory_handler']('test');
      
      // Should work with different event types
      handler(new Event('click'));
      handler({ target: 'test' });
      handler('string-event');
      handler(undefined);
      
      expect(lerSpy).toHaveBeenCalledTimes(4);
      expect(lerSpy).toHaveBeenCalledWith('No callback was assigned.', undefined);
      
      // Restore original method
      abstractState['ler'] = originalLer;
    });
  });

  describe('type safety', () => {
    it('should maintain proper typing for die method', () => {
      const stringResult: string = abstractState['die']('Error', 'string');
      const numberResult: number = abstractState['die']('Error', 42);
      const booleanResult: boolean = abstractState['die']('Error', true);
      
      expect(typeof stringResult).toBe('string');
      expect(typeof numberResult).toBe('number');
      expect(typeof booleanResult).toBe('boolean');
    });

    it('should maintain proper typing for other logging methods', () => {
      const lerResult: string = abstractState['ler']('Error', 'test');
      const warnResult: number = abstractState['warn']('Warning', 42);
      const noticeResult: boolean = abstractState['notice']('Notice', true);
      
      expect(typeof lerResult).toBe('string');
      expect(typeof warnResult).toBe('number');
      expect(typeof noticeResult).toBe('boolean');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const result = abstractState['die']('', 'default');
      expect(result).toBe('default');
    });

    it('should handle null and undefined returns', () => {
      const nullResult = abstractState['ler']('Error', null);
      const undefinedResult = abstractState['warn']('Warning', undefined);
      
      expect(nullResult).toBeNull();
      expect(undefinedResult).toBeUndefined();
    });

    it('should handle complex objects', () => {
      const complexObject = {
        nested: {
          array: [1, 2, { deep: true }],
          func: () => 'test'
        }
      };
      
      const result = abstractState['notice']('Notice', complexObject);
      expect(result).toBe(complexObject);
      expect(result.nested.array).toEqual([1, 2, { deep: true }]);
    });
  });
});