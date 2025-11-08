import { get_state } from '../state';
import type { TObj } from '@tuber/shared';
import AbstractState from './AbstractState';
import State from './State';

export default class StateFormsData extends AbstractState {
  private _formsDataState: TObj;
  private _parent?: State;

  constructor (formsDataState: TObj, parent?: State) {
    super();
    this._formsDataState = formsDataState;
    this._parent = parent;
  }

  get state(): TObj { return this._formsDataState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): TObj { return this.die<TObj>('Not implemented.', {}); }
  get theme(): TObj { return this.die<TObj>('Not implemented.', {}); }

  /**
   * Get form field value from redux store.
   * 
   * @param formName Name of the form
   * @param name Name of the field
   */
  getValue = <T>(formName: string, name: string, $default?: T): T => {
    return ((this._formsDataState[formName] as TObj<T>)?.[name] ?? $default) as T;
  }

  /**
   * Alias for `getStoredValue()`
   *
   * @param formName
   * @param name
   */
  get = <T = TObj>(formName: string): T => {
    return (this._formsDataState[formName] ?? {}) as T;
  }

}
