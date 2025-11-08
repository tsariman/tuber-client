import { mongo_object_id } from './utility';
import type {
  IJsonapiError,
  IJsonapiErrorLinks,
  IJsonapiErrorSource,
  TJsonapiErrorStatus,
  TJsonapiMeta
} from '@tuber/shared';

export default class JsonapiError implements IJsonapiError {
  private _e: IJsonapiError;
  private _id?: string;

  constructor(e: IJsonapiError) { this._e = e; }

  get json(): IJsonapiError { return this._e; }
  get id(): string {
    return this._id || (this._id = this._e.id || mongo_object_id());
  }
  get links(): IJsonapiErrorLinks { return this._e.links ?? {}; }
  get status(): TJsonapiErrorStatus { return this._e.status ?? '200'; }
  get code()  { return this._e.code; }
  get title() { return this._e.title; }
  get detail(): string { return this._e.detail ?? ''; }
  get source(): IJsonapiErrorSource { return this._e.source ?? {}; }
  get meta(): TJsonapiMeta { return this._e.meta ?? {}; }
}
