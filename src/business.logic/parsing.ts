/**
 * Parsing Utilities
 *
 * This module provides utility functions for parsing and manipulating various
 * data formats including content definitions, URLs, cookies, and strings.
 * These functions are used throughout the application for data transformation
 * and validation.
 */

import {
  APP_CONTENT_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
} from '@tuber/shared'
import type { IStatePageContent } from '@tuber/shared'
import { ler } from './logging'
import Config from 'src/config'

/**
 * Parses the definition string found in `PageState.content` and
 * `StateDialogForm.content`.
 *
 * Format: "type : name : endpoint : args"
 *
 * **type**: Type of content found on the page.
 * **name**: Identifier for a specific content.
 * **endpoint**: Endpoint to which data may be sent or retrieved for the page.
 * **args**: URL arguments when making server requests using the endpoint.
 *
 * @param content The content definition string to parse
 * @returns An `IStatePageContent` object with parsed properties
 */
export function get_parsed_content(content?: unknown): IStatePageContent {
  if (typeof content !== 'string') {
    throw new Error('Content is not a string.')
  }
  const options = content.replace(/\s+/g, '').split(':')
  if (options.length <= 1) {
    ler('get_parsed_page_content: Invalid or missing `page` content definition')
    return {
      type: APP_CONTENT_VIEW,
      name: DEFAULT_LANDING_PAGE_VIEW
    }
  }
  const contentObj: IStatePageContent = {
    type: options[0],
    name: options[1]
  }
  if (options.length >= 3) {
    contentObj.endpoint = options[2]
  }
  if (options.length >= 4) {
    contentObj.args = options[3]
  }
  return contentObj
}

/**
 * Parses the document cookie string into an object.
 *
 * @returns An object containing all cookie key-value pairs
 */
export function parse_cookies() {
  const cookies = {} as Record<string, string>
  const pairs = document.cookie.split(';')

  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(s => s.trim())
    cookies[key] = value
  })

  return cookies
}

/**
 * Gets the value of a cookie by name.
 *
 * @param name The name of the cookie to retrieve
 * @returns The cookie value as the specified type, or empty string if not found
 */
export function get_cookie<T=string>(name: string): T {
  const cookies = parse_cookies()
  const cookie = cookies[name] ?? ''
  return cookie as unknown as T
}

/**
 * Sets or removes a query parameter in a URL.
 *
 * @param url The URL to modify
 * @param param The query parameter name
 * @param val The value to set (if undefined, the parameter will be removed)
 * @returns The modified URL string
 *
 * @deprecated Not in use
 */
export function set_url_query_val(url: string, param: string, val?: string) {
  const urlObj = new URL(url)
  const query = new URLSearchParams(urlObj.searchParams)
  const { origin, pathname } = urlObj
  if (typeof val === 'undefined') {
    query.delete(param)
    const newUrl = `${origin}${pathname}?${query.toString()}`
    return newUrl
  }
  query.set(param, val.toString())
  const newUrl = `${origin}${pathname}?${query.toString()}`
  return newUrl
}

/**
 * Set a value within an object.
 *
 * @param obj arbitrary object
 * @param path dot-separated list of properties e.g. "pagination.users.limit"
 * @param val value to be assigned
 */
export function set_val(obj: object, path: string, val: unknown): void {
  if (!obj || typeof obj !== 'object') {
    throw new Error('set_val: obj must be an object')
  }
  if (!path || typeof path !== 'string') {
    throw new Error('set_val: path must be a non-empty string')
  }

  const propArray = path.split('.')
  let current = obj as Record<string, unknown>

  // Navigate to the parent of the target property
  for (let i = 0; i < propArray.length - 1; i++) {
    const prop = propArray[i]
    
    // If property doesn't exist or isn't an object, create it
    if (!current[prop] || typeof current[prop] !== 'object' || Array.isArray(current[prop])) {
      current[prop] = {}
    }
    
    current = current[prop] as Record<string, unknown>
  }

  // Set the final property
  const finalProp = propArray[propArray.length - 1]
  current[finalProp] = val
}

/** Get the bootstrap key from meta tag. */
export function get_bootstrap_key(): string {
  const savedKey = Config.read('bootstrap_key', '')
  if (savedKey) { return savedKey }
  const meta = document.querySelector('meta[name="bootstrap"]')
  const key = (meta as HTMLMetaElement)?.content
  if (key) {
    Config.set('bootstrap_key', key)
    return key
  }
  return ''
}

