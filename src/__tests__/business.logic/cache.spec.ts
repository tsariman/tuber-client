import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import {
  get_last_content_jsx,
  save_content_jsx,
  clear_last_content_jsx,
  save_content_refresh_key,
  get_content_refresh_key
} from '../../business.logic/cache';

describe('cache.ts', () => {
  beforeEach(() => {
    // Clear cache before each test
    clear_last_content_jsx();
    save_content_refresh_key(-1);
  });

  describe('JSX Content Caching', () => {
    describe('save_content_jsx and get_last_content_jsx', () => {
      it('should save and retrieve JSX content', () => {
        const testElement = React.createElement('div', { key: 'test' }, 'Test Content');
        
        // Initially should be null
        expect(get_last_content_jsx()).toBeNull();
        
        // Save content
        save_content_jsx(testElement);
        
        // Retrieve should return the same element
        const retrieved = get_last_content_jsx();
        expect(retrieved).toBe(testElement);
        expect(retrieved?.type).toBe('div');
        expect(retrieved?.key).toBe('test');
      });

      it('should handle null content', () => {
        const testElement = React.createElement('span', null, 'Test');
        save_content_jsx(testElement);
        expect(get_last_content_jsx()).toBe(testElement);
        
        // Save null
        save_content_jsx(null);
        expect(get_last_content_jsx()).toBeNull();
      });

      it('should overwrite previous content', () => {
        const element1 = React.createElement('div', { id: 'first' }, 'First');
        const element2 = React.createElement('span', { id: 'second' }, 'Second');
        
        save_content_jsx(element1);
        expect(get_last_content_jsx()).toBe(element1);
        
        save_content_jsx(element2);
        expect(get_last_content_jsx()).toBe(element2);
        expect(get_last_content_jsx()).not.toBe(element1);
      });

      it('should handle complex JSX structures', () => {
        const complexElement = React.createElement(
          'div',
          { className: 'container' },
          React.createElement('h1', null, 'Title'),
          React.createElement('p', null, 'Paragraph'),
          React.createElement('ul', null,
            React.createElement('li', null, 'Item 1'),
            React.createElement('li', null, 'Item 2')
          )
        );
        
        save_content_jsx(complexElement);
        const retrieved = get_last_content_jsx();
        
        expect(retrieved).toBe(complexElement);
        expect(retrieved?.type).toBe('div');
        expect(retrieved?.props.className).toBe('container');
      });
    });

    describe('clear_last_content_jsx', () => {
      it('should clear saved content', () => {
        const testElement = React.createElement('div', null, 'Test');
        save_content_jsx(testElement);
        expect(get_last_content_jsx()).toBe(testElement);
        
        clear_last_content_jsx();
        expect(get_last_content_jsx()).toBeNull();
      });

      it('should handle clearing when no content is saved', () => {
        expect(get_last_content_jsx()).toBeNull();
        clear_last_content_jsx();
        expect(get_last_content_jsx()).toBeNull();
      });

      it('should allow saving new content after clearing', () => {
        const element1 = React.createElement('div', null, 'First');
        const element2 = React.createElement('span', null, 'Second');
        
        save_content_jsx(element1);
        clear_last_content_jsx();
        save_content_jsx(element2);
        
        expect(get_last_content_jsx()).toBe(element2);
      });
    });
  });

  describe('Refresh Key Management', () => {
    describe('save_content_refresh_key and get_content_refresh_key', () => {
      it('should save and retrieve refresh key', () => {
        // Initial value should be -1
        expect(get_content_refresh_key()).toBe(-1);
        
        // Save a refresh key
        save_content_refresh_key(5);
        expect(get_content_refresh_key()).toBe(5);
      });

      it('should handle default value when no argument provided', () => {
        save_content_refresh_key();
        expect(get_content_refresh_key()).toBe(0);
      });

      it('should handle various numeric values', () => {
        const testValues = [0, 1, -1, 100, -50, 999999];
        
        testValues.forEach(value => {
          save_content_refresh_key(value);
          expect(get_content_refresh_key()).toBe(value);
        });
      });

      it('should overwrite previous refresh key', () => {
        save_content_refresh_key(10);
        expect(get_content_refresh_key()).toBe(10);
        
        save_content_refresh_key(20);
        expect(get_content_refresh_key()).toBe(20);
        
        save_content_refresh_key(0);
        expect(get_content_refresh_key()).toBe(0);
      });

      it('should indicate force re-render occurred when key is greater than -1', () => {
        // Initially no force re-render
        expect(get_content_refresh_key()).toBe(-1);
        expect(get_content_refresh_key() > -1).toBe(false);
        
        // After saving a key >= 0, indicates re-render occurred
        save_content_refresh_key(0);
        expect(get_content_refresh_key() > -1).toBe(true);
        
        save_content_refresh_key(5);
        expect(get_content_refresh_key() > -1).toBe(true);
        
        // Even negative values other than -1 indicate re-render
        save_content_refresh_key(-5);
        expect(get_content_refresh_key() > -1).toBe(false);
        expect(get_content_refresh_key()).toBe(-5);
      });
    });
  });

  describe('Cache Lifecycle Management', () => {
    it('should handle complete cache lifecycle', () => {
      // Start with clean state
      expect(get_last_content_jsx()).toBeNull();
      expect(get_content_refresh_key()).toBe(-1);
      
      // Save content and refresh key
      const testElement = React.createElement('div', null, 'Test');
      save_content_jsx(testElement);
      save_content_refresh_key(1);
      
      // Verify saved state
      expect(get_last_content_jsx()).toBe(testElement);
      expect(get_content_refresh_key()).toBe(1);
      
      // Clear content but keep refresh key
      clear_last_content_jsx();
      expect(get_last_content_jsx()).toBeNull();
      expect(get_content_refresh_key()).toBe(1);
      
      // Save new content
      const newElement = React.createElement('span', null, 'New');
      save_content_jsx(newElement);
      expect(get_last_content_jsx()).toBe(newElement);
      expect(get_content_refresh_key()).toBe(1);
    });

    it('should handle memory leak prevention through clearing', () => {
      // Create multiple elements and ensure only the last one is kept
      const elements = Array.from({ length: 5 }, (_, i) => 
        React.createElement('div', { key: i }, `Element ${i}`)
      );
      
      elements.forEach(element => save_content_jsx(element));
      
      // Only last element should be kept
      expect(get_last_content_jsx()).toBe(elements[4]);
      
      // Clear to prevent memory leaks
      clear_last_content_jsx();
      expect(get_last_content_jsx()).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive saves', () => {
      const element1 = React.createElement('div', null, 'First');
      const element2 = React.createElement('div', null, 'Second');
      const element3 = React.createElement('div', null, 'Third');
      
      save_content_jsx(element1);
      save_content_jsx(element2);
      save_content_jsx(element3);
      
      expect(get_last_content_jsx()).toBe(element3);
    });

    it('should handle rapid successive refresh key updates', () => {
      save_content_refresh_key(1);
      save_content_refresh_key(2);
      save_content_refresh_key(3);
      
      expect(get_content_refresh_key()).toBe(3);
    });

    it('should handle undefined refresh key parameter', () => {
      save_content_refresh_key(undefined as unknown as number);
      expect(get_content_refresh_key()).toBe(0);
    });

    it('should maintain independence between content and refresh key', () => {
      const testElement = React.createElement('div', null, 'Test');
      
      // Save content without refresh key
      save_content_jsx(testElement);
      expect(get_last_content_jsx()).toBe(testElement);
      expect(get_content_refresh_key()).toBe(-1);
      
      // Save refresh key without affecting content
      save_content_refresh_key(10);
      expect(get_last_content_jsx()).toBe(testElement);
      expect(get_content_refresh_key()).toBe(10);
      
      // Clear content without affecting refresh key
      clear_last_content_jsx();
      expect(get_last_content_jsx()).toBeNull();
      expect(get_content_refresh_key()).toBe(10);
    });
  });
});