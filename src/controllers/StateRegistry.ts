import { ler } from '../business.logic/logging';
import { error_id } from '../business.logic/errors'
import { get_state } from '../state';
import AbstractState from './AbstractState';
import State from './State';

export default class StateRegistry extends AbstractState {
  private _registryState: Record<string, unknown>;
  private _parent?: State;
  constructor(registryState: Record<string, unknown>, parent?: State) {
    super();
    this._registryState = registryState;
    this._parent = parent;
  }
  get state(): Record<string, unknown> {
    return this._registryState;
  }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): Record<string, unknown> {
    return this.die('Not implemented', {});
  }
  get theme(): unknown { return this.die('Not implemented', {});}
  get<T = unknown>(key: string, defaultValue?: T): T {
    try {
      const val = this._registryState[key];
      if (typeof val !== 'undefined') {
        return val as T;
      }
      return defaultValue as T;
    } catch (e) {
      ler(`StateRegistry.get(): error for key "${key}"`);
      error_id(15).remember_exception(e); // error 15
      return defaultValue as T;
    }
  }
}