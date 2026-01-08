import React, { type JSX } from 'react'
import type { AlertProps, SnackbarProps } from '@mui/material'
import parse from 'html-react-parser'
import AbstractState from './AbstractState'
import type {
  IStateAnchorOrigin,
  IStateSnackbar
} from '@tuber/shared'
import type State from './State'
import StateAnchorOrigin from './StateAnchorOrigin'

/** Wrapper class for `initialState.snackbar` */
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
  get parent(): State | undefined { return this._parent }
  get props(): SnackbarProps { return this._state.props || {} }
  get alertProps() : AlertProps { return this._state.alertProps || {} }
  get anchorOrigin(): StateAnchorOrigin {
    return this._snackbarAnchorOrigin
      || (this._snackbarAnchorOrigin = new StateAnchorOrigin(
          this.getAnchorOrigin(),
          this
        ))
  }
  get autoHideDuration(): number {
    return this._state.autoHideDuration ?? 6000
  }
  get open(): boolean { return this._state.open ?? false }
  get content(): JSX.Element|undefined { //
    if (typeof this._state.content === 'string') {
      return React.createElement(React.Fragment, null, parse(this._state.content))
    }
    return this._state.content
  }
  get message(): string { return this._state.message ?? '' }
  get actions(): JSX.Element[] { return this._state.actions ?? [] }
  get id(): string { return this._state.id ?? '' }
  get defaultId(): string {
    return this._state.defaultId ?? `message-${Date.now().toString()}`
  }
  get type(): Required<IStateSnackbar>['type'] {
    return this._state.type ?? 'message'
  }
  get variant(): Required<IStateSnackbar>['variant'] {
    return this._state.variant ?? 'info'
  }
  /** Provides a default anchorOrigin if its not defined. */
  private getAnchorOrigin = (): IStateAnchorOrigin => {
    return this._state.anchorOrigin ?? {
      vertical: 'bottom',
      horizontal: 'left'
    }
  }
}
