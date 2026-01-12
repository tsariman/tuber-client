import { post_fetch, post_req_state } from '../state/net.actions'
import type { IRedux, TReduxHandler } from '../state'
import {
  JsonapiRequest,
  get_val,
  get_origin_ending_fixed,
  remember_jsonapi_errors,
  FormValidationPolicy,
  ler,
  pre
} from '.'
import {
  type TStateKeys,
  type TStatePathnames,
  type TThemeMode,
  type IHandlerDirective,
  type IJsonapiError,
  THEME_DEFAULT_MODE,
  THEME_MODE
} from '@tuber/shared'
import StateNet from '../controllers/StateNet'
import Config from '../config'
import { net_patch_state } from '../state/actions'
import type React from 'react'
import type { TNetState } from '../interfaces/localized'

/**
 * Provides a default callback for buttons, links, ...etc, in case they need one.
 */
export default class ReduxHandlerFactory {
  private _directive: IHandlerDirective
  private _errorPrefix = '[class] ReduxHandlerFactory:'
  private _redux?: IRedux
  private __pathnames?: TStatePathnames
  private __headers?: Record<string, string>
  private __origin?: string
  private _mode: TThemeMode

  constructor (directive: IHandlerDirective) {
    this._directive = directive
    this._mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
    pre(this._errorPrefix)
  }

  private _initializePrivateFields(r: IRedux): void {
    this._redux ??= r
    const { store: { getState } } = r
    const { app, pathnames, net } = getState()
    this.__origin ??= get_origin_ending_fixed(app.origin)
    this.__headers ??= new StateNet(net).headers
    this.__pathnames ??= pathnames
  }

  private _pathnamesNotDefined(): never {
    throw new Error(`${this._errorPrefix} __pathnames is NOT defined.`)
  }

  private _headersNotDefined(): never {
    throw new Error(`${this._errorPrefix} __headers is NOT defined.`)
  }

  private _originNotDefined(): never {
    throw new Error(`${this._errorPrefix} __origin is NOT defined.`)
  }

  private get _pathnames(): TStatePathnames {
    return this.__pathnames ?? this._pathnamesNotDefined()
  }

  private get _headers() {
    return this.__headers ?? this._headersNotDefined()
  }

  private get _origin() {
    return this.__origin ?? this._originNotDefined()
  }

  /**
   * Indicates whether the state fragment has already been retrieved from
   * server.
   */
  private _isAlreadyLoaded(r: IRedux, stateName: TStateKeys, key: string) {
    const registry = r.store.getState().dynamicRegistry
    return typeof registry[`${stateName}.${key}`] === 'number'
  }

  /** Loads a single state fragment */
  private async _loadSingleStateFragment(
    r: IRedux,
    statename: TStateKeys,
    key: string
  ): Promise<TNetState | undefined> {
    if (this._isAlreadyLoaded(r, statename, key)) {
      return undefined
    }
    const { store: { dispatch, getState }, actions: A } = r
    const rootState = getState()
    const pathname = rootState.pathnames[statename]
    const url = `${rootState.app.origin}${pathname}`
    const response = await post_fetch(url, {
      key,
      'mode': this._mode
    }, this._headers)
    const errors = get_val<IJsonapiError[]>(response, 'errors')
    if (errors) {
      ler(`_loadSingleStateFragment(): ${errors[0].title}`)
      remember_jsonapi_errors(errors)
      return undefined
    }
    const stateFragment = get_val<TNetState>(response, 'state')
    if (!stateFragment) {
      return undefined
    }
    dispatch(net_patch_state(stateFragment))
    // Register state fragment as already loaded.
    dispatch(A.dynamicRegistryAdd({
      prop: `${statename}.${key}`,
      value: Date.now()
    }))
    return stateFragment
  }

  /** Loads multiple state fragments */
  private async _loadMultipleStateFragments(
    r: IRedux,
    statename: TStateKeys,
    keyList: string[]
  ): Promise<TNetState[]> {
    const pathname = this._pathnames[statename]
    const url = `${this._origin}${pathname}`
     // [TODO] Upgrade the server so it can handle an array of keys as request.
    const statePromises = keyList.map(async key => {
      if (this._isAlreadyLoaded(r, statename, key)) {
        return undefined
      }
      const response = await post_fetch(url, {
        key,
        'mode': this._mode
      }, this._headers)
      const errors = get_val<IJsonapiError[]>(response, 'errors')
      if (errors) {
        ler(`_performArrayDetail(): ${errors[0].title}`)
        remember_jsonapi_errors(errors)
        return undefined
      }
      const state = get_val<TNetState>(response, 'state')
      if (state) {
        const { store, actions: A } = r
        store.dispatch(net_patch_state(state))
        // Register state fragment as already loaded.
        store.dispatch(A.dynamicRegistryAdd({
          prop: `${statename}.${key}`,
          value: Date.now()
        }))
      }
      return state
    })
    
    const states = await Promise.all(statePromises)
    const validStates = states.filter((state): state is TNetState => state !== undefined)
    return validStates
  }

