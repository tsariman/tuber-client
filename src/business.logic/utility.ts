/* 
  WARNING: Do not import anything here.
  Only pure, dependency-free utility functions belong in this module.
  If you need to import or reference other modules, the function does not
  belong here. This helps avoid circular dependencies and keeps this file
  focused on generic helpers.
*/

type TU = unknown;

/** Get as an object */
export const o_ = (obj: TU) => obj as object | undefined
/** Sets the value type to `string` */
export const s_ = (str: TU, fallback = '') => (str ?? fallback) as string
/** Sets the value type to `number` */
export const n_ = (num: TU) => num as number | undefined
/** Sets the value type to a record object */
export const r_ = <T = TU>(obj: TU) => obj as Record<string, T> | undefined

/** Checks the argument is an `object`. Returns `true` if it is. */
export const is_object = (obj: TU): obj is object => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/** Checks if the argument is an `object` with `string` indexes. Returns `true` if it is. */
export const is_record = <T>(obj: TU): obj is Record<string, T> => {
  return obj !==null && typeof obj === 'object' && !Array.isArray(obj)
}

/** Checks if the argument is an `object` or an `array`. Returns `true` if it is. */
export const is_struct = <T=object>(obj: TU): obj is T => {
  return obj !== null && typeof obj === 'object'
}

/** Checks if the argument is a `string`. Returns `true` if it is. */
export const is_string = (arg: TU): arg is string => {
  return typeof arg === 'string' && arg.length > 0
}

/** Checks if the argument is a `string`. Returns `true` if it is. */
export const is_number = (arg: TU): arg is number => {
  return typeof arg === 'number'
}

/** Checks if the argument is `undefined`. Returns `true` if it is. */
export const is_undefined = (arg: TU): arg is undefined => {
  return typeof arg === 'undefined'
}

interface IReadme {
  is: {
    no: { value: boolean }
    valid: boolean
    not: { defined: boolean }
    undefined: boolean
  }
}

/** Read the code already */
export const readme = (val: TU): IReadme => ({
  is: {
    no: { value: !val },
    valid: !!val,
    not: { defined: !val },
    undefined: !val
  }
})

/**
 * Safely get a value from an object by dot-notation path
 * @param obj - The object to retrieve a value from
 * @param path - Dot notation path to the property (e.g., 'user.address.street')
 * @returns The value at the specified path or undefined if not found
 */
export function get_val<T = TU>(obj: TU, path: string): T | undefined {
  // Handle invalid inputs
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return undefined;
  }

  // Handle empty or whitespace-only path
  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return undefined;
  }

  // Split the path by dots and trim whitespace
  const parts = trimmedPath.split('.');
  
  // Handle consecutive dots
  if (parts.some(part => part === '')) {
    return undefined;
  }
  
  let current: TU = obj;
  
  // Traverse the object according to the path
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i].trim();
    
    // If current is null or undefined, we can't go further
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // If current is not an object/array, we can't traverse further
    if (typeof current !== 'object') {
      return undefined;
    }
    
    // For arrays, validate the index
    if (Array.isArray(current)) {
      // Ensure key is a valid array index (non-negative integer)
      const index = Number(key);
      if (isNaN(index) || index < 0 || !Number.isInteger(index)) {
        return undefined;
      }
      
      current = current[index];
    } else {
      // For objects, access the property using index notation
      // This avoids TypeScript errors about dynamic property access
      current = (current as Record<string, TU>)[key];
    }
  }
  
  // Return the final value (it can be any type, including falsy values)
  return current as T;
} // END - get_val

/**
 * Get a value from an object as the same type as the default value without
 * causing an exception.
 * @param obj arbitrary object
 * @param path dot-separated object (nested) keys
 * @param _default default value
 * @returns value or default value
 */
export function safely_get_as<T = TU>(
  obj: TU,
  path = '',
  _default: T
): T {
  const value = get_val<T>(obj, path);

  return value ? value : _default;
}

