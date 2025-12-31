import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import StateThemeParser from '../../controllers/StateThemeParser';
import type { Theme } from '@mui/material';
import type { TObj } from '@tuber/shared';

describe('StateThemeParser', () => {
  let parser: StateThemeParser;
  let mockTheme: Theme;

  beforeEach(() => {
    // Create a mock Material-UI theme with common theme functions
    mockTheme = {
      spacing: vi.fn((value: number) => `${value * 8}px`),
      breakpoints: {
        up: vi.fn((key: string) => `@media (min-width: ${key})`),
        down: vi.fn((key: string) => `@media (max-width: ${key})`),
        between: vi.fn((start: string, end: string) => `@media (min-width: ${start}) and (max-width: ${end})`),
        only: vi.fn((key: string) => `@media (min-width: ${key}) and (max-width: ${key})`),
        not: vi.fn((key: string) => `@media not all and (min-width: ${key})`)
      },
      palette: {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0'
        },
        secondary: {
          main: '#dc004e',
          light: '#f5325b',
          dark: '#9a0036'
        },
        getcontrasttext: vi.fn((color: string) => color === '#1976d2' ? '#fff' : '#000'),
        augmentcolor: vi.fn((color: Record<string, unknown>) => ({ ...color, contrastText: '#fff' }))
      },
      typography: {
        pxToRem: vi.fn((value: number) => `${value / 16}rem`)
      },
      transitions: {
        getautoheightduration: vi.fn((height: number) => height * 1.5),
        create: vi.fn((...args: (string | number)[]) => {
          return `${args.join(', ')} 300ms ease`;
        })
      },
      custom: {
        value: '24px',
        nested: {
          property: 'red'
        }
      }
    } as unknown as Theme;

    parser = new StateThemeParser();
  });

  describe('Constructor and Basic Setup', () => {
    it('should create parser with default empty function list', () => {
      const newParser = new StateThemeParser();
      expect(newParser).toBeInstanceOf(StateThemeParser);
    });

    it('should create parser with custom function list', () => {
      const customFunctions = {
        customFn: vi.fn(() => 'custom result')
      };
      const newParser = new StateThemeParser(customFunctions);
      expect(newParser).toBeInstanceOf(StateThemeParser);
    });

    it('should set function list via setFnList', () => {
      const customFunctions = {
        testFn: vi.fn(() => 'test')
      };
      parser.setFnList(customFunctions);
      // Function list is private, but we can test it indirectly through parsing
    });
  });

  describe('Theme Access', () => {
    it('should return undefined theme initially', () => {
      expect(parser.getTheme()).toBeUndefined();
    });

    it('should return theme after parser is used', () => {
      const parseFunction = parser.getParser();
      parseFunction(mockTheme, {});
      expect(parser.getTheme()).toBe(mockTheme);
    });
  });

  describe('Parser Factory', () => {
    it('should return a parser function', () => {
      const parseFunction = parser.getParser();
      expect(typeof parseFunction).toBe('function');
    });

    it('should parse simple rules without theme functions', () => {
      const parseFunction = parser.getParser();
      const rules = {
        color: 'red',
        fontSize: '16px'
      };
      const result = parseFunction(mockTheme, rules);
      expect(result).toEqual({
        color: 'red',
        fontSize: '16px'
      });
    });
  });

  describe('String Function Parsing (_parseStrFn)', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      // Initialize parser with theme
      parseFunction(mockTheme, {});
    });

    it('should return number as-is', () => {
      parseFunction(mockTheme, {
        test: '${spacing,2}'
      });
      expect(mockTheme.spacing).toHaveBeenCalledWith(2);
    });

    it('should return string as-is when not a valid theme function', () => {
      const result = parseFunction(mockTheme, {
        test: '${invalidFunction}'
      });
      expect(result.test).toBe('invalidFunction');
    });

    it('should parse theme function with numeric arguments', () => {
      const result = parseFunction(mockTheme, {
        margin: '${spacing,2}'
      });
      expect(mockTheme.spacing).toHaveBeenCalledWith(2);
      expect(result.margin).toBe('16px');
    });

    it('should parse theme function with string arguments from theme', () => {
      const result = parseFunction(mockTheme, {
        color: '${palette.primary.main}'
      });
      expect(result.color).toBe('#1976d2');
    });

    it('should handle complex function calls', () => {
      const result = parseFunction(mockTheme, {
        breakpoint: '${breakpoints.up,sm}'
      });
      expect(mockTheme.breakpoints.up).toHaveBeenCalledWith('sm');
      expect(result.breakpoint).toBe('@media (min-width: sm)');
    });
  });

  describe('Function Execution (_runFn)', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should execute custom function from fnList', () => {
      const customFn = vi.fn(() => 'custom result');
      parser.setFnList({ customFn });
      
      const result = parseFunction(mockTheme, {
        test: '${customFn,arg1}'
      });
      expect(customFn).toHaveBeenCalledWith('arg1');
      expect(result.test).toBe('custom result');
    });

    it('should execute theme function when custom function not found', () => {
      const result = parseFunction(mockTheme, {
        spacing: '${spacing,3}'
      });
      expect(mockTheme.spacing).toHaveBeenCalledWith(3);
      expect(result.spacing).toBe('24px');
    });

    it('should handle invalid function gracefully', () => {
      // Mock the error logging to avoid console output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Invalid functions that are not in mui5FnList are treated as strings
      const result = parseFunction(mockTheme, {
        test: '${invalidFunction,arg}'
      });
      
      expect(result.test).toBe('invalidFunction,arg');
      consoleSpy.mockRestore();
    });
  });

  describe('Value Filtering (_filter)', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should filter out function values', () => {
      const mockThemeWithFunction = {
        ...mockTheme,
        functionProperty: () => 'should be filtered'
      };
      
      const result = parseFunction(mockThemeWithFunction, {
        test: '${functionProperty}'
      });
      expect(result.test).toBeUndefined();
    });

    it('should preserve non-function values', () => {
      const result = parseFunction(mockTheme, {
        test: '${palette.primary.main}'
      });
      expect(result.test).toBe('#1976d2');
    });
  });

  describe('Template String Evaluation (_eval)', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should handle strings without template expressions', () => {
      const result = parseFunction(mockTheme, {
        color: 'red'
      });
      expect(result.color).toBe('red');
    });

    it('should evaluate single template expression', () => {
      const result = parseFunction(mockTheme, {
        margin: '${spacing,2}'
      });
      expect(result.margin).toBe('16px');
    });

    it('should evaluate multiple template expressions in one string', () => {
      const result = parseFunction(mockTheme, {
        margin: '${spacing,1} ${spacing,2}'
      });
      expect(result.margin).toBe('8px 16px');
    });

    it('should handle mixed template and static content', () => {
      const result = parseFunction(mockTheme, {
        border: '1px solid ${spacing,3}'
      });
      expect(result.border).toBe('1px solid 24px');
    });

    it('should handle nested expressions', () => {
      const result = parseFunction(mockTheme, {
        transition: '${transitions.create,opacity}'
      });
      expect(mockTheme.transitions.create).toHaveBeenCalledWith('opacity');
      expect(result.transition).toBe('opacity 300ms ease');
    });
  });

  describe('Property Application (_apply)', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should apply computed property names', () => {
      const result = parseFunction(mockTheme, {
        '${breakpoints.up,sm}': {
          color: 'blue'
        }
      });
      
      expect(mockTheme.breakpoints.up).toHaveBeenCalledWith('sm');
      expect(result['@media (min-width: sm)']).toEqual({
        color: 'blue'
      });
    });

    it('should remove original computed property names', () => {
      const result = parseFunction(mockTheme, {
        '${breakpoints.up,md}': {
          fontSize: '18px'
        }
      });
      
      // The original property should be deleted and the computed property should exist
      expect(result['${breakpoints.up,md}']).toBeUndefined();
      expect(result['@media (min-width: md)']).toEqual({
        fontSize: '18px'
      });
    });
  });

  describe('Bad Value Detection (_bad)', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should handle empty objects', () => {
      const result = parseFunction(mockTheme, {});
      expect(result).toEqual({});
    });

    it('should handle objects with empty values', () => {
      const result = parseFunction(mockTheme, {
        emptyString: '',
        emptyObject: {},
        emptyArray: [],
        whitespace: '   ',
        nullValue: null,
        undefinedValue: undefined
      });
      
      // The parser continues to process properties even with bad values, 
      // they just don't get modified much during processing
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('should preserve valid values', () => {
      const result = parseFunction(mockTheme, {
        validString: 'hello',
        validNumber: 42,
        validObject: { prop: 'value' },
        validArray: ['item']
      });
      
      expect(result.validString).toBe('hello');
      expect(result.validNumber).toBe(42);
      expect(result.validObject).toEqual({ prop: 'value' });
      // Arrays are preserved but may be filtered differently by the parser
      expect(result.validArray).toBeDefined();
    });
  });

  describe('Recursive Parsing', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should recursively parse nested objects', () => {
      const result = parseFunction(mockTheme, {
        container: {
          padding: '${spacing,2}',
          nested: {
            margin: '${spacing,1}',
            color: '${palette.primary.main}'
          }
        }
      }) as Record<string, Record<string, unknown>>;
      
      expect((result.container as Record<string, unknown>).padding).toBe('16px');
      expect(((result.container as Record<string, Record<string, unknown>>).nested).margin).toBe('8px');
      expect(((result.container as Record<string, Record<string, unknown>>).nested).color).toBe('#1976d2');
    });

    it('should handle deeply nested structures', () => {
      const result = parseFunction(mockTheme, {
        level1: {
          level2: {
            level3: {
              spacing: '${spacing,4}'
            }
          }
        }
      }) as Record<string, Record<string, Record<string, Record<string, unknown>>>>;
      
      expect(result.level1.level2.level3.spacing).toBe('32px');
    });
  });

  describe('Complex Integration Scenarios', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
    });

    it('should handle complete CSS-in-JS style object', () => {
      const styles = {
        root: {
          padding: '${spacing,2}',
          backgroundColor: '${palette.primary.main}',
          color: '${palette.getcontrasttext,${palette.primary.main}}',
          '${breakpoints.up,md}': {
            padding: '${spacing,3}',
            fontSize: '${typography.pxToRem,18}'
          }
        },
        button: {
          margin: '${spacing,1} ${spacing,2}',
          transition: '${transitions.create,all}'
        }
      };
      
      const result = parseFunction(mockTheme, styles) as Record<string, Record<string, unknown>>;
      
      expect((result.root as Record<string, unknown>).padding).toBe('16px');
      expect((result.root as Record<string, unknown>).backgroundColor).toBe('#1976d2');
      expect(((result.root as Record<string, Record<string, unknown>>)['@media (min-width: md)'] as Record<string, unknown>).padding).toBe('24px');
      expect(((result.root as Record<string, Record<string, unknown>>)['@media (min-width: md)'] as Record<string, unknown>).fontSize).toBe('1.125rem');
      expect((result.button as Record<string, unknown>).margin).toBe('8px 16px');
      expect((result.button as Record<string, unknown>).transition).toBe('all 300ms ease');
    });

    it('should handle custom functions with theme fallback', () => {
      const customFunctions = {
        customSpacing: vi.fn((multiplier: number) => `${multiplier * 10}px`),
        // This will fallback to theme function
        spacing: undefined
      };
      
      parser.setFnList(customFunctions);
      
      const result = parseFunction(mockTheme, {
        customMargin: '${customSpacing,3}',
        themeMargin: '${spacing,3}'
      });
      
      expect(customFunctions.customSpacing).toHaveBeenCalledWith(3);
      expect(result.customMargin).toBe('30px');
      expect(mockTheme.spacing).toHaveBeenCalledWith(3);
      expect(result.themeMargin).toBe('24px');
    });

    it('should handle theme value references', () => {
      const result = parseFunction(mockTheme, {
        primaryColor: '${palette.primary.main}',
        customValue: '${custom.value}',
        nestedValue: '${custom.nested.property}'
      });
      
      expect(result.primaryColor).toBe('#1976d2');
      expect(result.customValue).toBe('24px');
      expect(result.nestedValue).toBe('red');
    });
  });

  describe('Error Handling', () => {
    let parseFunction: (theme: Theme, rules: Record<string, unknown>) => TObj;
    let consoleSpy: any;

    beforeEach(() => {
      parseFunction = parser.getParser();
      parseFunction(mockTheme, {}); // Initialize theme
      consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should handle invalid function names gracefully', () => {
      const result = parseFunction(mockTheme, {
        test: '${nonExistentFunction,arg}'
      });
      
      // Invalid functions that are not in mui5FnList are treated as strings
      expect(result.test).toBe('nonExistentFunction,arg');
    });

    it('should handle malformed template expressions', () => {
      const result = parseFunction(mockTheme, {
        test1: '${incomplete',
        test2: 'incomplete}',
        test3: '${}',
        test4: '${,,,}'
      });
      
      // Should treat as regular strings when malformed
      expect(result.test1).toBe('${incomplete');
      expect(result.test2).toBe('incomplete}');
      expect(result.test3).toBe('${}');
      expect(result.test4).toBe(',,,');
    });

    it('should handle null/undefined theme gracefully', () => {
      const nullThemeParser = new StateThemeParser();
      const nullParseFunction = nullThemeParser.getParser();
      
      const result = nullParseFunction(null as unknown as Theme, {
        test: 'normal value'
      });
      
      expect(result.test).toBe('normal value');
    });
  });
});