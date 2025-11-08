import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  msg,
  pre,
  log,
  ler,
  lwa,
  err
} from '../../business.logic/logging';

// Mock window object for the test environment
Object.defineProperty(globalThis, 'window', {
  value: {
    webui: undefined
  },
  writable: true
});

describe('logging.ts', () => {
  // Store original console methods
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Create mock console methods
  const mockConsoleLog = vi.fn();
  const mockConsoleError = vi.fn();
  const mockConsoleWarn = vi.fn();

  // Helper function to set debug mode
  const setDebugMode = (enabled: boolean) => {
    (window as unknown as { webui?: { inDebugMode?: boolean } }).webui = { inDebugMode: enabled };
  };

  const clearWebUI = () => {
    (window as unknown as { webui?: { inDebugMode?: boolean } }).webui = undefined;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Replace console methods with mocks
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    console.warn = mockConsoleWarn;
    
    // Reset window.webui and clear any existing prefix
    clearWebUI();
    // Set debug mode temporarily to clear prefix, then turn off
    setDebugMode(true);
    pre(''); // Clear any existing prefix
    clearWebUI();
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    
    // Clean up window.webui
    clearWebUI();
  });

  describe('msg', () => {
    it('should return message with current prefix', () => {
      setDebugMode(true);
      pre('[TEST] ');
      const result = msg('Hello World');
      expect(result).toBe('[TEST] Hello World');
    });

    it('should return message without prefix when prefix is empty', () => {
      setDebugMode(true);
      pre('');
      const result = msg('Hello World');
      expect(result).toBe('Hello World');
    });

    it('should return message with updated prefix', () => {
      setDebugMode(true);
      pre('[FIRST] ');
      expect(msg('test')).toBe('[FIRST] test');
      
      pre('[SECOND] ');
      expect(msg('test')).toBe('[SECOND] test');
    });

    it('should handle empty message', () => {
      setDebugMode(true);
      pre('[PREFIX] ');
      const result = msg('');
      expect(result).toBe('[PREFIX] ');
    });

    it('should handle special characters in message', () => {
      setDebugMode(true);
      pre('[APP] ');
      const result = msg('Error: Unable to connect to server! @#$%');
      expect(result).toBe('[APP] Error: Unable to connect to server! @#$%');
    });
  });

  describe('pre', () => {
    it('should set message prefix when in debug mode', () => {
      setDebugMode(true);
      
      pre('[DEBUG] ');
      const result = msg('test');
      expect(result).toBe('[DEBUG] test');
    });

    it('should not set prefix when not in debug mode', () => {
      setDebugMode(false);
      
      pre('[DEBUG] ');
      const result = msg('test');
      expect(result).toBe('test'); // No prefix when not in debug mode
    });

    it('should handle undefined prefix', () => {
      setDebugMode(true);
      
      pre(undefined);
      const result = msg('test');
      expect(result).toBe('test');
    });

    it('should handle null prefix', () => {
      setDebugMode(true);
      
      pre(null as unknown as string);
      const result = msg('test');
      expect(result).toBe('test');
    });

    it('should not affect anything when webui is undefined', () => {
      clearWebUI();
      
      pre('[TEST] ');
      const result = msg('test');
      expect(result).toBe('test'); // No prefix when webui is undefined
    });

    it('should handle multiple prefix changes', () => {
      setDebugMode(true);
      
      pre('[FIRST] ');
      expect(msg('test')).toBe('[FIRST] test');
      
      pre('[SECOND] ');
      expect(msg('test')).toBe('[SECOND] test');
      
      pre('');
      expect(msg('test')).toBe('test');
    });
  });

  describe('log', () => {
    it('should log message with prefix when in debug mode', () => {
      setDebugMode(true);
      pre('[LOG] ');
      
      log('test message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('[LOG] ', 'test message');
    });

    it('should not log when not in debug mode', () => {
      setDebugMode(false);
      
      log('test message');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('should not log when webui is undefined', () => {
      clearWebUI();
      
      log('test message');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('should handle multiple arguments', () => {
      setDebugMode(true);
      pre('[APP] ');
      
      log('message', 123, { key: 'value' }, true);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('[APP] ', 'message', 123, { key: 'value' }, true);
    });

    it('should handle no arguments', () => {
      setDebugMode(true);
      pre('[EMPTY] ');
      
      log();
      
      expect(mockConsoleLog).toHaveBeenCalledWith('[EMPTY] ');
    });

    it('should handle complex objects', () => {
      setDebugMode(true);
      pre('[OBJ] ');
      
      const complexObj = {
        nested: { array: [1, 2, 3] },
        func: () => 'test',
        date: new Date('2023-01-01')
      };
      
      log('Complex object:', complexObj);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('[OBJ] ', 'Complex object:', complexObj);
    });
  });

  describe('ler', () => {
    it('should log error with prefix when in debug mode', () => {
      setDebugMode(true);
      pre('[ERROR] ');
      
      ler('error message');
      
      expect(mockConsoleError).toHaveBeenCalledWith('[ERROR] ', 'error message');
    });

    it('should not log error when not in debug mode', () => {
      setDebugMode(false);
      
      ler('error message');
      
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle error objects', () => {
      setDebugMode(true);
      pre('[ERR] ');
      
      const error = new Error('Test error');
      ler('Exception caught:', error);
      
      expect(mockConsoleError).toHaveBeenCalledWith('[ERR] ', 'Exception caught:', error);
    });

    it('should handle multiple error arguments', () => {
      setDebugMode(true);
      pre('[MULTI] ');
      
      ler('Error code:', 500, 'Details:', { status: 'failed' });
      
      expect(mockConsoleError).toHaveBeenCalledWith('[MULTI] ', 'Error code:', 500, 'Details:', { status: 'failed' });
    });
  });

  describe('lwa (lwr)', () => {
    it('should log warning with prefix when in debug mode', () => {
      setDebugMode(true);
      pre('[WARN] ');
      
      lwa('warning message');
      
      expect(mockConsoleWarn).toHaveBeenCalledWith('[WARN] ', 'warning message');
    });

    it('should not log warning when not in debug mode', () => {
      setDebugMode(false);
      
      lwa('warning message');
      
      expect(mockConsoleWarn).not.toHaveBeenCalled();
    });

    it('should handle warning with additional data', () => {
      setDebugMode(true);
      pre('[WARNING] ');
      
      lwa('Deprecated function used:', 'oldFunction()', 'Use newFunction() instead');
      
      expect(mockConsoleWarn).toHaveBeenCalledWith('[WARNING] ', 'Deprecated function used:', 'oldFunction()', 'Use newFunction() instead');
    });
  });

  describe('err', () => {
    it('should throw error with prefix when in debug mode', () => {
      setDebugMode(true);
      pre('[THROW] ');
      
      expect(() => err('critical error')).toThrow('[THROW] critical error');
    });

    it('should not throw error when not in debug mode', () => {
      setDebugMode(false);
      
      expect(() => err('critical error')).not.toThrow();
    });

    it('should not throw when webui is undefined', () => {
      clearWebUI();
      
      expect(() => err('critical error')).not.toThrow();
    });

    it('should throw Error instance with correct message', () => {
      setDebugMode(true);
      pre('[FATAL] ');
      
      try {
        err('Something went wrong');
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('[FATAL] Something went wrong');
      }
    });

    it('should handle empty error message', () => {
      setDebugMode(true);
      pre('[EMPTY_ERR] ');
      
      expect(() => err('')).toThrow('[EMPTY_ERR] ');
    });

    it('should handle special characters in error message', () => {
      setDebugMode(true);
      pre('[SPECIAL] ');
      
      expect(() => err('Error with symbols: @#$%^&*()')).toThrow('[SPECIAL] Error with symbols: @#$%^&*()');
    });
  });

  describe('Integration scenarios', () => {
    it('should work together in a typical logging workflow', () => {
      window.webui = { inDebugMode: true };
      
      // Set prefix for a component
      pre('[UserService] ');
      
      // Log some info
      log('Starting user authentication');
      expect(mockConsoleLog).toHaveBeenCalledWith('[UserService] ', 'Starting user authentication');
      
      // Log a warning
      lwa('User email not verified');
      expect(mockConsoleWarn).toHaveBeenCalledWith('[UserService] ', 'User email not verified');
      
      // Change context
      pre('[AuthService] ');
      
      // Log an error
      ler('Authentication failed', { reason: 'invalid_token' });
      expect(mockConsoleError).toHaveBeenCalledWith('[AuthService] ', 'Authentication failed', { reason: 'invalid_token' });
      
      // Test message formatting
      const formattedMsg = msg('Operation completed');
      expect(formattedMsg).toBe('[AuthService] Operation completed');
    });

    it('should handle debug mode toggling', () => {
      // Start in debug mode
      window.webui = { inDebugMode: true };
      pre('[DEBUG] ');
      
      log('Debug message 1');
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
      
      // Turn off debug mode
      window.webui.inDebugMode = false;
      
      log('Debug message 2');
      expect(mockConsoleLog).toHaveBeenCalledTimes(1); // Still only 1 call
      
      // Turn debug mode back on
      window.webui.inDebugMode = true;
      
      log('Debug message 3');
      expect(mockConsoleLog).toHaveBeenCalledTimes(2); // Now 2 calls
    });

    it('should handle prefix changes during logging session', () => {
      window.webui = { inDebugMode: true };
      
      // Component A
      pre('[ComponentA] ');
      log('Message from A');
      expect(mockConsoleLog).toHaveBeenLastCalledWith('[ComponentA] ', 'Message from A');
      
      // Component B
      pre('[ComponentB] ');
      ler('Error from B');
      expect(mockConsoleError).toHaveBeenLastCalledWith('[ComponentB] ', 'Error from B');
      
      // Back to no prefix
      pre('');
      lwa('Warning without prefix');
      expect(mockConsoleWarn).toHaveBeenLastCalledWith('', 'Warning without prefix');
    });

    it('should maintain performance when debug mode is off', () => {
      window.webui = { inDebugMode: false };
      
      // These should all be no-ops
      pre('[PERFORMANCE] ');
      log('Message 1');
      ler('Error 1');
      lwa('Warning 1');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
      expect(mockConsoleWarn).not.toHaveBeenCalled();
      
      // But msg should still work for other purposes
      const message = msg('Test');
      expect(message).toBe('Test'); // No prefix when not in debug mode
    });
  });
});