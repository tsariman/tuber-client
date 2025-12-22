import AbstractState from './AbstractState'
import type {
  IJsonapiDataAttributes,
  IJsonapiResponseResource,
  IStateData,
  TObj
} from '@tuber/shared'
import type State from './State'
import type { IStateDataConfig } from '../interfaces/IControllerConfiguration'
import { index_by_attribute_member, index_by_id } from '../business.logic/indexes'

/** Wrapper class for `initialState.data` */
export default class StateData extends AbstractState {
  private _state: IStateData
  private _parent?: State
  private _endpoint?: string
  private _attribute?: string
  private _flattenedCollection?: IJsonapiDataAttributes[]
  private _includedProps: { id: boolean, type: boolean }

  constructor(state: IStateData, parent?: State) {
    super()
    this._state = state
    this._parent = parent
    this._includedProps = { id: false, type: false }
  }

  get state(): IStateData { return this._state }
  get parent(): State | undefined { return this._parent }
  get props(): TObj { return this.die('Not implemented yet.', {}) }

  get noCollection(): boolean {
    return this._state && Object.keys(this._state).length === 0
  }

  configure<T>(opts: IStateDataConfig<T>): this {
    const { endpoint, attribute } = opts
    this._endpoint = endpoint
    if (attribute) { this._attribute = attribute as string }
    return this
  }

  /**
   * Get a collection or a single document in a collection.
   *
   * @param endpoint
   * @param index
   */
  getResourceById = <T = IJsonapiDataAttributes>(id: string): IJsonapiResponseResource<T> | undefined => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', undefined)
    }
    const collection = this._state[this._endpoint]
    if (!collection) {
      return undefined
    }
    return index_by_id<T>(
      collection as IJsonapiResponseResource<T>[]
    )?.[id] || undefined
  }

  /** Get a resource document by an attribute's member value. */
  getByResourceAttribute = <T = IJsonapiDataAttributes>(
    value: string
  ): IJsonapiResponseResource<T> | undefined => {
    if (!this._endpoint || !this._attribute) {
      return this.die('StateData: Endpoint not set.', undefined)
    }
    return index_by_attribute_member(
      this._state[this._endpoint] as IJsonapiResponseResource<T>[],
      this._attribute as keyof T
    )?.[value] || undefined
  }

  /** Get a resource document by its index in the collection array. */
  getResourceByIndex = <T = IJsonapiDataAttributes>(
    index: number
  ): IJsonapiResponseResource<T> | undefined => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set', undefined)
    }
    return this._state[this._endpoint]?.[index] as IJsonapiResponseResource<T> | undefined
  }

  /** Search resources in the collection by a predicate function. */
  searchResources = <T=IJsonapiDataAttributes>(
    predicate: (value: IJsonapiResponseResource<T>, index: number, array: IJsonapiResponseResource<T>[]) => boolean
  ): IJsonapiResponseResource<T>[] => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', [])
    }
    const resources = this._state[this._endpoint]
    if (!resources) {
      return this.notice(
        `StateData: '${this._endpoint}' collection not found.`,
        []
      )
    }
    return (resources as IJsonapiResponseResource<T>[]).filter(predicate)
  }

  /** Get all resources in the collection. */
  getResources = <T=IJsonapiDataAttributes>(): IJsonapiResponseResource<T>[] => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', [])
    }
    const resources = this._state[this._endpoint]
    if (!resources) {
      return this.notice(
        `StateData: '${this._endpoint}' collection not found.`,
        []
      )
    }
    return resources as IJsonapiResponseResource<T>[]
  }

   /** Include the 'id' or the 'type'. */
   include(prop: 'id' | 'type'): this {
    this._includedProps[prop] = true
    return this
  }

  /** Merges id, type, and the attributes members */
  flatten(): this {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', this)
    }
    const { id, type } = this._includedProps
    this._flattenedCollection = this.getResources().map(resource => {
      if (!id && !type) {
        return resource.attributes || {}
      } else if (id && !type) {
        return { id: resource.id, ...resource.attributes }
      } else if (!id && type) {
        return { type: resource.type, ...resource.attributes }
      } else {
        return { id: resource.id, type: resource.type, ...resource.attributes }
      }
    })
    return this
  }

  /** Get flattened collection */
  get<T=IJsonapiDataAttributes>(): T[] {
    if (!this._flattenedCollection) {
      return this.die('StateData: Run flatten() first.', [])
    }
    return this._flattenedCollection as T[]
  }

  /** */
  isEmpty(): boolean {
    return this.getResources().length === 0
  }

  /** Delete array elements by index range */
  rangeDelete(
    range: { startIndex: number, endIndex: number}
  ): IJsonapiResponseResource[] {
    const { startIndex, endIndex } = range
    const arr = this.getResources()
    return arr.slice(0, startIndex).concat(arr.slice(endIndex + 1))
  }
}
