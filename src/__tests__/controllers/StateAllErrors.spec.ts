import { describe, it, expect } from 'vitest';
import StateAllErrors from '../../controllers/StateAllErrors';

describe('StateAllErrors', () => {
  describe('constructor', () => {
    it('should create a state all errors object', () => {
      const state = new StateAllErrors([
        {
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
        },
        {
          id: '2',
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
        }
      ]);
      expect(state).toEqual({
        _allErrorsState: [
          {
            id: '1',
            links: { about: 'http://example.com' },
            status: '404',
            code: 'NOT_FOUND',
            title: 'Not Found',
            detail: 'The requested resource could not be found.',
            source: { parameter: 'id' },
            meta: { meta: 'data' }
          },
          {
            id: '2',
            links: { about: 'http://example.com' },
            status: '404',
            code: 'NOT_FOUND',
            title: 'Not Found',
            detail: 'The requested resource could not be found.',
            source: { parameter: 'id' },
            meta: { meta: 'data' }
          }
        ]
      });
    });
  });

  describe('state', () => {
    it('should return the state', () => {
      const state = new StateAllErrors([
        {
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
        },
        {
          id: '2',
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
        }
      ]);
      expect(state.state).toEqual([
        {
          id: '1',
          links: { about: 'http://example.com' },
          status: '404',
          code: 'not_found',
          title: 'Not Found',
          detail: 'The requested resource could not be found.',
          source: { parameter: 'id' },
          meta: { meta: 'data' }
        },
        {
          id: '2',
          links: { about: 'http://example.com' },
          status: '404',
          code: 'not_found',
          title: 'Not Found',
          detail: 'The requested resource could not be found.',
          source: { parameter: 'id' },
          meta: { meta: 'data' }
        }
      ]);
    });
  });
});