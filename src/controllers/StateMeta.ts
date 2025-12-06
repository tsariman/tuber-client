import AbstractState from './AbstractState'
import type State from './State'
import Config from '../config'
import type { TObj } from '@tuber/shared'
import { error_id } from '../business.logic/errors'

/** Wrapper class for `initialState.meta` */
export default class StateMeta extends AbstractState {
  private _state: TObj
  private _parent?: State

  constructor (metaState: TObj, parent?: State) {
    super()
    this._state = metaState
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): TObj { return this._state }
  get parent (): State | undefined { return this._parent }
  get props(): unknown { return this.die('Not implemented.', {}) }

  /**
   * Get the metadata retrieved form the server.
   *
   * @param endpoint from which the metadata was retrieved.
   * @param key      of the exact metadata you want.
   */
  get = <T=unknown>(endpoint: string, key: string, $default: T): T => {
    try {
      const val = (this._state[endpoint] as TObj)?.[key]
      return val as T
    } catch (e) {
      if (Config.DEBUG) {
        console.error(`Bad values passed to State.meta:
          either endpoint: '${endpoint}' or key: '${key}' or the data does not
          exist yet.`
        )
        console.error((e as Error).stack)
      }
      error_id(13).remember_error({
        code: 'MISSING_VALUE',
        title: `Bad values passed to State.meta:
          either endpoint: '${endpoint}' or key: '${key}' or the data does not
          exist yet.`,
        source: {
          parameter: `${endpoint}/${key}`
        },
        detail: (e as Error).stack
      }) // error 13
    }
    return $default
  }
}
