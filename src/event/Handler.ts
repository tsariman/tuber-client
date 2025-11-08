
export default class Handler<T = unknown> {
  private _handler: T;

  constructor (handler: T) {
    this._handler = handler;
  }

  get(): T { return this._handler; }
}