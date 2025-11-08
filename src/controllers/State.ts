import type { IState } from '../localized/interfaces';
import StateAllPages from './StateAllPages';
import StateAllIcons from './StateAllIcons';
import AbstractState from './AbstractState';
import StateBackground from './StateBackground';
import StateApp from './StateApp';
import StateDrawer from './StateDrawer';
import StateAllForms from './StateAllForms';
import StateFormsData from './StateFormsData';
import StateMeta from './StateMeta';
import StateTypography from './StateTypography';
import StateData from './StateData';
import StateDialog from './StateDialog';
import StateAllErrors from './StateAllErrors';
import StateAllDialogs from './StateAllDialogs';
import StatePagesData from './StatePagesData';
import StateSnackbar from './StateSnackbar';
import StateTmp from './StateTmp';
import StateNet from './StateNet';
import StateAppbarDefault from './templates/StateAppbarDefault';
import StateAppbarQueries from './StateAppbarQueries';
import StateTopLevelLinks from './StateTopLevelLinks';
import StateFormsDataErrors from './StateFormsDataErrors';
import StatePathnames from './StatePathnames';
import type { ThemeOptions } from '@mui/material';
import StateRegistry from './StateRegistry';

export default class State extends AbstractState {
  private _rootState: IState;
  private _app?: StateApp;
  private _appbar?: StateAppbarDefault;
  private _appbarQueries?: StateAppbarQueries;
  private _background?: StateBackground;
  private _typography?: StateTypography;
  private _allIcons?: StateAllIcons;
  private _data?: StateData;
  // dataPagesRange
  private _dialog?: StateDialog;
  private _allDialogs?: StateAllDialogs;
  private _drawer?: StateDrawer<this>;
  private _allErrors?: StateAllErrors;
  private _allForms?: StateAllForms;
  private _formsData?: StateFormsData;
  private _formsDataErrors?: StateFormsDataErrors;
  private _meta?: StateMeta;
  private _allPages?: StateAllPages;
  private _pagesData?: StatePagesData;
  // chips
  private _snackbar?: StateSnackbar;
  private _tmp?: StateTmp;
  private _topLevelLinks?: StateTopLevelLinks;
  // theme
  private _net?: StateNet;
  private _pathnames?: StatePathnames;
  private _staticRegistry?: StateRegistry;
  private _dynamicRegistry?: StateRegistry;

  // State version tracking for automatic cache invalidation
  private static _globalStateVersion = 0;
  private _stateVersion: number;

  constructor(rootState: IState) {
    super();
    this._rootState = rootState;
    this._stateVersion = State._globalStateVersion;
  }

  /**
   * Create new State instance with fresh cache.
   * Preferred method for creating State instances with updated root state data.
   */
  static fromRootState(rootState: IState): State {
    return new State(rootState);
  }

  /**
   * Increment global state version to invalidate all existing State instances.
   * Call this when you know the root state has changed significantly.
   */
  static incrementVersion(): void {
    State._globalStateVersion++;
  }

  /**
   * Check if this State instance has stale cache compared to global version.
   */
  private isStale(): boolean {
    return this._stateVersion < State._globalStateVersion;
  }

  /**
   * Auto-invalidate cache if state version is outdated.
   */
  private checkAndInvalidateIfStale(): void {
    if (this.isStale()) {
      this.invalidateCache();
      this._stateVersion = State._globalStateVersion;
    }
  }

  /**
   * Get a copy of the (store) state.
   */
  get state(): IState {
    this.checkAndInvalidateIfStale();
    return this.die(
      `Access to the root state is NOT a good idea.`,
      this._rootState
    );
  }

  /**
   * Chain-access to parent definition.
   */
  get parent(): null {
    return this.die('Root state has no parent.', null);
  }

  get props(): null {
    return this.die(
      'Root state props cannot be used for component spreading.',
      null
    );
  }

  /**
   * Chain-access to app definition.
   */
  get app(): StateApp {
    this.checkAndInvalidateIfStale();
    return this._app
      || (this._app = new StateApp(
          this._rootState.app,
          this
        ));
  }

  /**
   * Get the default appbar definition.
   */
  get appbar(): StateAppbarDefault {
    return this._appbar
      || (this._appbar = new StateAppbarDefault(
          this._rootState.appbar,
          this
        ));
  }

  get appbarQueries(): StateAppbarQueries {
    return this._appbarQueries
      || (this._appbarQueries = new StateAppbarQueries(
            this._rootState.appbarQueries,
            this
          ));
  }

  /**
   * Get the default background definition.
   */
  get background(): StateBackground {
    return this._background
      || (this._background = new StateBackground(
          this._rootState.background,
          this
        ));
  }

  get typography(): StateTypography {
    return this._typography
      || (this._typography = new StateTypography(
          this._rootState.typography,
          this
        ));
  }

