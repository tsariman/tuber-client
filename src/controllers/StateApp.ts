import { get_origin_ending_fixed } from '../business.logic/parsing';
import AbstractState from './AbstractState';
import type { IStateApp, TThemeMode } from '@tuber/shared';
import State from './State';
import Config from '../config';
import { get_state } from '../state';

export default class StateApp extends AbstractState implements IStateApp {
  private _appState: IStateApp;
  private _parent?: State;
  private _appOrigin?: string;

  constructor(appState: IStateApp, parent?: State) {
    super();
    this._appState = appState;
    this._parent = parent;
  }

  /** Get a copy of the app definition. */
  get state(): IStateApp { return this._appState; }
  /** Chain-access to root definition. */
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
  get fetchingStateAllowed(): boolean {
    return this._appState.fetchingStateAllowed ?? false;
  }
  get inDebugMode(): boolean { return this._appState.inDebugMode ?? false; }
  get inDevelMode(): boolean { return this._appState.inDevelMode ?? false; }
  get origin(): string {
    return this._appOrigin || (
      this._appOrigin = get_origin_ending_fixed(this._appState.origin)
    );
  }
  /**
   * Chain-access to the current page route.
   */
  get route(): string {
    return this._appState.route ?? this._appState.homepage ?? '';
  }
  get showSpinner(): boolean|undefined { return this._appState.showSpinner; }
  get spinnerDisabled(): boolean|undefined { return this._appState.spinnerDisabled; }
  get status(): string { return this._appState.status ?? ''; }
  get title(): string { return this._appState.title ?? ''; }
  get logoUri(): string { return this._appState.logoUri ?? ''; }
  get logoTag(): 'img' | 'div' { return this._appState.logoTag ?? 'div'; }
  get lastRoute(): string { return this._appState.lastRoute ?? ''; }
  /**
   * [TODO] The default page can and should be dynamically update to the most
   *        relevant page based on the session (e.g. whether the user is logged
   *        in or not).
   */
  get homepage(): string { return this._appState.homepage ?? ''; }
  get isBootstrapped(): boolean {
    return this._appState.isBootstrapped ?? false;
  }
  get fetchMessage(): string {
    return this._appState.fetchMessage ?? '';
  }
  get themeMode(): TThemeMode {
    return this._appState.themeMode ?? Config.DEFAULT_THEME_MODE;
  }
}
