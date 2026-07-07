import { error_id } from './errors'
import type { IJsonapiPaginationLinks } from '@tuber/shared'

type TLink = IJsonapiPaginationLinks[keyof IJsonapiPaginationLinks]

export default class JsonapiPaginationLinks {
  private _links: IJsonapiPaginationLinks
  private _selfPageNumber?: number
  private _pageSize?: number
  private _firstPageNumber?: number
  private _lastPageNumber?: number
  private _nextPageNumber?: number
  private _prevPageNumber?: number

  constructor (links?: IJsonapiPaginationLinks) {
    // Defensive fallback: links can be undefined at runtime before store hydration.
    this._links = (links || { self: '' }) as IJsonapiPaginationLinks
  }

  private _getSearchParams(url: string): URLSearchParams {
    if (!url) {
      return new URLSearchParams()
    }

    try {
      if (url.startsWith('?')) {
        return new URLSearchParams(url.slice(1))
      }

      if (url.includes('://') || url.startsWith('/')) {
        return new URL(url, window.location.origin).searchParams
      }

      if (url.includes('?')) {
        return new URLSearchParams(url.split('?')[1])
      }

      return new URLSearchParams(url)
    } catch {
      const query = url.split('?')[1] || ''
      return new URLSearchParams(query)
    }
  }

  private _toPositiveNumber(value: string, fallback: number): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
  }

  /**
   * Get the query string value by key.
   * @param url
   * @param key
   * @returns value of the query string key
   */
  private _getQueryVal = (url: string, key: string): string => {
    const params = this._getSearchParams(url)
    return params.get(key) ?? ''
  }

  get pageSize(): number {
    try {
      return this._pageSize || (
        this._pageSize = this._toPositiveNumber(this._getQueryVal(
          get_jsonapi_link_url(this._links.self),
          'page[size]'
        ), 25)
      )
    } catch (err) {
      // error 7
      error_id(7).remember_exception(err, 'JsonapiPaginationLinks.get: pageSize defaulted to 25.')
      return this._pageSize = 25
    }
  }

  /** Current page number */
  get selfPageNumber(): number {
    try {
      return this._selfPageNumber || (
        this._selfPageNumber = this._toPositiveNumber(this._getQueryVal(
          get_jsonapi_link_url(this._links.self),
          'page[number]'
        ), 1)
      )
    } catch (err) {
      // error 8 
      error_id(8).remember_exception(err, 'JsonapiPaginationLinks.get: selfPageNumber defaulted to 1.')
      return this._selfPageNumber = 1
    }
  }

  get firstPageNumber(): number {
    try {
      return this._firstPageNumber || (
        this._firstPageNumber = this._toPositiveNumber(this._getQueryVal(
          get_jsonapi_link_url(this._links.first),
          'page[number]'
        ), 1)
      )
    } catch (err) {
      // error 9
      error_id(9).remember_exception(err, 'JsonapiPaginationLinks.get: firstPageNumber defaulted to 1.')
      return this._firstPageNumber = 1
    }
  }

  get lastPageNumber(): number {
    try {
      return this._lastPageNumber || (
        this._lastPageNumber = this._toPositiveNumber(this._getQueryVal(
          get_jsonapi_link_url(this._links.last),
          'page[number]'
        ), 1)
      )
    } catch (err) {
      // error 10
      error_id(10).remember_exception(err, 'JsonapiPaginationLinks.get: lastPageNumber defaulted to 1.')
      return this._lastPageNumber = 1
    }
  }

  get nextPageNumber(): number {
    try {
      return this._nextPageNumber || (
        this._nextPageNumber = this._toPositiveNumber(this._getQueryVal(
          get_jsonapi_link_url(this._links.next),
          'page[number]'
        ), 1)
      )
    } catch (err) {
      // error 11
      error_id(11).remember_exception(err, 'JsonapiPaginationLinks.get: nextPageNumber defaulted to 1.')
      return this._nextPageNumber = 1
    }
  }

  get prevPageNumber(): number {
    try {
      return this._prevPageNumber || (
        this._prevPageNumber = this._toPositiveNumber(this._getQueryVal(
          get_jsonapi_link_url(this._links.prev),
          'page[number]'
        ), 1)
      )
    } catch (err) {
      // error 12
      error_id(12).remember_exception(err, 'JsonapiPaginationLinks.get: prevPageNumber defaulted to 1.')
      return this._prevPageNumber = 1
    }
  }

  /** Get a link url with updated an query string. */
  getLinkUrl({
    pageNumber,
    pageSize,
    // TODO Add more query params to update
  }: {pageNumber?: number, pageSize?: number}) {
    const self = get_jsonapi_link_url(this._links?.self)
    if (!self) {
      return ''
    }
    const params = this._getSearchParams(self)
    if (pageNumber) {
      params.set('page[number]', pageNumber.toString())
    }
    if (pageSize) {
      params.set('page[size]', pageSize.toString())
    }
    const updatedQs = params.toString()
    return updatedQs
  }
}

/** Returns the url, including the query parameters as a string. */
export function get_jsonapi_link_url (link: TLink): string {
  switch (typeof link) {
    case 'string':
      return link
    case 'object':
      return link.href
    default:
      return ''
  }
}