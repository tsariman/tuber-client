import {
  post_fetch,
  post_req_state,
  patch_req_state,
  get_req_state,
  delete_req_state
} from '../state/net.actions'
import { has_changes } from './utility'
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
  APP_REQUEST_SUCCESS,
  BOOTSTRAP_ATTEMPTS,
  type TStateKeys,
  type TStatePathnames,
  type TThemeMode,
  type IHandlerDirective,
  type IJsonapiError,
  type IJsonapiResponseResource,
  THEME_MODE
} from '@tuber/shared'
import StateNet from '../controllers/StateNet'
import Config from '../config'
import { net_patch_state } from '../state/actions'
import type React from 'react'
import type { TNetState } from '../interfaces/localized'
import { reset_load_attempts_keys } from './load.attempts'

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
  private _themeMode: TThemeMode

  constructor (directive: IHandlerDirective) {
    this._directive = directive
    this._themeMode = Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE)
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
      'theme_mode': this._themeMode
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
        'theme_mode': this._themeMode
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

  private _setConfigOnDeleteSuccess = (): void => {
    const rules = (this._directive.rules ?? []) as string[]
    if (!rules.includes('bootstrap')) {
      return
    }
    try {
      Config.write(BOOTSTRAP_ATTEMPTS, 0)
      reset_load_attempts_keys()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      ler(`_setConfigOnDeleteSuccess(): Failed to write ${BOOTSTRAP_ATTEMPTS}: ${message}`)
    }
  }

  private _didLastRequestSucceed(redux: IRedux): boolean {
    return redux.store.getState().app.status === APP_REQUEST_SUCCESS
  }

  /** Submit the form data via a POST request to create a new resource */
  private _postFormData = (redux: IRedux) => {
    return async (e: unknown) => {
      if (!this._directive.formName || !this._directive.endpoint) {
        ler('_postFormData(): Missing required formName or endpoint from directive')
        return
      }
      this._initializePrivateFields(redux)
      const button = (e as React.MouseEvent<HTMLButtonElement>)?.currentTarget
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
      const directiveRules = this._directive.rules ?? []
      const disableOnSubmit = directiveRules.includes('disable_on_submit')

      if (disableOnSubmit && button) {
        button.disabled = true
      }

      await dispatch(post_req_state(this._directive.endpoint, requestBody) as never)
      const requestSucceeded = this._didLastRequestSucceed(redux)

      if (!requestSucceeded) {
        if (disableOnSubmit && button) {
          button.disabled = false
        }
        return
      }

      dispatch(A.formsDataClear(this._directive.formName))
      directiveRules.forEach(rule => {
        switch (rule) {
          case 'close_dialog':
            if (this._directive.type === '$form_dialog') {
              dispatch(A.dialogClose())
            }
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

  /** Submit the form data via a PATCH request to update an existing resource */
  private _patchFormData = (redux: IRedux) => {
    return async (e: unknown) => {
      if (!this._directive.formName || !this._directive.endpoint || !this._directive.id) {
        ler('_patchFormData(): Missing required formName, endpoint, or id from directive')
        return
      }
      this._initializePrivateFields(redux)
      const button = (e as React.MouseEvent<HTMLButtonElement>).currentTarget
      await this._performLoadingTask(redux)

      // Task 1 & 2: Acquire endpoint and resource id from the directive
      const { formName, endpoint, id } = this._directive

      // Task 3: Form validation
      const policy = new FormValidationPolicy(redux, formName)
      const validationErrors = policy.applyValidationSchemes()
      if (validationErrors && validationErrors.length > 0) {
        validationErrors.forEach(vError => {
          const message = vError.message ?? ''
          policy.emit(vError.name, message)
        })
        return
      }
      const formData = policy.getFilteredData()

      // Find the existing resource and its index in the store by id
      const { store: { dispatch, getState }, actions: A } = redux
      const directiveRules = this._directive.rules ?? []
      const disableOnSubmit = directiveRules.includes('disable_on_submit')

      if (disableOnSubmit && button) {
        button.disabled = true
      }

      const collection = getState().data[endpoint] as IJsonapiResponseResource[] | undefined
      const index = collection?.findIndex(r => r.id === id) ?? -1
      if (index === -1) {
        ler(`_patchFormData(): Resource with id '${id}' not found in '${endpoint}'`)
        return
      }
      const existingResource = collection![index]

      // Task 4: Guard — skip submission if nothing changed
      if (!has_changes(existingResource.attributes, formData)) {
        return
      }

      // Task 5: Build edited resource and dispatch PATCH
      const editedResource = {
        ...existingResource,
        attributes: {
          ...existingResource.attributes,
          ...formData
        }
      }
      dispatch(A.dataUpdateByIndex({ endpoint, index, resource: editedResource }))
      await dispatch(patch_req_state(`${endpoint}/${editedResource.id}`, { data: editedResource }) as never)

      const requestSucceeded = this._didLastRequestSucceed(redux)
      if (!requestSucceeded) {
        if (disableOnSubmit && button) {
          button.disabled = false
        }
        return
      }

      dispatch(A.formsDataClear(formName))
      directiveRules.forEach(rule => {
        switch (rule) {
          case 'close_dialog':
            if (
              this._directive.type === '$form_patch' ||
              this._directive.type === '$form_dialog'
            ) {
              dispatch(A.dialogClose())
            }
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

  private _filterResourcesList = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux)
      if (!this._directive.endpoint) {
        ler('_filterResourcesList(): Missing required endpoint from directive')
        return
      }
      const { store: { dispatch } } = redux
      const params = this._directive.params
      const queryString = params ? new URLSearchParams(params).toString() : ''
      dispatch(get_req_state(this._directive.endpoint, queryString))
    }
  }

  private _makeGetRequest = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux)
      if (!this._directive.endpoint) {
        ler('_makeGetRequest(): Missing required endpoint from directive')
        return
      }
      const { store: { dispatch } } = redux
      const params = this._directive.params
      const queryString = params ? new URLSearchParams(params).toString() : ''
      dispatch(get_req_state(this._directive.endpoint, queryString))
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

  private _makeDeleteRequest = (redux: IRedux) => {
    return async (e: unknown) => {
      this._initializePrivateFields(redux)
      if (!this._directive.endpoint) {
        ler('_makeDeleteRequest(): Missing required endpoint from directive')
        return
      }
      const { store: { dispatch } } = redux
      const button = (e as React.MouseEvent<HTMLButtonElement>)?.currentTarget
      const directiveRules = this._directive.rules ?? []
      const disableOnSubmit = directiveRules.includes('disable_on_submit')
      directiveRules.forEach(rule => {
        if (rule === 'disable_on_submit') {
          if (button) {
            button.disabled = true
          }
        }
      })

      const result = await dispatch(
        delete_req_state(this._directive.endpoint, '', this._headers) as never
      ) as { ok?: boolean } | undefined

      if (!result?.ok) {
        if (disableOnSubmit && button) {
          button.disabled = false
        }
        return
      }

      this._setConfigOnDeleteSuccess()

      const directiveActions = this._directive.actions ?? []
      directiveActions.forEach(action => {
        dispatch({
          type: action.type,
          payload: action.payload
        })
      })
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
  getEventHandler(): TReduxHandler | null {
    switch (this._directive.type) {
      case '$form':
      case '$form_dialog':
        return this._postFormData
      case '$form_patch':
        return this._patchFormData
      case '$form_none':
        return this._makePostRequest
      case '$deletes':
        return this._makeDeleteRequest
      case '$filter':
        return this._filterResourcesList
      case '$redux_actions':
        return this._runReduxActions
      case '$none':
        return this._makeGetRequest
      default:
        ler(`getEventHandler(): Invalid directive type: ${this._directive.type}`)
        return null
    }
  }

}