  /** Loads the required states from server */
  private _performLoadingTask = async (r: IRedux) => {
    const loadDetail = this._directive.load
    if (!loadDetail) { return }
    const promises = Object.entries(loadDetail).map(async detail => {
      const [ statename, stateId ] = detail
      switch (typeof stateId) {
        case 'string':
          await this._loadSingleStateFragment(
            r,
            statename as TStateKeys,
            stateId
          )
          break
        case 'object':
          await this._loadMultipleStateFragments(
            r,
            statename as TStateKeys,
            stateId
          )
          break
        default:
          ler('_performLoadingTask(): State load id type invalid')
      }
    })
    await Promise.all(promises)
  }

  /** Submit the form data via a POST request to create a new resource */
  private _postFormData = (redux: IRedux) => {
    return async (e: unknown) => {
      if (!this._directive.formName || !this._directive.endpoint) {
        ler('_postFormData(): Missing required formName or endpoint from directive')
        return
      }
      this._initializePrivateFields(redux)
      const button = (e as React.MouseEvent<HTMLButtonElement>).currentTarget
      await this._performLoadingTask(redux)
      const policy = new FormValidationPolicy(redux, this._directive.formName)
      const validationErrors = policy.applyValidationSchemes()
      if (validationErrors && validationErrors.length > 0) {
        validationErrors.forEach(vError => {
          const message = vError.message ?? ''
          policy.emit(vError.name, message)
        })
        return
      }
      const formData = policy.getFilteredData()
      const { store: { dispatch }, actions: A } = redux
      const requestBody = new JsonapiRequest(this._directive.endpoint, formData).build()
      dispatch(post_req_state(this._directive.endpoint, requestBody))
      dispatch(A.formsDataClear(this._directive.formName))
      const directiveRules = this._directive.rules ?? []
      directiveRules.forEach(rule => {
        switch (rule) {
          case 'close_dialog':
            if (this._directive.type === '$form_dialog') {
              dispatch(A.dialogClose())
            }
            break
          case 'disable_on_submit':
            button.disabled = true
            break
        }
      })
      const directiveActions = this._directive.actions ?? []
      directiveActions.forEach(action => {
        dispatch({
          type: action.type,
          payload: action.payload
        })
      })
    }
  }

  // private _patchFormData = (redux: IRedux) => {
  //   return async () => {
  //     // TODO: Implement form data PATCH submission.
  //   }
  // }

  private _filterResourcesList = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux)

      // [TODO] Implement filtering resources data.

      throw new Error(
        `${this._errorPrefix} _filterResourcesList() NOT implemented.`
      )
    }
  }

  private _makeGetRequest = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux)

      // [TODO] Implement making a GET request.

      throw new Error(`${this._errorPrefix} _makeGetRequest() NOT implemented.`)
    }
  }

  private _makePostRequest = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux)
      if (this._directive.endpoint) {
        const { store: { dispatch } } = redux
        const directiveActions = this._directive.actions ?? []
        directiveActions.forEach(action => {
          dispatch({
            type: action.type,
            payload: action.payload
          })
        })
        dispatch(post_req_state(this._directive.endpoint, {}, this._headers))
      }
    }
  }

  /** Executes Redux actions specified in the directive */
  private _runReduxActions = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux)
      const { store: { dispatch } } = redux
      const directiveActions = this._directive.actions ?? []
      directiveActions.forEach(action => {
        dispatch({
          type: action.type,
          payload: action.payload
        })
      })
    }
  }

  /** Returns the appropriate callback based on the directive type */
  getDirectiveCallback(): TReduxHandler | null {
    switch (this._directive.type) {
      case '$form':
      case '$form_dialog':
        return this._postFormData
      case '$form_none':
        return this._makePostRequest
      case '$filter':
        return this._filterResourcesList
      case '$redux_actions':
        return this._runReduxActions
      case '$none':
        return this._makeGetRequest
      default:
        ler(`getDefaultCallback(): Invalid directive type: ${this._directive.type}`)
        return null
    }
  }

}