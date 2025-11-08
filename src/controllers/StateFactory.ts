import { type RootState, get_state } from '../state';

// Import controller classes
import StateApp from './StateApp';
import StateAppbarDefault from './templates/StateAppbarDefault';
import StateAppbarQueries from './StateAppbarQueries';
import StateBackground from './StateBackground';
import StateTypography from './StateTypography';
import StateAllIcons from './StateAllIcons';
import StateData from './StateData';
import StateDialog from './StateDialog';
import StateAllDialogs from './StateAllDialogs';
import StateDrawer from './StateDrawer';
import StateAllErrors from './StateAllErrors';
import StateAllForms from './StateAllForms';
import StateFormsData from './StateFormsData';
import StateFormsDataErrors from './StateFormsDataErrors';
import StateMeta from './StateMeta';
import StateAllPages from './StateAllPages';
import StatePagesData from './StatePagesData';
import StateSnackbar from './StateSnackbar';
import StateTmp from './StateTmp';
import StateTopLevelLinks from './StateTopLevelLinks';
import StateNet from './StateNet';
import StatePathnames from './StatePathnames';
import State from './State';

/**
 * Factory for creating state controller instances.
 * This eliminates circular dependencies by centralizing controller creation
 * and injecting the parent state instance via constructor.
 */
export default class StateFactory {
  private __rootState?: RootState;
  private __parent?: State;
  private get _rootState() {
    return this.__rootState || (this.__rootState = get_state());
  }
  private get _parent() {
    return this.__parent || (this.__parent = new State(this._rootState));
  }
  get parent() { return this._parent };

  createStateApp(): StateApp {
    return new StateApp(this._rootState.app, this._parent);
  }

  createStateAppbarDefault(): StateAppbarDefault {
    return new StateAppbarDefault(this._rootState.appbar, this._parent);
  }

  createStateAppbarQueries(): StateAppbarQueries {
    return new StateAppbarQueries(
      this._rootState.appbarQueries,
      this._parent
    );
  }

  createStateBackground(): StateBackground {
    return new StateBackground(this._rootState.background, this._parent);
  }

  createStateTypography(): StateTypography {
    return new StateTypography(this._rootState.typography, this._parent);
  }

  createStateAllIcons(): StateAllIcons {
    return new StateAllIcons(this._rootState.icons, this._parent);
  }

  createStateData(): StateData {
    return new StateData(this._rootState.data, this._parent);
  }

  createStateDialog(): StateDialog {
    return new StateDialog(this._rootState.dialog, this._parent);
  }

  createStateAllDialogs(): StateAllDialogs {
    return new StateAllDialogs(this._rootState.dialogs, this._parent);
  }

  createStateDrawer<T>(): StateDrawer<T> {
    return new StateDrawer(this._rootState.drawer, this._parent as T);
  }

  createStateAllErrors(): StateAllErrors {
    return new StateAllErrors(this._rootState.errors, this._parent);
  }

  createStateAllForms(): StateAllForms {
    return new StateAllForms(this._rootState.forms, this._parent);
  }

  createStateFormsData(): StateFormsData {
    return new StateFormsData(this._rootState.formsData, this._parent);
  }

  createStateFormsDataErrors(): StateFormsDataErrors {
    return new StateFormsDataErrors(
      this._rootState.formsDataErrors,
      this._parent
    );
  }

  createStateMeta(): StateMeta {
    return new StateMeta(this._rootState.meta, this._parent);
  }

  createStateAllPages(): StateAllPages {
    return new StateAllPages(this._rootState.pages, this._parent);
  }

  createStatePagesData(): StatePagesData {
    return new StatePagesData(this._rootState.pagesData, this._parent);
  }

  createStateSnackbar(): StateSnackbar {
    return new StateSnackbar(this._rootState.snackbar, this._parent);
  }

  createStateTmp(): StateTmp {
    return new StateTmp(this._rootState.tmp, this._parent);
  }

  createStateTopLevelLinks(): StateTopLevelLinks {
    return new StateTopLevelLinks(this._rootState.topLevelLinks, this._parent);
  }

  createStateNet(): StateNet {
    return new StateNet(this._rootState.net);
  }

  createStatePathnames(): StatePathnames {
    return new StatePathnames(this._rootState.pathnames);
  }
}