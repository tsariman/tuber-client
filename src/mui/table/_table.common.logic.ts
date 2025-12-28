import { err } from "../../business.logic/logging"

/**
 * Helper function. It helps resolve the server response's data structure.
 *
 * ```json
 * {
 *    "jsonapi": {},
 *    "meta": {},
 *    "data": [], // <-- this member
 *    "included": [],
 *    "links": {},
 * }
 * ```
 *
 * @param data data member of response. See previous state example.
 *              Should be an array or an object.
 *
 * @see https://jsonapi.org/format/#document-top-level
 */
export function analyze_table_data(data: unknown) {
  const type = typeof data
  let sample
  switch (type) {
  case 'object':
    if (Array.isArray(data)) {
      sample = data[0]
    } else {
      sample = data
    }
    if (sample.attributes) {
      return sample.attributes
    }
    return sample
  }
  err(`Data can only be an object or array. A(n) [${type}] was given.`)
}

/**
 * This function is used to automatically generate the table column labels.
 *
 * Use this function if the column labels definition was not found in the server response.
 *
 * single column example:
 * ```ts
 * const columnLabels = [
 *    {
 *       width: 120,
 *       label: 'Fat (g)',
 *       dataKey: 'fat',
 *       numeric: true, // optional
 *       flexGrow: 1.0 // optional
 *    },
 *    // ... more column labels definition
 * ]
 * ```
 *
 * Use the above example if you want to implement the column labels
 * server-side,
 *
 * __TODO__: Move to ./mui4/table/index.ts
 *         Including all helper functions.
 *
 * @param obj
 */
export function get_table_view_columns(obj: unknown) {
  const data = analyze_table_data(obj)
  return Object.keys(data).map(key => ({
    width: 400,
    label: key,
    dataKey: key
  }))
}
