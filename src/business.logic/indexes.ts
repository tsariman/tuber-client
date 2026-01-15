import { error_id } from './errors'
import type { IJsonapiResponseResource } from '@tuber/shared'
import { non_empty_string } from './utility'

export type TIndexes<T> = Record<string,
  Record<string, IJsonapiResponseResource<T>>
>

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
const indexesCache: TIndexes<unknown> = {}

/**
 * Cache for indexed results to avoid recomputation if the input array hasn't changed.
 */
const hashesCache: Record<string, string> = {}

/**
 * Simple hash function to generate a hash string from input string.
 * @param str - The input string to hash.
 * @returns The hash string.
 */
const simple_hash = (str: string): string => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash.toString()
}

/**
 * Retrieve a cached index if it exists and the input array hasn't changed.
 *
 * @param identifier - The identifier for the index (usually the collection name).
 * @param array - The input array used to generate the index.
 * @returns The cached index or null if it needs to be recomputed.
 */
const get_cached_index = <T>(identifier: string, array: T[]): Record<string, T> | null => {
  const arrayJson = JSON.stringify(array)
  const newHash = simple_hash(arrayJson)

  // Check if already indexed and unchanged
  const cachedIndex = indexesCache[identifier]
  const cachedHash = hashesCache[identifier]
  if (cachedHash === newHash && cachedIndex) {
    return cachedIndex as Record<string, T>
  }

  hashesCache[identifier] = newHash
  return null
}

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
export function index_by_id<T>(
  array: IJsonapiResponseResource<T>[]
): Record<string, IJsonapiResponseResource<T>> | null {
  if (array.length < 1) { return null }
  const collection = array[0].type
  const cachedIndex = get_cached_index(collection, array)
  if (cachedIndex) {
    return cachedIndex
  }

  // Compute new index
  const object: Record<string, IJsonapiResponseResource<T>> = {}
  array.forEach(obj => {
    object[obj.id] = obj
  })
  indexesCache[collection] = object

  return object
}

/**
 * Use this method to convert an array of resource objects to an indexed object
 * for quick lookup by a specific attribute's member value.
 * The array must contain entity objects. This means every single object
 * within the array has the same properties.
 * The function uses the specified attribute's member value of each resource as the key
 * and infers the collection name from the 'type' property of the first resource.
 *
 * For example:
 * @example
 * const array = [ {id: 'abc', type: 'users', attributes: { username: 'alice' } }, {id: 'abcd', type: 'users', attributes: { username: 'bob' } } ]
 *
 * index_by_attribute_member(array, 'username')
 * Results in:
 * indexes['users'] = { alice: {id: 'abc', type: 'users', attributes: { username: 'alice' } }, bob: {id: 'abcd', type: 'users', attributes: { username: 'bob' } } }
 * @param array - The array of resource objects to index.
 * @param attribute - The attribute whose member value will be used as the key.
 */
export function index_by_attribute_member<T>(
  array: IJsonapiResponseResource<T>[],
  attribute: keyof T
): Record<string, IJsonapiResponseResource<T>> | null {
  if (array.length < 1) { return null }
  const cachedIndex = get_cached_index(attribute as string, array)
  if (cachedIndex) {
    return cachedIndex
  }

  // Compute new index
  const object: Record<string, IJsonapiResponseResource<T>> = {}
  array.forEach(resource => {
    const key = resource.attributes?.[attribute]
    if (non_empty_string(key)) { object[key] = resource}
  })
  indexesCache[attribute as string] = object
  return object
}

export function drop_index(identifier: string): void {
  delete indexesCache[identifier]
  delete hashesCache[identifier]
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
export function select_by_id<T = IJsonapiResponseResource>(collection: string, id: string): T | undefined {
  return indexesCache[collection]?.[id] as T
}

/** Gets a resource document by an attribute's member value.
 *
 * Use this function to retrieve a resource document if you know the value
 * of one of its attribute's members.
 * @param attributeName - The attribute name (e.g., 'username').
 * @param attributeValue - The attribute value (e.g., 'alice').
 * @returns The resource document, or undefined if not found.
 */
export const select_by_attr = <T>(
  attributeName: string,
  attributeValue: string
): IJsonapiResponseResource<T> | undefined => {
  try {
    return indexesCache[attributeName]?.[attributeValue] as IJsonapiResponseResource<T>
  } catch (e) {
    error_id(6).remember_error({ // error 6
      'code': 'MISSING_DATA',
      'title': (e as Error).message,
      'detail': (e as Error).stack,
      'source': {
        'parameter': `${attributeName}/${attributeValue}`
      }
    })
  }
  return undefined
}

/**
 * Selects a resource document from the indexes cache.
 * @param collection - The collection name.
 * @param identifier - The resource identifier (ID).
 * @returns The resource document or undefined if not found.
 */
export const select = <T = IJsonapiResponseResource>(
  collection: string,
  identifier: string
): T | undefined => {
  return indexesCache[collection]?.[identifier] as T
}