  /**
   * Chain-access to all icon definitions.
   */
  get allIcons(): StateAllIcons {
    return this._allIcons
      || (this._allIcons = new StateAllIcons(
          this._rootState.icons,
          this
        ));
  }

  get icons(): StateAllIcons { return this.allIcons; }

  get data(): StateData {
    return this._data
      || (this._data = new StateData(
        this._rootState.data,
        this
      ));
  }

  get dialog(): StateDialog {
    return this._dialog
      || (this._dialog = new StateDialog(
          this._rootState.dialog,
          this
        ));
  }

  get allDialogs(): StateAllDialogs {
    return this._allDialogs
      || (this._allDialogs = new StateAllDialogs(
          this._rootState.dialogs,
          this
        ));
  }

  get dialogs(): StateAllDialogs { return this.allDialogs; }

  /**
   * Get the default drawer definition.
   */
  get drawer(): StateDrawer {
    return this._drawer
      || (this._drawer = new StateDrawer(
          this._rootState.drawer,
          this
        ));
  }

  get allErrors(): StateAllErrors {
    return this._allErrors
      || (this._allErrors = new StateAllErrors(
          this._rootState.errors,
          this
        ));
  }

  get errors(): StateAllErrors { return this.allErrors; }

  /**
   * Chain-access to all form definitions.
   */
  get allForms(): StateAllForms {
    return this._allForms
      || (this._allForms = new StateAllForms(
          this._rootState.forms,
          this
        ));
  }

  get forms(): StateAllForms { return this.allForms; }

  /**
   * Chain-access to forms data.
   */
  get formsData(): StateFormsData {
    return this._formsData
      || (this._formsData = new StateFormsData(
          this._rootState.formsData,
          this
        ));
  }

  get formsDataErrors(): StateFormsDataErrors {
    return this._formsDataErrors
      || (this._formsDataErrors = new StateFormsDataErrors(
          this._rootState.formsDataErrors,
          this
        ));
  }

  /**
   * Chain-access to metadata.
   */
  get meta(): StateMeta {
    return this._meta
      || (this._meta = new StateMeta(
          this._rootState.meta,
          this
        ));
  }

  /**
   * Chain-access to all page definitions.
   */
  get allPages(): StateAllPages {
    return this._allPages
      || (this._allPages = new StateAllPages(
          this._rootState.pages,
          this
        ));
  }

  get pages (): StateAllPages { return this.allPages; }

  get pagesData(): StatePagesData {
    return this._pagesData
      || (this._pagesData = new StatePagesData(
          this._rootState.pagesData,
          this
        ));
  }

  get snackbar(): StateSnackbar {
    return this._snackbar
      || (this._snackbar = new StateSnackbar(
          this._rootState.snackbar,
          this
        ));
  }

  get tmp(): StateTmp {
    return this._tmp
      || (this._tmp = new StateTmp(
          this._rootState.tmp,
          this
        ));
  }

  get topLevelLinks(): StateTopLevelLinks {
    return this._topLevelLinks
      || (this._topLevelLinks = new StateTopLevelLinks(
          this._rootState.topLevelLinks,
          this
        ));
  }

  get theme(): ThemeOptions { return this._rootState.theme; }

  get net(): StateNet {
    return this._net
      || (this._net = new StateNet(
        this._rootState.net,
      ));
  }

  get pathnames(): StatePathnames {
    return this._pathnames
      || (this._pathnames = new StatePathnames(
        this._rootState.pathnames
      ));
  }

  get staticRegistry(): StateRegistry {
    return this._staticRegistry
      || (this._staticRegistry = new StateRegistry(
        this._rootState.staticRegistry,
        this
      ))
  }

  get dynamicRegistry() {
    return this._dynamicRegistry
      || (this._dynamicRegistry = new StateRegistry(
        this._rootState.dynamicRegistry,
        this
      ))
  }

  /**
   * Invalidate all cached controllers when state changes.
   * This forces fresh creation on next access with updated state data.
   */
  invalidateCache(): void {
    this._app = undefined;
    this._appbar = undefined;
    this._appbarQueries = undefined;
    this._background = undefined;
    this._typography = undefined;
    this._allIcons = undefined;
    this._data = undefined;
    this._dialog = undefined;
    this._allDialogs = undefined;
    this._drawer = undefined;
    this._allErrors = undefined;
    this._allForms = undefined;
    this._formsData = undefined;
    this._formsDataErrors = undefined;
    this._meta = undefined;
    this._allPages = undefined;
    this._pagesData = undefined;
    this._snackbar = undefined;
    this._tmp = undefined;
    this._topLevelLinks = undefined;
    this._net = undefined;
    this._pathnames = undefined;
    this._staticRegistry = undefined;
    this._dynamicRegistry = undefined;
  }

} // END class ----------------------------------------------------------------
