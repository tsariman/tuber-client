import { error_id } from './errors';
import type { IJsonapiResponseResource } from '@tuber/shared';

export interface IIndexes {
  [endpoint: string]: {
    [id: string]: IJsonapiResponseResource;
  } | undefined;
}

/**
 * Indexes is a copy of the data received from the server.
 * 
 * That data is located at `state.data`
 *
 * However, indexes is reorganized as an object. Where the resource document
 * id is the key and the value is the resource document itself. e.g.
 *
 * ```ts
 * const indexes = {
 *    'errorLogs': {
 *        '5c98dd46dd702a2e89b8e1cc': { } // <-- resource document
 *    }
 * }
 * ```
 *
 * Indexes will be used to perform quick searches and comparison of data.
 *
 * Note: One caveat, indexes needs to be updated whenever the content of
 *       `state.data` is changed.
 */
const indexes: IIndexes = {};

/**
 * Use this method to convert an array (of objects) to an object containing
 * nested objects.
 *
 * The array must contain entities object. This means, every single object
 * within the array have the same properties.
 * Then, you must choose an existing property of the entities as the key
 * which will be used to access the object.
 *
 * e.g.
 *  var array = [ {_id: 'abc'}, {_id: 'abcd'} ]
 *
 * using:
 *  var object = arrayToObject(array, '_id')
 *
 * yields:
 *  object = { abc: {_id: 'abc'}, abcd: {_id: 'abcd'} }
 *
 * @param array 
 * @param key 
 */
export function index_by_id(array: IJsonapiResponseResource[], collection: string): void {
  const object: {[i: string]: IJsonapiResponseResource} = {};
  array.forEach(obj => {
    object[obj.id] = obj;
  });
  indexes[collection] = object;
}

export function drop_index(collection: string): void {
  delete indexes[collection];
}

/**
 * Get resource document by id.
 *
 * Use this function to retrieve an resource document if you know their id.
 *
 * @param endpoint 
 * @param id 
 */
export function select<T = IJsonapiResponseResource>(endpoint: string, id: string): T | undefined {
  try {
    return indexes?.[endpoint]?.[id] as T;
  } catch (e) {
    error_id(6).remember_error({ // error 6
      'code': 'MISSING_VALUE',
      'title': (e as Error).message,
      'detail': (e as Error).stack,
      'source': {
        'parameter': `${endpoint}/${id}`
      }
    });
    return undefined;
  }
}
