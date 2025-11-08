import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  set_error_id,
  get_error_code,
  set_date_error_code,
  set_status_error_code,
  format_json_code,
  color_json_code,
  to_jsonapi_error
} from '../../business.logic/errors';

// Create simple mock types
interface MockJsonapiError {
  id?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: { pointer?: string };
  meta?: Record<string, unknown>;
}

interface MockTheme {
  palette: {
    success: { main: string };
    info: { main: string };
    warning: { main: string };
    error: { main: string };
    text: { secondary: string };
  };
}

// Mock Redux dependencies
vi.mock('../state', () => ({
  dispatch: vi.fn(),
  get_state: vi.fn(() => ({ errors: [] }))
}));

vi.mock('../slices/errors.slice', () => ({
  errorsActions: {
    errorsAdd: vi.fn(error => ({ type: 'errors/add', payload: error })),
    errorsClear: vi.fn(() => ({ type: 'errors/clear' }))
  }
}));

// Mock logging
vi.mock('../../business.logic/logging', () => ({
  ler: vi.fn()
}));

// Mock utility
vi.mock('../../business.logic/utility', () => ({
  get_val: vi.fn((_obj, path) => {
    if (path === 'staticRegistry') return { '2': 'someValue' };
    return undefined;
  })
}));

describe('errors.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.webui for debug mode tests
    Object.defineProperty(window, 'webui', {
      value: { inDebugMode: true },
      writable: true
    });
  });

  describe('get_error_code', () => {
    it('should return existing error code', () => {
      const error: MockJsonapiError = {
        code: 'CUSTOM_ERROR',
        title: 'Test Error'
      };
      
      expect(get_error_code(error as Parameters<typeof get_error_code>[0])).toBe('CUSTOM_ERROR');
    });

    it('should return timestamp when no code exists', () => {
      const error: MockJsonapiError = {
        title: 'Test Error'
      };
      
      const code = get_error_code(error as Parameters<typeof get_error_code>[0]);
      expect(typeof code).toBe('string');
      expect(parseInt(code)).toBeGreaterThan(0);
    });

    it('should return timestamp for undefined error', () => {
      const code = get_error_code(undefined);
      expect(typeof code).toBe('string');
      expect(parseInt(code)).toBeGreaterThan(0);
    });
  });

  describe('set_date_error_code', () => {
    it('should not overwrite existing error code', () => {
      const error: MockJsonapiError = {
        code: 'EXISTING_CODE',
        title: 'Test Error'
      };
      
      set_date_error_code(error as Parameters<typeof set_date_error_code>[0]);
      expect(error.code).toBe('EXISTING_CODE');
    });

    it('should set default code when missing', () => {
      const error: MockJsonapiError = {
        title: 'Test Error'
      };
      
      set_date_error_code(error as Parameters<typeof set_date_error_code>[0]);
      expect(error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('set_status_error_code', () => {
    it('should not overwrite existing error code', () => {
      const error: MockJsonapiError = {
        code: 'EXISTING_CODE',
        title: 'Test Error'
      };
      
      set_status_error_code(error as Parameters<typeof set_status_error_code>[0]);
      expect(error.code).toBe('EXISTING_CODE');
    });

    it('should set default code when missing', () => {
      const error: MockJsonapiError = {
        title: 'Test Error'
      };
      
      set_status_error_code(error as Parameters<typeof set_status_error_code>[0]);
      expect(error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('format_json_code', () => {
    it('should format object to HTML-escaped JSON', () => {
      const obj = {
        name: 'John',
        age: 30,
        nested: {
          value: true
        }
      };
      
      const result = format_json_code(obj);
      expect(result).toContain('&nbsp;');
      expect(result).toContain('<br>');
      expect(result).toContain('"name":&nbsp;"John"');
    });

    it('should format string input', () => {
      const str = 'Simple\nstring\twith\nspecial chars';
      const result = format_json_code(str);
      
      expect(result).toContain('<br>');
      expect(result).toContain('&nbsp;');
    });

    it('should handle empty object', () => {
      const result = format_json_code({});
      expect(result).toBe('{<br>}');
    });

    it('should handle complex nested objects', () => {
      const complex = {
        array: [1, 2, 3],
        nested: {
          deep: {
            value: 'test'
          }
        }
      };
      
      const result = format_json_code(complex);
      expect(result).toContain('"array":');
      expect(result).toContain('"nested":');
      expect(result).toContain('"deep":');
    });
  });

  describe('color_json_code', () => {
    const mockTheme: MockTheme = {
      palette: {
        success: { main: '#4caf50' },
        info: { main: '#2196f3' },
        warning: { main: '#ff9800' },
        error: { main: '#f44336' },
        text: { secondary: '#666' }
      }
    };

    it('should apply color highlighting to object', () => {
      const obj = {
        stringValue: 'test',
        numberValue: 42,
        booleanValue: true,
        nullValue: null
      };
      
      const result = color_json_code(obj, mockTheme as Parameters<typeof color_json_code>[1]);
      
      expect(result).toContain(`style="color: ${mockTheme.palette.success.main}"`);
      expect(result).toContain(`style="color: ${mockTheme.palette.info.main}"`);
      expect(result).toContain(`style="color: ${mockTheme.palette.warning.main}"`);
      expect(result).toContain(`style="color: ${mockTheme.palette.error.main}"`);
    });

    it('should apply color highlighting to string', () => {
      const jsonStr = '{"name": "John", "age": 30}';
      const result = color_json_code(jsonStr, mockTheme as Parameters<typeof color_json_code>[1]);
      
      expect(result).toContain('<span style=');
      expect(result).toContain(mockTheme.palette.success.main);
    });

    it('should return empty string for array input', () => {
      const result = color_json_code([1, 2, 3] as Parameters<typeof color_json_code>[0], mockTheme as Parameters<typeof color_json_code>[1]);
      expect(result).toBe('');
    });

    it('should return empty string for null input', () => {
      const result = color_json_code(null as unknown as Parameters<typeof color_json_code>[0], mockTheme as Parameters<typeof color_json_code>[1]);
      expect(result).toBe('');
    });
  });

  describe('to_jsonapi_error', () => {
    it('should convert Error object to jsonapi error', () => {
      const error = new Error('Test error message');
      error.stack = 'Error stack trace';
      
      const result = to_jsonapi_error(error);
      
      expect(result.code).toBe('EXCEPTION');
      expect(result.title).toBe('Test error message');
      expect(result.detail).toBe('Error stack trace');
      expect(result.id).toBeDefined();
    });

    it('should use custom title when provided', () => {
      const error = new Error('Original message');
      const result = to_jsonapi_error(error, 'Custom title');
      
      expect(result.title).toBe('Custom title');
    });

    it('should include meta data when provided', () => {
      const error = new Error('Test error');
      const meta = { userId: '123', action: 'save' };
      
      const result = to_jsonapi_error(error, undefined, meta);
      
      expect(result.meta).toEqual(meta);
    });

    it('should use set error ID when available', () => {
      set_error_id(999);
      const error = new Error('Test error');
      
      const result = to_jsonapi_error(error);
      
      expect(result.id).toBe('999');
    });
  });
});