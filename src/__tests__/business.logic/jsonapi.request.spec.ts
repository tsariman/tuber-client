import { describe, it, expect } from 'vitest';
import JsonapiRequest from '../../business.logic/JsonapiRequest'

describe('jsonapi.request.ts', () => {

  describe('JsonapiRequest', () => {
    it('should create a jsonapi request object', () => {
      const request = new JsonapiRequest('type', { attr: 'value' })
      expect(request).toEqual({
        _request: {
          data: {
            type: 'type',
            attributes: { attr: 'value' }
          }
        }
      });
    });

    it('should set type', () => {
      const request = new JsonapiRequest('initial', { attr: 'value' }).setType('newType')
      expect(request.build()).toEqual({
        data: {
          type: 'newType',
          attributes: { attr: 'value' }
        }
      });
    });

    it('should set id', () => {
      const request = new JsonapiRequest('type', { attr: 'value' }).setId('123')
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          id: '123',
          attributes: { attr: 'value' }
        }
      });
    });

    it('should set attributes', () => {
      const request = new JsonapiRequest('type', { attr: 'value' } as Record<string, unknown>).setAttributes({ newAttr: 'newValue' })
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          attributes: { newAttr: 'newValue' }
        }
      });
    });

    it('should set relationships', () => {
      const relationships = {
        related: {
          data: { type: 'relatedType', id: '456' }
        }
      };
      const request = new JsonapiRequest('type', { attr: 'value' }).setRelationships(relationships)
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          attributes: { attr: 'value' },
          relationships
        }
      });
    });

    it('should set meta', () => {
      const meta = { version: '1.0' };
      const request = new JsonapiRequest('type', { attr: 'value' }).setMeta(meta)
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          attributes: { attr: 'value' },
          meta
        }
      });
    });

    it('should add to meta using meta method', () => {
      const request = new JsonapiRequest('type', { attr: 'value' })
        .meta('version', '1.0')
        .meta('author', 'test')
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          attributes: { attr: 'value' },
          meta: { version: '1.0', author: 'test' }
        }
      });
    });

    it('should set links', () => {
      const links = { self: 'http://example.com' };
      const request = new JsonapiRequest('type', { attr: 'value' }).setLinks(links)
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          attributes: { attr: 'value' },
          links
        }
      });
    });

    it('should add links using link method', () => {
      const request = new JsonapiRequest('type', { attr: 'value' })
        .link('self', 'http://example.com')
        .link('related', 'http://example.com/related')
      expect(request.build()).toEqual({
        data: {
          type: 'type',
          attributes: { attr: 'value' },
          links: {
            self: 'http://example.com',
            related: 'http://example.com/related'
          }
        }
      });
    });

    it('should throw error when setting non-self link before self', () => {
      const request = new JsonapiRequest('type', { attr: 'value' })
      expect(() => request.link('related', 'http://example.com')).toThrow('self link must be set before other links');
    });

    it('should chain methods', () => {
      const request = new JsonapiRequest('initial', { attr: 'value' })
        .setType('final')
        .setId('123')
        .setAttributes({ attr: 'newValue' })
        .setRelationships({ rel: { data: null } })
        .setMeta({ metaKey: 'metaValue' })
        .meta('extraMeta', 'extraValue')
        .link('self', 'http://example.com')
        .link('edit', 'http://example.com/edit')

      expect(request.build()).toEqual({
        data: {
          type: 'final',
          id: '123',
          attributes: { newAttr: 'newValue' },
          relationships: { rel: { data: null } },
          meta: { metaKey: 'metaValue', extraMeta: 'extraValue' },
          links: {
            self: 'http://example.com',
            edit: 'http://example.com/edit'
          }
        }
      });
    });
  });

});