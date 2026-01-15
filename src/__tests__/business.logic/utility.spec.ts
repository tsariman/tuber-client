import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  is_object,
  is_record,
  is_struct,
  non_empty_string,
  is_number,
  get_val,
  safely_get_as,
  get_global_var,
  mongo_object_id,
  get_themed_state,
  resolve_unexpected_nesting,
  get_viewport_size,
  stretch_to_bottom
} from '../../business.logic/utility';

describe('utility.ts', () => {
  describe('Type Guards', () => {
    describe('is_object', () => {
      it('should return true for plain objects', () => {
        expect(is_object({})).toBe(true);
        expect(is_object({ a: 1 })).toBe(true);
        expect(is_object(new Date())).toBe(true);
      });

      it('should return false for non-objects', () => {
        expect(is_object(null)).toBe(false);
        expect(is_object(undefined)).toBe(false);
        expect(is_object([])).toBe(false);
        expect(is_object([1, 2, 3])).toBe(false);
        expect(is_object('string')).toBe(false);
        expect(is_object(123)).toBe(false);
        expect(is_object(true)).toBe(false);
      });
    });

    describe('is_record', () => {
      it('should return true for objects that can be used as records', () => {
        expect(is_record({})).toBe(true);
        expect(is_record({ a: 1 })).toBe(true);
        expect(is_record(new Date())).toBe(true);
      });

      it('should return false for non-record types', () => {
        expect(is_record(null)).toBe(false);
        expect(is_record(undefined)).toBe(false);
        expect(is_record([])).toBe(false);
        expect(is_record('string')).toBe(false);
        expect(is_record(123)).toBe(false);
        expect(is_record(true)).toBe(false);
      });
    });

    describe('is_struct', () => {
      it('should return true for objects and arrays', () => {
        expect(is_struct({})).toBe(true);
        expect(is_struct({ a: 1 })).toBe(true);
        expect(is_struct([])).toBe(true);
        expect(is_struct([1, 2, 3])).toBe(true);
        expect(is_struct(new Date())).toBe(true);
      });

      it('should return false for primitives and null', () => {
        expect(is_struct(null)).toBe(false);
        expect(is_struct(undefined)).toBe(false);
        expect(is_struct('string')).toBe(false);
        expect(is_struct(123)).toBe(false);
        expect(is_struct(true)).toBe(false);
      });
    });

    describe('non_empty_string', () => {
      it('should return true for non-empty strings', () => {
        expect(non_empty_string('hello')).toBe(true);
        expect(non_empty_string('123')).toBe(true);
      });

      it('should return false for empty strings', () => {
        expect(non_empty_string('')).toBe(false);
      });

      it('should return false for non-strings', () => {
        expect(non_empty_string(123)).toBe(false);
        expect(non_empty_string(true)).toBe(false);
        expect(non_empty_string({})).toBe(false);
        expect(non_empty_string([])).toBe(false);
        expect(non_empty_string(null)).toBe(false);
        expect(non_empty_string(undefined)).toBe(false);
      });
    });

    describe('is_number', () => {
      it('should return true for finite numbers', () => {
        expect(is_number(0)).toBe(true);
        expect(is_number(123)).toBe(true);
        expect(is_number(-456)).toBe(true);
        expect(is_number(3.14)).toBe(true);
        expect(is_number(Infinity)).toBe(true);
      });

      it('should return false for NaN', () => {
        expect(is_number(NaN)).toBe(false);
      });

      it('should return false for non-numbers', () => {
        expect(is_number('123')).toBe(false);
        expect(is_number(true)).toBe(false);
        expect(is_number({})).toBe(false);
        expect(is_number([])).toBe(false);
        expect(is_number(null)).toBe(false);
        expect(is_number(undefined)).toBe(false);
      });
    });
  });

  describe('get_val', () => {
    const testObj = {
      user: {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'Springfield'
        },
        hobbies: ['reading', 'swimming']
      },
      count: 42,
      isActive: true,
      items: [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' }
      ]
    };

    it('should get simple property values', () => {
      expect(get_val(testObj, 'count')).toBe(42);
      expect(get_val(testObj, 'isActive')).toBe(true);
    });

    it('should get nested property values', () => {
      expect(get_val(testObj, 'user.name')).toBe('John');
      expect(get_val(testObj, 'user.address.street')).toBe('123 Main St');
      expect(get_val(testObj, 'user.address.city')).toBe('Springfield');
    });

    it('should get array values by index', () => {
      expect(get_val(testObj, 'user.hobbies.0')).toBe('reading');
      expect(get_val(testObj, 'user.hobbies.1')).toBe('swimming');
      expect(get_val(testObj, 'items.0.name')).toBe('item1');
      expect(get_val(testObj, 'items.1.id')).toBe(2);
    });

    it('should return undefined for non-existent paths', () => {
      expect(get_val(testObj, 'nonexistent')).toBeUndefined();
      expect(get_val(testObj, 'user.nonexistent')).toBeUndefined();
      expect(get_val(testObj, 'user.address.nonexistent')).toBeUndefined();
      expect(get_val(testObj, 'user.hobbies.5')).toBeUndefined();
    });

    it('should handle invalid inputs', () => {
      expect(get_val(null, 'path')).toBeUndefined();
      expect(get_val(undefined, 'path')).toBeUndefined();
      expect(get_val('string', 'path')).toBeUndefined();
      expect(get_val(123, 'path')).toBeUndefined();
    });

    it('should handle invalid paths', () => {
      expect(get_val(testObj, '')).toBeUndefined();
      expect(get_val(testObj, '   ')).toBeUndefined();
      expect(get_val(testObj, 'user..name')).toBeUndefined();
      expect(get_val(testObj, '.user.name')).toBeUndefined();
      expect(get_val(testObj, 'user.name.')).toBeUndefined();
    });

    it('should handle invalid array indices', () => {
      expect(get_val(testObj, 'user.hobbies.-1')).toBeUndefined();
      expect(get_val(testObj, 'user.hobbies.abc')).toBeUndefined();
      expect(get_val(testObj, 'user.hobbies.1.5')).toBeUndefined();
    });

    it('should return falsy values correctly', () => {
      const objWithFalsy = {
        zero: 0,
        empty: '',
        false: false,
        nested: {
          null: null
        }
      };
      
      expect(get_val(objWithFalsy, 'zero')).toBe(0);
      expect(get_val(objWithFalsy, 'empty')).toBe('');
      expect(get_val(objWithFalsy, 'false')).toBe(false);
      expect(get_val(objWithFalsy, 'nested.null')).toBe(null);
    });
  });

  describe('safely_get_as', () => {
    const testObj = {
      name: 'John',
      age: 30,
      address: {
        city: 'Springfield'
      }
    };

    it('should return the value when it exists', () => {
      expect(safely_get_as(testObj, 'name', 'default')).toBe('John');
      expect(safely_get_as(testObj, 'age', 0)).toBe(30);
      expect(safely_get_as(testObj, 'address.city', 'default')).toBe('Springfield');
    });

    it('should return the default when value does not exist', () => {
      expect(safely_get_as(testObj, 'nonexistent', 'default')).toBe('default');
      expect(safely_get_as(testObj, 'address.nonexistent', 'default')).toBe('default');
    });

    it('should return the value if defined, else default', () => {
      const objWithFalsy = {
        zero: 0,
        empty: '',
        false: false,
        null: null,
        undefined: undefined
      };
      
      expect(safely_get_as(objWithFalsy, 'zero', 42)).toBe(0);
      expect(safely_get_as(objWithFalsy, 'empty', 'fallback')).toBe('');
      expect(safely_get_as(objWithFalsy, 'false', true)).toBe(false);
      expect(safely_get_as(objWithFalsy, 'null', 'fallback')).toBe('fallback');
      expect(safely_get_as(objWithFalsy, 'undefined', 'fallback')).toBe('fallback');
    });

    it('should handle invalid objects', () => {
      expect(safely_get_as(null, 'path', 'default')).toBe('default');
      expect(safely_get_as(undefined, 'path', 'default')).toBe('default');
    });
  });

  describe('get_global_var', () => {
    beforeEach(() => {
      // Clear any existing test properties
      delete (window as any).testVar;
      delete (window as any).testObj;
    });

    it('should return global variable when it exists', () => {
      (window as any).testVar = 'test value';
      expect(get_global_var('testVar')).toBe('test value');
    });

    it('should return object when global variable is an object', () => {
      const testObj = { a: 1, b: 2 };
      (window as any).testObj = testObj;
      expect(get_global_var('testObj')).toBe(testObj);
    });

    it('should return undefined when variable does not exist', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = get_global_var('nonExistentVar');
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Global variable "nonExistentVar" does not exist.');
      consoleSpy.mockRestore();
    });
  });

  describe('mongo_object_id', () => {
    it('should generate a valid ObjectId-like string', () => {
      const id = mongo_object_id();
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(24);
      expect(/^[0-9a-f]{24}$/.test(id)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const id1 = mongo_object_id();
      const id2 = mongo_object_id();
      expect(id1).not.toBe(id2);
    });

    it('should start with a timestamp', () => {
      const beforeTime = Math.floor(Date.now() / 1000);
      const id = mongo_object_id();
      const afterTime = Math.floor(Date.now() / 1000);
      
      const timestamp = parseInt(id.substring(0, 8), 16);
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('get_themed_state', () => {
    const mainState = { color: 'blue' };
    const lightState = { color: 'white' };
    const darkState = { color: 'black' };

    it('should return dark state when mode is dark and both light and dark are provided', () => {
      const result = get_themed_state('dark', mainState, lightState, darkState);
      expect(result).toBe(darkState);
    });

    it('should return light state when mode is light and both light and dark are provided', () => {
      const result = get_themed_state('light', mainState, lightState, darkState);
      expect(result).toBe(lightState);
    });

    it('should return main state when light is not provided', () => {
      const result = get_themed_state('light', mainState, null, darkState);
      expect(result).toBe(mainState);
    });

    it('should return main state when dark is not provided', () => {
      const result = get_themed_state('dark', mainState, lightState, null);
      expect(result).toBe(mainState);
    });

    it('should return main state when neither light nor dark are provided', () => {
      const result = get_themed_state('dark', mainState, null, null);
      expect(result).toBe(mainState);
    });
  });

  describe('resolve_unexpected_nesting', () => {
    it('should return response.response when response has nested response property', () => {
      const nestedResponse = {
        response: { data: 'actual data' }
      };
      const result = resolve_unexpected_nesting(nestedResponse);
      expect(result).toEqual({ data: 'actual data' });
    });

    it('should return original response when no nesting detected', () => {
      const normalResponse = { data: 'actual data' };
      const result = resolve_unexpected_nesting(normalResponse);
      expect(result).toBe(normalResponse);
    });

    it('should return original response for non-objects', () => {
      expect(resolve_unexpected_nesting('string')).toBe('string');
      expect(resolve_unexpected_nesting(123)).toBe(123);
      expect(resolve_unexpected_nesting(null)).toBe(null);
      expect(resolve_unexpected_nesting(undefined)).toBe(undefined);
    });

    it('should return original response for arrays', () => {
      const arrayResponse = [1, 2, 3];
      const result = resolve_unexpected_nesting(arrayResponse);
      expect(result).toBe(arrayResponse);
    });
  });

  describe('get_viewport_size', () => {
    it('should return viewport size using innerWidth/innerHeight when available', () => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;
      
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
      
      const size = get_viewport_size();
      expect(size.width).toBe(1024);
      expect(size.height).toBe(768);
      
      // Restore original values
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
    });
  });

  describe('stretch_to_bottom', () => {
    it('should calculate correct height by subtracting bottom margin from viewport height', () => {
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
      
      const result = stretch_to_bottom(100);
      expect(result).toBe(900);
      
      const result2 = stretch_to_bottom(200);
      expect(result2).toBe(800);
      
      // Restore
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
    });

    it('should handle zero bottom margin', () => {
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
      
      const result = stretch_to_bottom(0);
      expect(result).toBe(1000);
      
      // Restore
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
    });
  });
});