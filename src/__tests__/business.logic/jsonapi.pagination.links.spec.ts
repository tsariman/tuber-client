import JsonapiPaginationLinks from 'src/business.logic/JsonapiPaginationLinks'

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
      expect(links).toEqual({
        _links: {
          self: 'http://example.com?page[number]=3&page[size]=1',
          first: 'http://example.com?page[number]=1&page[size]=1',
          last: 'http://example.com?page[number]=100&page[size]=1',
          prev: 'http://example.com?page[number]=2&page[size]=1',
          next: 'http://example.com?page[number]=4&page[size]=1'
        }
      });
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
  });
});