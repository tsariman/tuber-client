import type { TO } from '@tuber/shared'
import AbstractState from './AbstractState'
import type State from './State'
import type { IStatePagesDataConfig } from '../interfaces/IControllerConfiguration'

/** Wrapper (controller) class for a page state data property */
export default class StatePagesData extends AbstractState {
  private _endpoint?: string
  private _state: TO
  private _parent?: State

  constructor(state: TO, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): TO { return this._state }
  /** Chain-access to the root definition. */
  get parent(): State | undefined { return this._parent }
  get props(): TO { return this.die<TO>('Not implemented.', {}) }

  configure({ endpoint }: IStatePagesDataConfig): this {
    this._endpoint = endpoint

    return this
  }

  get<T=unknown>(key: string): T | undefined {
    if (!this._endpoint) {
      throw new Error('Endpoint must be configured to access page data.')
    }
    return (this._state[this._endpoint] as TO<T>)?.[key]
  }
}
