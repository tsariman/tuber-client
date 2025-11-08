import { error_id } from './errors';
import type { IJsonapiPaginationLinks } from '@tuber/shared';

type TLink = IJsonapiPaginationLinks[keyof IJsonapiPaginationLinks];

export default class JsonapiPaginationLinks {
  private _links: IJsonapiPaginationLinks;
  private _selfPageNumber?: number;
  private _pageSize?: number;
  private _firstPageNumber?: number;
  private _lastPageNumber?: number;
  private _nextPageNumber?: number;
  private _prevPageNumber?: number;

  constructor (links: IJsonapiPaginationLinks) {
    this._links = links;
    if (!this._links) {
      this._lastPageNumber = 1; // [bugfix]
    }
  }

  /**
   * Get the query string value by key.
   * @param url
   * @param key
   * @returns value of the query string key
   */
  private _get_query_val = (url: string, key: string): string => {
    const query = url.split('?')[1];
    if (!query) return '';
    const pairs = query.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const [k, v] = pair.split('=');
      if (k === key) return v;
    }
    return '';
  };

  get pageSize(): number {
    try {
      return this._pageSize || (
        this._pageSize = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.self),
          'page[size]'
        ))
      );
    } catch (err) {
      // error 7
      error_id(7).remember_exception(err, 'JsonapiPaginationLinks.get: pageSize defaulted to 25.');
      return this._pageSize = 25;
    }
  }

  /** Current page number */
  get selfPageNumber(): number {
    try {
      return this._selfPageNumber || (
        this._selfPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.self),
          'page[number]'
        ))
      );
    } catch (err) {
      // error 8 
      error_id(8).remember_exception(err, 'JsonapiPaginationLinks.get: selfPageNumber defaulted to 1.');
      return this._selfPageNumber = 1;
    }
  }

  get firstPageNumber(): number {
    try {
      return this._firstPageNumber || (
        this._firstPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.first),
          'page[number]'
        ))
      );
    } catch (err) {
      // error 9
      error_id(9).remember_exception(err, 'JsonapiPaginationLinks.get: firstPageNumber defaulted to 1.');
      return this._firstPageNumber = 1;
    }
  }

  get lastPageNumber(): number {
    try {
      return this._lastPageNumber || (
        this._lastPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.last),
          'page[number]'
        ))
      );
    } catch (err) {
      // error 10
      error_id(10).remember_exception(err, 'JsonapiPaginationLinks.get: lastPageNumber defaulted to 1.');
      return this._lastPageNumber = 1;
    }
  }

  get nextPageNumber(): number {
    try {
      return this._nextPageNumber || (
        this._nextPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.next),
          'page[number]'
        ))
      );
    } catch (err) {
      // error 11
      error_id(11).remember_exception(err, 'JsonapiPaginationLinks.get: nextPageNumber defaulted to 1.');
      return this._nextPageNumber = 1;
    }
  }

  get prevPageNumber(): number {
    try {
      return this._prevPageNumber || (
        this._prevPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.prev),
          'page[number]'
        ))
      );
    } catch (err) {
      // error 12
      error_id(12).remember_exception(err, 'JsonapiPaginationLinks.get: prevPageNumber defaulted to 1.');
      return this._prevPageNumber = 1;
    }
  }

  /** Get a link url with updated an query string. */
  getLinkUrl({
    pageNumber,
    pageSize,
    // TODO Add more query params to update
  }: {pageNumber?: number, pageSize?: number}) {
    const qs = get_jsonapi_link_url(this._links.self);
    const params = new URLSearchParams(qs);
    if (pageNumber) {
      params.set('page[number]', pageNumber.toString());
    }
    if (pageSize) {
      params.set('page[size]', pageSize.toString());
    }
    const updatedQs = params.toString();
    return updatedQs;
  }
}

/** Returns the url, including the query parameters as a string. */
export function get_jsonapi_link_url (link: TLink): string {
  switch (typeof link) {
    case 'string':
      return link;
    case 'object':
      return link.href;
    default:
      return '';
  }
}