/**
 * Get global variable value.
 *
 * Since there's a number of global variables that are defined by clients,
 * there's a strong chance that some or all of them may be undefined.
 * This function is a solution to that problem.
 *
 * @param varName string representation of in-code variable identifier.
 * @returns object or throws an exception
 * @throws an exception if the global variable name is invalid.
 * 
 * @deprecated Not in use!
 */
export function get_global_var<T= TU>(varName: string): T {
  try {
    return window[varName] as T;
  } catch (e) {
    void e;
    const message = `Global variable "${varName}" does not exist.`;
    console.error(message);
  }
  return { } as T;
}

/**
 * Generates a mongodb ObjectId.
 *
 * @see https://gist.github.com/solenoid/1372386
 */
export function mongo_object_id(): string {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
}

/**
 * Given a URL, it will return the content as a string.
 *
 * Note: This function is NOT used anywhere. Most likely, it is safe to remove.
 *
 * @param theUrl 
 *
 * @see https://stackoverflow.com/questions/10642289/return-html-content-as-a-string-given-url-javascript-function
 * @deprecated Not in use
 */
export function http_get(theUrl: string): void
{
  // code for IE7+, Firefox, Chrome, Opera, Safari
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      return xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET", theUrl, false);
  xmlhttp.send();    
}

/**
 * Get the right theme state.
 * @param mode light or dark
 * @param main the main state
 * @param light the light state
 * @param dark the dark state
 * @returns the right state
 */
export function get_themed_state<T = TU>(
  mode: 'dark'|'light',
  main: TU,
  light: TU,
  dark: TU
): T {
  if (light && dark) {
    return mode === 'dark' ? dark as T : light as T;
  }
  return main as T;
}

/**
 * TODO Implement this function.
 * This function is for handling unexpected nesting.
 * It's a common problem when the server returns a response that is
 * not in the expected format.  
 * For example, the server returns a response like this:  
 * ```json
 * {
 *   "data": {
 *     "id": "123",
 *     "type": "users",
 *     "attributes": {
 *       "name": "John Doe"
 *     }
 *   }
 * }
 * ```
 * But the client expects a response like this:
 * ```json
 * {
 *   "id": "123",
 *   "type": "users",
 *   "attributes": {
 *     "name": "John Doe"
 *   }
 * }
 * ```
 * This function should be able to handle this problem.
 * It should be able to detect the unexpected nesting and fix it.
 * It should also be able to detect the expected nesting and leave it
 * alone.
 * This function should be able to handle the following cases:
 * 1. The server returns a response with the expected nesting.  
 * 2. The server returns a response with the unexpected nesting.  
 * 3. The server returns a response with the expected nesting and
 *   unexpected nesting.
 *
 * As more cases are discovered, they should be added to this list.
 * 
 * @deprecated Not in use
 */
export function resolve_unexpected_nesting (response: TU) {
  if (typeof response === 'object'
    && response !== null
    && !Array.isArray(response)
    && 'response' in response
  ) {// Case of nested response
    return response.response;
  }

  // ... other cases

  return response;
}

/** @deprecated */
interface IViewportSize {
  width: number;
  height: number;
}

/**
 * Get browser tab viewport size.
 *
 * @deprecated
 * Credit:
 * @see https://stackoverflow.com/questions/1377782/javascript-how-to-determine-the-screen-height-visible-i-e-removing-the-space
 */
export function get_viewport_size(): IViewportSize {
  let e: TU = window, a = 'inner';
  if ( !( 'innerWidth' in window ) ) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return {
    width : (e as Record<string, TU>)[ a+'Width' ] as number,
    height : (e as Record<string, TU>)[ a+'Height' ] as number
  };
}

/**
 * Get a height in pixels that can help you strech an HTML element vertically
 * to fit the remaining screen space.
 *
 * @param bottom margin between the bottom of the viewport and the streched
 *               element.
 *               e.g. How much space do you want between the bottom of the
 *                    viewport and your element
 * @returns height in pixels
 * @deprecated
 */
export function stretch_to_bottom(bottom: number): number {
  const height = get_viewport_size().height;

  return height - bottom;
}
