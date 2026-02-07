import { get_origin_ending_fixed } from '../business.logic/parsing'
import AbstractState from './AbstractState'
import type { IStateApp, TThemeMode } from '@tuber/shared'
import type State from './State'
import Config from '../config'

/** Wrapper class for `initialState.app` */
export default class StateApp extends AbstractState implements IStateApp {
  private _state: IStateApp
  private _parent?: State
  private _appOrigin?: string

  constructor(state: IStateApp, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }
  get state(): IStateApp { return this._state }
  /** Chain-access to root definition. */
  get parent(): State | undefined { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  configure(conf: unknown): void { void conf }
  get fetchingStateAllowed(): boolean {
    return this._state.fetchingStateAllowed ?? false
  }
  get inDebugMode(): boolean { return this._state.inDebugMode ?? false }
  get inDevelMode(): boolean { return this._state.inDevelMode ?? false }
  get origin(): string {
    return this._appOrigin || (
      this._appOrigin = get_origin_ending_fixed(this._state.origin)
    )
  }
  get route(): string {
    return this._state.route ?? this._state.homepage ?? ''
  }
  get showSpinner(): boolean|undefined { return this._state.showSpinner }
  get spinnerDisabled(): boolean|undefined { return this._state.spinnerDisabled }
  get status(): string { return this._state.status ?? '' }
  get title(): string { return this._state.title ?? '' }
  get logoUri(): string { return this._state.logoUri ?? '' }
  get logoTag(): 'img' | 'div' { return this._state.logoTag ?? 'div' }
  get lastRoute(): string { return this._state.lastRoute ?? '' }
  /**
   * [TODO] The default page can and should be dynamically update to the most
   *        relevant page based on the session (e.g. whether the user is logged
   *        in or not).
   */
  get homepage(): string { return this._state.homepage ?? '' }
  get isBootstrapped(): boolean {
    return this._state.isBootstrapped ?? false
  }
  get fetchMessage(): string {
    return this._state.fetchMessage ?? ''
  }
  get themeMode(): TThemeMode {
    return this._state.themeMode ?? Config.DEFAULT_THEME_MODE
  }
  /** Returns the real route name */
  get routeAsKey(): string {
    if (this.route === '/') { return this.homepage }
    return this.route.startsWith('/')
      ? this.route.slice(1)
      : this.route
  }
}
