import JsonapiRequest from 'src/business.logic/JsonapiRequest'

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
  });

});