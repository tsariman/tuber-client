import { post_fetch, post_req_state } from '../state/net.actions';
import { actions, type IRedux, type TReduxHandler } from '../state';
import {
  JsonapiRequest,
  get_val,
  get_origin_ending_fixed,
  remember_jsonapi_errors,
  FormValidationPolicy,
  ler,
  pre
} from '../business.logic';
import {
  type IStateKeys,
  type TStatePathnames,
  type TThemeMode,
  type IHandleDirective,
  type IJsonapiError,
  THEME_DEFAULT_MODE,
  THEME_MODE
} from '@tuber/shared';
import StateNet from '../controllers/StateNet';
import Config from '../config';
import { net_patch_state } from '../state/actions';
import type React from 'react';
import type { TNetState } from '../localized/interfaces';

/**
 * Provides a default callback for buttons, links, ...etc, in case they need one.
 */
export default class ReduxHandlerFactory {
  private _directive: IHandleDirective;
  private _errorPrefix = '[class] StateHandleFactory:';
  private _redux?: IRedux;
  private __pathnames?: TStatePathnames;
  private __headers?: Record<string, string>;
  private __origin?: string;
  private _mode: TThemeMode;

  constructor (directive: IHandleDirective) {
    this._directive = directive;
    this._mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE);
    pre(`[class] StateHandleFactory:`);
  }

  private _initializePrivateFields(r: IRedux): void {
    this._redux ??= r;
    const { store: { getState } } = r;
    const { app, pathnames, net } = getState();
    this.__origin ??= get_origin_ending_fixed(app.origin);
    this.__headers ??= new StateNet(net).headers;
    this.__pathnames ??= pathnames as TStatePathnames;
  }

  private _pathnamesNotDefined(): never {
    throw new Error(`${this._errorPrefix} __pathnames is NOT defined.`);
  }

  private _headersNotDefined(): never {
    throw new Error(`${this._errorPrefix} __headers is NOT defined.`);
  }

  private _originNotDefined(): never {
    throw new Error(`${this._errorPrefix} __origin is NOT defined.`);
  }

  private get _pathnames(): TStatePathnames {
    return this.__pathnames ?? this._pathnamesNotDefined();
  }

  private get _headers() {
    return this.__headers ?? this._headersNotDefined();
  }

  private get _origin() {
    return this.__origin ?? this._originNotDefined();
  }

  /**
   * Indicates whether the state fragment has already been retrieved from
   * server.
   */
  private _isAlreadyLoaded(r: IRedux, stateName: string, key: string) {
    const registry = r.store.getState().dynamicRegistry;
    return typeof registry[`${stateName}.${key}`] === 'number';
  }

  /** Loads a single state fragment */
  private async _loadSingleStateFragment(
    r: IRedux,
    stateName: IStateKeys,
    key: string
  ): Promise<TNetState | undefined> {
    if (this._isAlreadyLoaded(r, stateName, key)) {
      return undefined;
    }
    const { store: { dispatch, getState } } = r;
    const rootState = getState();
    const pathname = (rootState.pathnames as TStatePathnames)[stateName];
    const url = `${rootState.app.origin}${pathname}`;
    const response = await post_fetch(url, {
      key,
      'mode': this._mode
    }, this._headers);
    const errors = get_val<IJsonapiError[]>(response, 'errors');
    if (errors) {
      ler(`_loadSingleStateFragment(): ${errors[0].title}`);
      remember_jsonapi_errors(errors);
      return;
    }
    const stateFragment = get_val<TNetState>(response, 'state');
    if (!stateFragment) { return undefined; }
    dispatch(net_patch_state(stateFragment));
    // Register state fragment as already loaded.
    dispatch(actions.dynamicRegistryAdd({
      prop: `${stateName}.${key}`,
      value: Date.now
    }));
    return stateFragment;
  }

  /** Loads multiple state fragments */
  private async _loadMultipleStateFragments(
    r: IRedux,
    stateName: IStateKeys,
    keyList: string[]
  ): Promise<TNetState[]> {
    const pathname = this._pathnames[stateName];
    const url = `${this._origin}${pathname}`;
     // [TODO] Upgrade the server so it can handle an array of keys as request.
    const statePromises = keyList.map(async key => {
      if (this._isAlreadyLoaded(r, stateName, key)) {
        return undefined;
      }
      const response = await post_fetch(url, {
        key,
        'mode': this._mode
      }, this._headers);
      const errors = get_val<IJsonapiError[]>(response, 'errors');
      if (errors) {
        ler(`_performArrayDetail(): ${errors[0].title}`);
        remember_jsonapi_errors(errors);
        return undefined;
      }
      const state = get_val<TNetState>(response, 'state');
      if (state) {
        const { store } = r;
        store.dispatch(net_patch_state(state));
        // Register state fragment as already loaded.
        store.dispatch(actions.dynamicRegistryAdd({
          prop: `${stateName}.${key}`,
          value: Date.now
        }));
      }
      return state;
    });
    
    const states = await Promise.all(statePromises);
    const validStates = states.filter((state): state is TNetState => state !== undefined);
    return validStates;
  }

  /** Loads the required states from server */
  private _performLoadingTask = async (r: IRedux) => {
    const loadDetail = this._directive.load;
    if (!loadDetail) { return; }
    Object.entries(loadDetail).forEach(async detail => {
      const [ stateName, stateId ] = detail;
      switch (typeof stateId) {
        case 'string':
          await this._loadSingleStateFragment(r, stateName as IStateKeys, stateId);
          break;
        case 'object':
          await this._loadMultipleStateFragments(r, stateName as IStateKeys, stateId);
          break;
        default:
          ler('_performLoadingTask(): State load id type invalid');
      }
    });
  }

  /** Submits form data using the directive configuration */
  private _submitFormData = (redux: IRedux) => {
    return async (e: unknown) => {
      if (!this._directive.formName || !this._directive.endpoint) {
        ler('_submitFormData(): Missing required formName or endpoint from directive');
        return;
      }
      this._initializePrivateFields(redux);
      const button = (e as React.MouseEvent<HTMLButtonElement>).currentTarget;
      await this._performLoadingTask(redux);
      const policy = new FormValidationPolicy(redux, this._directive.formName);
      const validationErrors = policy.applyValidationSchemes();
      if (validationErrors && validationErrors.length > 0) {
        validationErrors.forEach(vError => {
          const message = vError.message ?? '';
          policy.emit(vError.name, message);
        });
        return;
      }
      const formData = policy.getFilteredData();
      const { dispatch } = redux.store;
      const requestBody = new JsonapiRequest(this._directive.endpoint, formData).build();
      dispatch(post_req_state(this._directive.endpoint, requestBody));
      dispatch(actions.formsDataClear(this._directive.formName));
      (this._directive.rules ?? []).forEach(rule => {
        switch (rule) {
          case 'close_dialog':
            if (this._directive.type === '$form_dialog') {
              dispatch(actions.dialogClose());
            }
            break;
          case 'disable_on_submit':
            button.disabled = true;
            break;
        }
      });
    }
  }

  private _filterResourcesList = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux);

      // [TODO] Implement filtering resources data.

      throw new Error(
        `${this._errorPrefix} _filterResourcesList() NOT implemented.`
      );
    }
  }

  private _makeGetRequest = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux);

      // [TODO] Implement making a GET request.

      throw new Error(`${this._errorPrefix} _makeGetRequest() NOT implemented.`);
    }
  }

  private _makePostRequest = (redux: IRedux) => {
    return async () => {
      this._initializePrivateFields(redux);
      if (this._directive.endpoint) {
        const { store: { dispatch } } = redux;
        dispatch(post_req_state(this._directive.endpoint, {}, this._headers));
      }
    }
  }

  getDirectiveCallback(): TReduxHandler | undefined {
    switch (this._directive.type) {
      case '$form':
      case '$form_dialog':
        return this._submitFormData;
      case '$form_none':
        return this._makePostRequest;
      case '$filter':
        return this._filterResourcesList;
      case '$none':
        return this._makeGetRequest;
      default:
        ler(`getDefaultCallback(): Invalid directive type: ${this._directive.type}`);
        return undefined;
    }
  }

}