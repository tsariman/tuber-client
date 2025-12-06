import type { IState } from '../interfaces/localized'
import { get_state, subscribe } from '../state'

// Import controller classes
import StateApp from './StateApp'
import StateAppbarDefault from './templates/StateAppbarDefault'
import StateAppbarQueries from './StateAppbarQueries'
import StateBackground from './StateBackground'
import StateTypography from './StateTypography'
import StateAllIcons from './StateAllIcons'
import StateData from './StateData'
import StateDialog from './StateDialog'
import StateAllDialogs from './StateAllDialogs'
import StateDrawer from './StateDrawer'
import StateAllErrors from './StateAllErrors'
import StateAllForms from './StateAllForms'
import StateFormsData from './StateFormsData'
import StateFormsDataErrors from './StateFormsDataErrors'
import StateMeta from './StateMeta'
import StateAllPages from './StateAllPages'
import StatePagesData from './StatePagesData'
import StateSnackbar from './StateSnackbar'
import StateTmp from './StateTmp'
import StateTopLevelLinks from './StateTopLevelLinks'
import StateNet from './StateNet'
import StatePathnames from './StatePathnames'
import State from './State'

/**
 * Factory for creating state controller instances.
 * This eliminates circular dependencies by centralizing controller creation
 * and injecting the parent state instance via constructor.
 */
export default class StateFactory {
  private static __rootState?: IState
  private static __parent?: State

  static {
    // Subscribe to store changes to renew __rootState if it's stale
    subscribe(() => {
      StateFactory.__rootState = get_state()
      StateFactory.__parent = undefined
    })
  }

  private static get _rootState() {
    return StateFactory.__rootState || (StateFactory.__rootState = get_state())
  }
  
  private static get _parent() {
    return StateFactory.__parent || (StateFactory.__parent = new State(StateFactory._rootState))
  }
  
  static get parent() { return StateFactory._parent }

  static createStateApp(): StateApp {
    return new StateApp(StateFactory._rootState.app, StateFactory._parent)
  }

  static createStateAppbarDefault(): StateAppbarDefault {
    return new StateAppbarDefault(StateFactory._rootState.appbar, StateFactory._parent)
  }

  static createStateAppbarQueries(): StateAppbarQueries {
    return new StateAppbarQueries(
      StateFactory._rootState.appbarQueries
    )
  }

  static createStateBackground(): StateBackground {
    return new StateBackground(StateFactory._rootState.background, StateFactory._parent)
  }

  static createStateTypography(): StateTypography {
    return new StateTypography(StateFactory._rootState.typography, StateFactory._parent)
  }

  static createStateAllIcons(): StateAllIcons {
    return new StateAllIcons(StateFactory._rootState.icons, StateFactory._parent)
  }

  static createStateData(): StateData {
    return new StateData(StateFactory._rootState.data, StateFactory._parent)
  }

  static createStateDialog(): StateDialog {
    return new StateDialog(StateFactory._rootState.dialog, StateFactory._parent)
  }

  static createStateAllDialogs(): StateAllDialogs {
    return new StateAllDialogs(StateFactory._rootState.dialogs, StateFactory._parent)
  }

  static createStateDrawer<T>(): StateDrawer<T> {
    return new StateDrawer(StateFactory._rootState.drawer, StateFactory._parent as T)
  }

  static createStateAllErrors(): StateAllErrors {
    return new StateAllErrors(StateFactory._rootState.errors, StateFactory._parent)
  }

  static createStateAllForms(): StateAllForms {
    return new StateAllForms(StateFactory._rootState.forms, StateFactory._parent)
  }

  static createStateFormsData(): StateFormsData {
    return new StateFormsData(StateFactory._rootState.formsData, StateFactory._parent)
  }

  static createStateFormsDataErrors(): StateFormsDataErrors {
    return new StateFormsDataErrors(
      StateFactory._rootState.formsDataErrors,
      StateFactory._parent
    )
  }

  static createStateMeta(): StateMeta {
    return new StateMeta(StateFactory._rootState.meta, StateFactory._parent)
  }

  static createStateAllPages(): StateAllPages {
    return new StateAllPages(StateFactory._rootState.pages, StateFactory._parent)
  }

  static createStatePagesData(): StatePagesData {
    return new StatePagesData(StateFactory._rootState.pagesData, StateFactory._parent)
  }

  static createStateSnackbar(): StateSnackbar {
    return new StateSnackbar(StateFactory._rootState.snackbar, StateFactory._parent)
  }

  static createStateTmp(): StateTmp {
    return new StateTmp(StateFactory._rootState.tmp, StateFactory._parent)
  }

  static createStateTopLevelLinks(): StateTopLevelLinks {
    return new StateTopLevelLinks(StateFactory._rootState.topLevelLinks, StateFactory._parent)
  }

  static createStateNet(): StateNet {
    return new StateNet(StateFactory._rootState.net)
  }

  static createStatePathnames(): StatePathnames {
    return new StatePathnames(StateFactory._rootState.pathnames)
  }
}