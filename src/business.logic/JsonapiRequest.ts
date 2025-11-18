import type {
  IJsonapiDataAttributes,
  IJsonapiDataRelationships,
  IJsonapiRequestClient,
  IJsonapiResourceLinks
} from '@tuber/shared';

/** Formats the request using the JSON:API specification. */
export default class JsonapiRequest<T=IJsonapiDataAttributes> {

  private _request: IJsonapiRequestClient<T>;

  constructor(type: string, attributes: T) {
    this._request = {
      data: {
        type,
        attributes
      }
    };
  }

  setType(type: string) {
    this._request.data.type = type;
    return this;
  }

  setId(id: string) {
    this._request.data.id = id;
    return this;
  }

  setAttributes(attributes: T) {
    this._request.data.attributes = attributes;
    return this;
  }

  setRelationships(relationships: IJsonapiDataRelationships) {
    this._request.data.relationships = relationships;
    return this;
  }

  setMeta(meta: Record<string, unknown>) {
    this._request.data.meta = meta;
    return this;
  }

  meta(key: string, value: unknown) {
    if (!this._request.data.meta) {
      this._request.data.meta = {};
    }
    this._request.data.meta[key] = value;
    return this;
  }

  setLinks(links: IJsonapiResourceLinks) {
    this._request.data.links = links;
    return this;
  }

  link(key: string, value: string) {
    if (!this._request.data.links) {
      if (key !== 'self') {
        throw new Error('self link must be set before other links');
      }
      this._request.data.links = { self: value };
    } else {
      this._request.data.links[key] = value;
    }
    return this;
  }

  build() { return this._request; }
}