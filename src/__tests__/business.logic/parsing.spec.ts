import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  get_parsed_content,
  parse_cookies,
  get_cookie,
  set_url_query_val,
  set_val,
  get_head_meta_content,
  get_base_route,
  get_origin_ending_fixed,
  clean_endpoint_ending,
  get_query_starting_fixed,
  get_state_form_name
} from '../../business.logic/parsing';

// Mock the tuber/shared constants
vi.mock('@tuber/shared', () => ({
  APP_CONTENT_VIEW: 'app',
  DEFAULT_LANDING_PAGE_VIEW: 'landing'
}));

// Mock logging to prevent actual console output during tests
vi.mock('../../business.logic/logging', () => ({
  ler: vi.fn()
}));

describe('parsing.ts', () => {
  describe('get_parsed_content', () => {
    it('should parse valid content string with all parts', () => {
      const content = 'app:dashboard:api/users:page=1&limit=10';
      const result = get_parsed_content(content);
      
      expect(result).toEqual({
        type: 'app',
        name: 'dashboard',
        endpoint: 'api/users',
        args: 'page=1&limit=10'
      });
    });

    it('should parse content with minimal parts (type and name only)', () => {
      const content = 'app:profile';
      const result = get_parsed_content(content);
      
      expect(result).toEqual({
        type: 'app',
        name: 'profile'
      });
    });

    it('should parse content with type, name, and endpoint', () => {
      const content = 'view:users:api/users';
      const result = get_parsed_content(content);
      
      expect(result).toEqual({
        type: 'view',
        name: 'users',
        endpoint: 'api/users'
      });
    });

    it('should handle whitespace in content string', () => {
      const content = ' app : dashboard : api/users : page=1 ';
      const result = get_parsed_content(content);
      
      expect(result).toEqual({
        type: 'app',
        name: 'dashboard',
        endpoint: 'api/users',
        args: 'page=1'
      });
    });

    it('should return default values for invalid content (single part)', () => {
      const content = 'singlepart';
      const result = get_parsed_content(content);
      
      expect(result).toEqual({
        type: 'app',
        name: 'landing'
      });
    });

    it('should throw error for non-string content', () => {
      expect(() => get_parsed_content(123)).toThrow('Content is not a string.');
      expect(() => get_parsed_content(null)).toThrow('Content is not a string.');
      expect(() => get_parsed_content(undefined)).toThrow('Content is not a string.');
      expect(() => get_parsed_content({})).toThrow('Content is not a string.');
    });

    it('should handle empty string', () => {
      const result = get_parsed_content('');
      expect(result).toEqual({
        type: 'app',
        name: 'landing'
      });
    });

    it('should handle content with empty colons', () => {
      const content = 'app::api/users:';
      const result = get_parsed_content(content);
      
      expect(result).toEqual({
        type: 'app',
        name: '',
        endpoint: 'api/users',
        args: ''
      });
    });
  });

  describe('parse_cookies', () => {
    const originalCookie = document.cookie;

    afterEach(() => {
      // Clear all cookies after each test
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    });

    it('should parse simple cookies', () => {
      document.cookie = 'name1=value1';
      document.cookie = 'name2=value2';
      
      const cookies = parse_cookies();
      expect(cookies.name1).toBe('value1');
      expect(cookies.name2).toBe('value2');
    });

    it('should handle cookies with special characters', () => {
      document.cookie = 'encoded=%20test%20value%20';
      document.cookie = 'special=abc-123_xyz';
      
      const cookies = parse_cookies();
      expect(cookies.encoded).toBe('%20test%20value%20');
      expect(cookies.special).toBe('abc-123_xyz');
    });

    it('should return empty object when no cookies exist', () => {
      // Ensure no cookies exist
      const cookies = parse_cookies();
      expect(typeof cookies).toBe('object');
    });

    it('should handle cookies with spaces around equals sign', () => {
      // Manually set document.cookie to simulate spaces
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'name1 = value1 ; name2= value2;name3 =value3'
      });
      
      const cookies = parse_cookies();
      expect(cookies.name1).toBe('value1');
      expect(cookies.name2).toBe('value2');
      expect(cookies.name3).toBe('value3');
      
      // Restore original
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: originalCookie
      });
    });

    it('should handle empty cookie values', () => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'empty=;nonempty=value'
      });
      
      const cookies = parse_cookies();
      expect(cookies.empty).toBe('');
      expect(cookies.nonempty).toBe('value');
      
      // Restore original
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: originalCookie
      });
    });
  });

  describe('get_cookie', () => {
    const originalCookie = document.cookie;

    afterEach(() => {
      // Restore original cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: originalCookie
      });
    });

    it('should get existing cookie value', () => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'username=john; theme=dark'
      });
      
      expect(get_cookie('username')).toBe('john');
      expect(get_cookie('theme')).toBe('dark');
    });

    it('should return empty string for non-existent cookie', () => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'existing=value'
      });
      
      expect(get_cookie('nonexistent')).toBe('');
    });

    it('should handle type parameter', () => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'count=42; flag=true'
      });
      
      // Note: This still returns string, but type assertion is at call site
      expect(get_cookie<number>('count')).toBe('42');
      expect(get_cookie<boolean>('flag')).toBe('true');
    });
  });

  describe('set_url_query_val', () => {
    it('should add new query parameter', () => {
      const url = 'https://example.com/path';
      const result = set_url_query_val(url, 'page', '2');
      expect(result).toBe('https://example.com/path?page=2');
    });

    it('should update existing query parameter', () => {
      const url = 'https://example.com/path?page=1&limit=10';
      const result = set_url_query_val(url, 'page', '2');
      expect(result).toContain('page=2');
      expect(result).toContain('limit=10');
    });

    it('should remove query parameter when value is undefined', () => {
      const url = 'https://example.com/path?page=1&limit=10';
      const result = set_url_query_val(url, 'page', undefined);
      expect(result).not.toContain('page=');
      expect(result).toContain('limit=10');
    });

    it('should handle URL without existing query parameters', () => {
      const url = 'https://example.com/path';
      const result = set_url_query_val(url, 'new', 'value');
      expect(result).toBe('https://example.com/path?new=value');
    });

    it('should handle multiple parameters', () => {
      let url = 'https://example.com/path';
      url = set_url_query_val(url, 'a', '1');
      url = set_url_query_val(url, 'b', '2');
      
      expect(url).toContain('a=1');
      expect(url).toContain('b=2');
    });
  });

  describe('set_val', () => {
    it('should set simple property', () => {
      const obj = {};
      set_val(obj, 'name', 'John');
      expect((obj as Record<string, unknown>).name).toBe('John');
    });

    it('should set nested property', () => {
      const obj = {};
      set_val(obj, 'user.profile.name', 'John');
      expect((obj as Record<string, Record<string, Record<string, unknown>>>).user.profile.name).toBe('John');
    });

    it('should overwrite existing properties', () => {
      const obj = { user: { name: 'Jane' } };
      set_val(obj, 'user.name', 'John');
      expect((obj as Record<string, Record<string, unknown>>).user.name).toBe('John');
    });

    it('should create intermediate objects', () => {
      const obj = {};
      set_val(obj, 'a.b.c.d', 'value');
      expect((obj as Record<string, Record<string, Record<string, Record<string, unknown>>>>).a.b.c.d).toBe('value');
    });

    it('should handle various value types', () => {
      const obj = {};
      set_val(obj, 'string', 'text');
      set_val(obj, 'number', 42);
      set_val(obj, 'boolean', true);
      set_val(obj, 'null', null);
      set_val(obj, 'array', [1, 2, 3]);
      
      const result = obj as Record<string, unknown>;
      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.boolean).toBe(true);
      expect(result.null).toBe(null);
      expect(result.array).toEqual([1, 2, 3]);
    });

    it('should throw error for invalid object', () => {
      expect(() => set_val(null as unknown as object, 'path', 'value')).toThrow('set_val: obj must be an object');
      expect(() => set_val(undefined as unknown as object, 'path', 'value')).toThrow('set_val: obj must be an object');
      expect(() => set_val('string' as unknown as object, 'path', 'value')).toThrow('set_val: obj must be an object');
    });

    it('should throw error for invalid path', () => {
      const obj = {};
      expect(() => set_val(obj, '', 'value')).toThrow('set_val: path must be a non-empty string');
      expect(() => set_val(obj, null as unknown as string, 'value')).toThrow('set_val: path must be a non-empty string');
    });

    it('should replace non-object intermediate values', () => {
      const obj = { user: 'string' };
      set_val(obj, 'user.name', 'John');
      expect((obj as unknown as Record<string, Record<string, unknown>>).user.name).toBe('John');
    });
  });

  describe('get_head_meta_content', () => {
    beforeEach(() => {
      // Clear existing meta tags
      document.querySelectorAll('meta').forEach(meta => meta.remove());
    });

    it('should get meta content when tag exists', () => {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Test description';
      document.head.appendChild(meta);
      
      const result = get_head_meta_content('description');
      expect(result).toBe('Test description');
    });

    it('should return default value when meta tag does not exist', () => {
      const result = get_head_meta_content('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('should return "app" as default when no default provided', () => {
      const result = get_head_meta_content('nonexistent');
      expect(result).toBe('app');
    });

    it('should handle empty meta content', () => {
      const meta = document.createElement('meta');
      meta.name = 'empty';
      meta.content = '';
      document.head.appendChild(meta);
      
      const result = get_head_meta_content('empty', 'default');
      expect(result).toBe('default');
    });

    it('should handle multiple meta tags with same name (gets first)', () => {
      const meta1 = document.createElement('meta');
      meta1.name = 'keywords';
      meta1.content = 'first';
      document.head.appendChild(meta1);
      
      const meta2 = document.createElement('meta');
      meta2.name = 'keywords';
      meta2.content = 'second';
      document.head.appendChild(meta2);
      
      const result = get_head_meta_content('keywords');
      expect(result).toBe('first');
    });
  });

  describe('get_base_route', () => {
    it('should extract base route from template', () => {
      expect(get_base_route('/users/:id/posts')).toBe('users');
      expect(get_base_route('/api/v1/products/:id')).toBe('api');
      expect(get_base_route('/dashboard')).toBe('dashboard');
    });

    it('should handle routes with leading slash', () => {
      expect(get_base_route('/users')).toBe('users');
      expect(get_base_route('users')).toBe('users');
    });

    it('should handle routes with trailing slash', () => {
      expect(get_base_route('/users/')).toBe('users');
      expect(get_base_route('users/')).toBe('users');
    });

    it('should handle empty or undefined route', () => {
      expect(get_base_route('')).toBe('');
      expect(get_base_route(undefined)).toBe('');
    });

    it('should handle single segment routes', () => {
      expect(get_base_route('home')).toBe('home');
      expect(get_base_route('/home')).toBe('home');
    });
  });

  describe('get_origin_ending_fixed', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true
      });
    });

    it('should add trailing slash to origin without one', () => {
      const result = get_origin_ending_fixed('https://example.com');
      expect(result).toBe('https://example.com/');
    });

    it('should keep trailing slash when origin already has one', () => {
      const result = get_origin_ending_fixed('https://example.com/');
      expect(result).toBe('https://example.com/');
    });

    it('should use window.location.origin when no origin provided', () => {
      const result = get_origin_ending_fixed();
      expect(result).toBe('https://example.com/');
    });

    it('should handle empty string origin', () => {
      const result = get_origin_ending_fixed('');
      expect(result).toBe('/');
    });
  });

  describe('clean_endpoint_ending', () => {
    it('should remove trailing slash', () => {
      expect(clean_endpoint_ending('/api/users/')).toBe('/api/users');
      expect(clean_endpoint_ending('api/users/')).toBe('api/users');
    });

    it('should keep endpoint without trailing slash unchanged', () => {
      expect(clean_endpoint_ending('/api/users')).toBe('/api/users');
      expect(clean_endpoint_ending('api/users')).toBe('api/users');
    });

    it('should handle empty or undefined endpoint', () => {
      expect(clean_endpoint_ending('')).toBe('');
      expect(clean_endpoint_ending(undefined)).toBe('');
    });

    it('should handle single slash', () => {
      expect(clean_endpoint_ending('/')).toBe('');
    });
  });

  describe('get_query_starting_fixed', () => {
    it('should add question mark to query without one', () => {
      expect(get_query_starting_fixed('page=1&limit=10')).toBe('?page=1&limit=10');
    });

    it('should keep question mark when query already has one', () => {
      expect(get_query_starting_fixed('?page=1&limit=10')).toBe('?page=1&limit=10');
    });

    it('should handle empty or undefined query', () => {
      expect(get_query_starting_fixed('')).toBe('');
      expect(get_query_starting_fixed(undefined)).toBe('');
    });

    it('should handle single question mark', () => {
      expect(get_query_starting_fixed('?')).toBe('?');
    });
  });

  describe('get_state_form_name', () => {
    it('should add Form suffix when not present', () => {
      expect(get_state_form_name('login')).toBe('loginForm');
      expect(get_state_form_name('user')).toBe('userForm');
      expect(get_state_form_name('contact')).toBe('contactForm');
    });

    it('should keep Form suffix when already present', () => {
      expect(get_state_form_name('loginForm')).toBe('loginForm');
      expect(get_state_form_name('userForm')).toBe('userForm');
    });

    it('should handle edge cases', () => {
      expect(get_state_form_name('')).toBe('Form');
      expect(get_state_form_name('F')).toBe('FForm');
      expect(get_state_form_name('Fo')).toBe('FoForm');
      expect(get_state_form_name('For')).toBe('ForForm');
    });

    it('should be case sensitive', () => {
      expect(get_state_form_name('loginform')).toBe('loginformForm');
      expect(get_state_form_name('loginFORM')).toBe('loginFORMForm');
    });
  });
});