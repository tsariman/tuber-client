import type { IJsonapiResponseResource } from '@tuber/shared';
import * as F from '../../business.logic/indexes';

describe('indexes.controller.ts', () => {

  describe('index_by_id', () => {
    it('should convert an array (of objects) to an object containing nested objects', () => {
      const array = [
        { id: 'abc' },
        { id: 'abcd' }
      ] as IJsonapiResponseResource[]

      const object = F.index_by_id(array, '_id')
      expect(object).toEqual({ abc: {_id: 'abc'}, abcd: {_id: 'abcd'} })
    });
  });

  describe('drop_index', () => {
    it('should delete an index', () => {
      const array = [
        { id: 'abc' },
        { id: 'abcd' }
      ] as IJsonapiResponseResource[];

      const object = F.index_by_id(array, 'id');
      expect(object).toEqual({ abc: { id: 'abc' }, abcd: { id: 'abcd' }});
      F.drop_index('collection_name');
      expect(F.select('collection_name', 'id')).toBeUndefined();
    });
  });

  describe('select', () => {
    it('should return a resource document by id', () => {
      const array = [
        { id: 'abc' },
        { id: 'abcd' }
      ] as IJsonapiResponseResource[];

      const object = F.index_by_id(array, '_id');
      expect(object).toEqual({ abc: {_id: 'abc'}, abcd: {_id: 'abcd'} });
      const result = F.select('_id', 'abc');
      expect(result).toEqual({ _id: 'abc' });
    });
  });

});