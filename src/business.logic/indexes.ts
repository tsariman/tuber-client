import { error_id } from './errors'
import type { IJsonapiResponseResource } from '@tuber/shared'

export interface IIndexes {
  [endpoint: string]: {
    [id: string]: IJsonapiResponseResource
  } | undefined
}

/**
 * Indexes are a copy of the data received from the server.
 * 
 * That data is located at `state.data`.
 *
 * However, indexes are reorganized as objects where the resource document
 * ID is the key and the value is the resource document itself. For example:
 *
 * ```ts
 * const indexes = {
 *    'errorLogs': {
 *        '5c98dd46dd702a2e89b8e1cc': { } // <-- resource document
 *    }
 * }
 * ```
 *
 * Indexes are used to perform quick searches and comparisons of data.
 *
 * Note: One caveat: indexes need to be updated whenever the content of
 *       `state.data` is changed.
 */
const indexes: IIndexes = {}

/**
 * Use this method to convert an array of resource objects to an indexed object
 * for quick lookup by ID.
 *
 * The array must contain entity objects. This means every single object
 * within the array has the same properties.
 * The function uses the 'id' property of each resource as the key and infers
 * the collection name from the 'type' property of the first resource.
 *
 * For example:
 *  const array = [ {id: 'abc', type: 'users', ...}, {id: 'abcd', type: 'users', ...} ]
 *
 *  index_by_id(array)
 *
 * Results in:
 *  indexes['users'] = { abc: {id: 'abc', type: 'users', ...}, abcd: {id: 'abcd', type: 'users', ...} }
 *
 * @param array - The array of resource objects to index.
 */
export function index_by_id(array: IJsonapiResponseResource[]): void {
  if (array.length < 1) { return }
  const collection = array[0].type
  const object: Record<string, IJsonapiResponseResource> = {}
  array.forEach(obj => {
    object[obj.id] = obj
  })
  indexes[collection] = object
}

export function drop_index(collection: string): void {
  delete indexes[collection]
}

/**
 * Gets a resource document by ID.
 *
 * Use this function to retrieve a resource document if you know its ID.
 *
 * @param collection - The collection name.
 * @param id - The resource ID.
 * @returns The resource document, or undefined if not found.
 */
export function select<T = IJsonapiResponseResource>(collection: string, id: string): T | undefined {
  try {
    return indexes[collection]?.[id] as T
  } catch (e) {
    error_id(6).remember_error({ // error 6
      'code': 'MISSING_VALUE',
      'title': (e as Error).message,
      'detail': (e as Error).stack,
      'source': {
        'parameter': `${collection}/${id}`
      }
    })
  }
  return undefined
}
