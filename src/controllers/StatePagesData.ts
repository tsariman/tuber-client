import type { TObj } from '@tuber/shared'
import AbstractState from './AbstractState'
import type State from './State'
import type { IStatePagesDataConfig } from '../interfaces/IControllerConfiguration'

/** Wrapper class for a page state data property */
export default class StatePagesData extends AbstractState {
  private _endpoint?: string
  private _state: TObj
  private _parent?: State

  constructor(state: TObj, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): TObj { return this._state }
  /** Chain-access to the root definition. */
  get parent(): State | undefined { return this._parent }
  get props(): TObj { return this.die('Not implemented.', {}) }

  configure({ endpoint }: IStatePagesDataConfig): this {
    this._endpoint = endpoint

    return this
  }

  get<T=unknown>(key: string): T {
    if (!this._endpoint) {
      throw new Error('Endpoint must be configured to access page data.')
    }
    return (this._state[this._endpoint] as TObj<T>)[key]
  }
}
