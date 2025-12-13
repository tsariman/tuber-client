import { describe, it, expect } from 'vitest';
import JsonapiError from '../../business.logic/JsonapiError';

describe('JsonapiError', () => {
  describe('constructor', () => {
    it('should create a jsonapi error object', () => {
      const error = new JsonapiError({
        id: '1',
        links: {
          about: {
            href: 'http://example.com'
          }
        },
        status: '404',
        code: 'NOT_FOUND',
        title: 'Not Found',
        detail: 'The requested resource could not be found.',
        source: { parameter: 'id' },
        meta: { meta: 'data' }
      })
      expect(error).toEqual({
        _idJson: '1',
        e: {
          id: '1',
          links: { about: 'http://example.com' },
          status: '404',
          code: 'not_found',
          title: 'Not Found',
          detail: 'The requested resource could not be found.',
          source: { parameter: 'id' },
          meta: { meta: 'data' }
        }
      });
    });
  });

  describe('id', () => {
    it('should return the id', () => {
      const error = new JsonapiError({
        id: '1',
        code: 'NOT_FOUND',
        title: 'Not Found'
      });
      expect(error.id).toEqual('1')
    });
    it('should return a new id if one is not provided', () => {
      const error = new JsonapiError({
        code: 'NOT_FOUND',
        title: 'Not Found'
      });
      expect(error.id).toBeDefined()
    });
  });

  describe('links', () => {
    it('should return the links', () => {
      const error = new JsonapiError({
        code: 'NOT_FOUND',
        title: 'Not Found',
        links: { about: { href: 'http://example.com'} }
      });
      expect(error.links).toEqual({ about: 'http://example.com' })
    });
    it('should return an empty object if links are not provided', () => {
      const error = new JsonapiError({
        code: 'NOT_FOUND',
        title: 'Not Found'
      });
      expect(error.links).toEqual({})
    });
  });

  describe('status', () => {
    it('should return the status', () => {
      const error = new JsonapiError({
        code: 'NOT_FOUND',
        title: 'Not Found',
        status: '404'
      });
      expect(error.status).toEqual('404');
    });
    it('should return an empty string if status is not provided', () => {
      const error = new JsonapiError({
        code: 'NOT_FOUND',
        title: 'Not Found'
      });
      expect(error.status).toEqual('');
    });
  });

  describe('code', () => {
    it('should return the code', () => {
      const error = new JsonapiError({
        code: 'NOT_FOUND',
        title: 'Not Found'
      })
      expect(error).toEqual({
        _idJson: undefined,
        e: {
          code: 'not_found',
          title: 'Not Found'
        }
      });
    });
  });
});