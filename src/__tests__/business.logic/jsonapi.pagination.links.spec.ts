import { describe, it, expect } from 'vitest';
import JsonapiPaginationLinks from '../../business.logic/JsonapiPaginationLinks';

describe('JsonapiPaginationLinks', () => {
  describe('constructor', () => {
    it('should create a jsonapi pagination links object', () => {
      const links = new JsonapiPaginationLinks({
        self: 'http://example.com?page[number]=3&page[size]=1',
        first: 'http://example.com?page[number]=1&page[size]=1',
        last: 'http://example.com?page[number]=100&page[size]=1',
        prev: 'http://example.com?page[number]=2&page[size]=1',
        next: 'http://example.com?page[number]=4&page[size]=1'
      })
      expect(links.selfPageNumber).toEqual(3)
      expect(links.pageSize).toEqual(1)
    });

    it('should safely handle missing links when getting a link url', () => {
      const links = new JsonapiPaginationLinks(undefined);
      expect(() => links.getLinkUrl({ pageNumber: 2 })).not.toThrow();
      expect(links.getLinkUrl({ pageNumber: 2 })).toEqual('');
    });
  });

  describe('selfPageNumber', () => {
    it('should return the current page number', () => {
      const links = new JsonapiPaginationLinks({
        self: 'http://example.com?page[number]=3&page[size]=1',
        first: 'http://example.com?page[number]=1&page[size]=1',
        last: 'http://example.com?page[number]=100&page[size]=1',
        prev: 'http://example.com?page[number]=2&page[size]=1',
        next: 'http://example.com?page[number]=4&page[size]=1'
      });
      expect(links.selfPageNumber).toEqual(3);
    });
    it('should return 1 if the current page number is not provided', () => {
      const links = new JsonapiPaginationLinks({
        self: 'http://example.com?page[size]=1',
        first: 'http://example.com?page[number]=1&page[size]=1',
        last: 'http://example.com?page[number]=100&page[size]=1',
        prev: 'http://example.com?page[number]=2&page[size]=1',
        next: 'http://example.com?page[number]=4&page[size]=1'
      })
      expect(links.selfPageNumber).toEqual(1);
    });
    it('should return 1 if the current page number is not a number', () => {
      const links = new JsonapiPaginationLinks({
        self: 'http://example.com?page[number]=a&page[size]=1',
        first: 'http://example.com?page[number]=1&page[size]=1',
        last: 'http://example.com?page[number]=100&page[size]=1',
        prev: 'http://example.com?page[number]=2&page[size]=1',
        next: 'http://example.com?page[number]=4&page[size]=1'
      });
      expect(links.selfPageNumber).toEqual(1);
    });

    it('should parse encoded bracket query params from bootstrap links', () => {
      const links = new JsonapiPaginationLinks({
        self: '?page%5Bnumber%5D=3&page%5Bsize%5D=25&filter%5Bsearch%5D=test',
        first: '?page%5Bnumber%5D=1&page%5Bsize%5D=25',
        last: '?page%5Bnumber%5D=9&page%5Bsize%5D=25',
      });

      expect(links.selfPageNumber).toEqual(3);
      expect(links.pageSize).toEqual(25);
      expect(links.lastPageNumber).toEqual(9);
    });

    it('should update page[number] when self link is a full URL', () => {
      const links = new JsonapiPaginationLinks({
        self: 'http://example.com/bookmarks?page[number]=3&page[size]=25',
      });

      expect(links.getLinkUrl({ pageNumber: 4 })).toContain('page%5Bnumber%5D=4');
      expect(links.getLinkUrl({ pageNumber: 4 })).toContain('page%5Bsize%5D=25');
    });
  });
});