import Controller from './AbstractState'
import type {
  IJsonapiDataAttributes,
  IJsonapiResponseResource,
  IStateIncluded
} from '@tuber/shared'
import State from './State'
import { get_state } from '../state'
import { index_by_id } from '../business.logic'

interface IOpts {
  endpoint?: string
}

/**
 * Wrapper class for the `state` representing the JSON:API's top-level member
 * `included`
 */
export default class StateIncluded<T=IJsonapiDataAttributes>
  extends Controller
{
  private _state: IStateIncluded
  private _parent?: State
  private _endpoint?: string
  private _index: Record<string, IJsonapiResponseResource<T>> | null

  constructor (state: IStateIncluded, parent?: State) {
    super()
    this._state = state
    this._parent = parent
    this._index = null
  }

  get state() { return this._state }
  get parent() {
    return this._parent ?? (this._parent = State.fromRootState(get_state()))
  }
  get props() { return this.die('Not implemented', {}) }

  configure(opts: IOpts): this {
    const { endpoint } = opts
    this._endpoint = endpoint
    return this
  }

  private indexIncluded = (): Record<string, IJsonapiResponseResource<T>> | null => {
    if (!this._endpoint) {
      throw new Error('[class] StateIncluded: instance endpoint not set')
    }
    const state = this._state[this._endpoint]
    if (state) {
      const index = index_by_id(state)
      return index as Record<string, IJsonapiResponseResource<T>>
    }
    return null
  }

  /** Included is indexed for O(1) retrieval. */
  get index(): Record<string, IJsonapiResponseResource<T>>| null {
    return this._index ?? (this._index = this.indexIncluded())
  }

  /** Retrieve a resource using its `id`. */
  get = (id: string): IJsonapiResponseResource<T> | undefined => {
    this._index ??= this.indexIncluded()
    return this._index ? this._index[id] : undefined
  }
}