/**
 * Gets the content of an HTML meta tag by name.
 *
 * @param name The name attribute of the meta tag
 * @param $default The default value to return if the meta tag is not found
 * @returns The content of the meta tag or the default value
 */
export function get_head_meta_content(name: string, $default = 'app'): string {
  const element = document.querySelector(`meta[name="${name}"]`)
  const meta = element as HTMLMetaElement | null
  return meta && meta.content ? meta.content : $default
}

/**
 * Gets the base route from a template route by ignoring path variables.
 *
 * @param templateRoute The template route string (e.g., "/users/:id/posts")
 * @returns The base route (e.g., "users")
 */
export function get_base_route(templateRoute?: string): string {
  if (!templateRoute) return ''
  return templateRoute.replace(/^\/|\/$/g, '').split('/')[0]
}

/**
 * Ensures the origin URL has a trailing forward slash.
 *
 * @param origin The origin URL to process (optional)
 * @returns The origin URL with a trailing slash, or window.location.origin with a trailing slash if no origin provided
 */
export function get_origin_ending_fixed(origin?: string): string {
  if (origin) {
    return origin.slice(-1) === '/' ? origin : origin + '/'
  }
  return window.location.origin + '/'
}

/**
 * Removes the trailing forward slash from an endpoint if present.
 *
 * @param endpoint The endpoint string to clean
 * @returns The endpoint without a trailing slash
 */
export function clean_endpoint_ending(endpoint?: string): string {
  if (endpoint) {
    return endpoint.slice(-1) === '/' ? endpoint.slice(0, -1) : endpoint
  }
  return ''
}

/**
 * Ensures a query string starts with a question mark.
 *
 * @param query The query string to process
 * @returns The query string prefixed with '?' if it doesn't already start with one
 */
export function get_query_starting_fixed(query?: string): string {
  if (query) {
    return query.charAt(0) === '?' ? query : '?' + query
  }
  return ''
}

/**
 * Parses all query string parameters from a URL into an object.
 *
 * @param url The URL containing query parameters
 * @returns An object containing all query parameter key-value pairs
 */
export function get_query_values(url: string): { [key: string]: string } {
  const query = url.split('?')[1]
  if (!query) return {}
  const values: { [key: string]: string } = {}
  const pairs = query.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]
    const [k, v] = pair.split('=')
    values[k] = v
  }
  return values
}

/**
 * Ensures that the form name ends with the suffix 'Form'.
 *
 * @param name
 * @returns string
 */
export function get_state_form_name(name: string): string {
  return name.slice(-4) === 'Form' ? name : name + 'Form'
}

/**
 * Ensures that the dialog name ends with 'Dialog'.
 *
 * @param {string} name 
 * @returns {string}
 * 
 * @deprecated Not in use
 */
export function get_state_dialog_name(name: string): string {
  return name.slice(-6) === 'Dialog' ? name : name + 'Dialog'
}

/**
 * Removes leading and trailing forward and back slashes from a string.
 *
 * @param str The string to trim
 * @returns The string with leading and trailing slashes removed
 */
export function trim_slashes(str: string): string {
  let s = str
  while(s.charAt(0) === '/' || s.charAt(0) === '\\')
  {
    s = s.substring(1)
  }
  while (s.charAt(s.length - 1) === '/' || s.charAt(s.length - 1) === '\\')
  {
    s = s.substring(0, s.length - 1)
  }
  return s
}

/**
 * Extracts the endpoint from a pathname.
 *
 * The pathname can include a query string (e.g., `name1/name2?q=123`).
 * This function will not work with full URLs that include the domain name
 * and/or protocol.
 *
 * @param pathname The pathname to extract the endpoint from
 * @returns The extracted endpoint (last segment of the path)
 */
export function get_endpoint(pathname: string): string {
  let pname = trim_slashes(pathname)
  const argsIndex = pathname.indexOf('?')
  if (argsIndex >= 0) {
    pname = pathname.substring(0, argsIndex)
  }
  const params = pname.split(/\/|\\/)

  return params[params.length - 1]
}

/**
 * Converts an endpoint containing hyphens to camelCase.
 *
 * @param endpoint The endpoint string to convert
 * @returns The camelCase version of the endpoint
 */
export function camelize(endpoint: string): string {
  return endpoint.replace(/-([a-zA-Z])/g, g => g[1].toUpperCase())
}
