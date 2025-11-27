import AbstractState from './AbstractState'
import type {
  IStateAnchorOrigin,
  IStateSnackbar
} from '@tuber/shared'
import State from './State'
import { get_state } from '../state'
import StateAnchorOrigin from './StateAnchorOrigin'
import type { JSX } from 'react'

/** Wrapper class for `initial.state.snackbar` */
export default class StateSnackbar
  extends AbstractState
  implements IStateSnackbar
{
  private _state: IStateSnackbar
  private _parent?: State
  private _snackbarAnchorOrigin?: StateAnchorOrigin

  constructor(state: IStateSnackbar, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateSnackbar { return this._state }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()))
  }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  get anchorOrigin(): StateAnchorOrigin {
    return this._snackbarAnchorOrigin
      || (this._snackbarAnchorOrigin = new StateAnchorOrigin(
          this.getAnchorOrigin(),
          this
        ))
  }
  get autoHideDuration(): number {
    return this._state.autoHideDuration || 6000
  }
  get open(): boolean { return this._state.open || false }
  get content(): JSX.Element|undefined { return this._state.content }
  get message(): string { return this._state.message ?? '' }
  get actions(): JSX.Element[] { return this._state.actions || [] }
  get id(): string { return this._state.id ?? '' }
  get defaultId(): string {
    return this._state.defaultId || `message-${Date.now().toString()}`
  }
  get type(): Required<IStateSnackbar>['type'] {
    return this._state.type || 'message'
  }
  get variant(): Required<IStateSnackbar>['variant'] {
    return this._state.variant || 'info'
  }

  /** Provides a default anchorOrigin if its not defined. */
  private getAnchorOrigin = (): IStateAnchorOrigin => {
    return this._state.anchorOrigin || {
      vertical: 'bottom',
      horizontal: 'left'
    }
  }
}
