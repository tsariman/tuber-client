import AbstractState from './AbstractState';
import type {
  IStateAnchorOrigin,
  IStateSnackbar
} from '@tuber/shared';
import State from './State';
import { get_state } from '../state';
import StateAnchorOrigin from './StateAnchorOrigin';
import type { JSX } from 'react';

export default class StateSnackbar
  extends AbstractState
  implements IStateSnackbar
{
  private _snackbarState: IStateSnackbar;
  private _parent?: State;
  private _snackbarAnchorOrigin?: StateAnchorOrigin;

  constructor(snackbarState: IStateSnackbar, parent?: State) {
    super();
    this._snackbarState = snackbarState;
    this._parent = parent;
  }

  get state(): IStateSnackbar { return this._snackbarState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
  get anchorOrigin(): StateAnchorOrigin {
    return this._snackbarAnchorOrigin
      || (this._snackbarAnchorOrigin = new StateAnchorOrigin(
          this.getAnchorOrigin(),
          this
        ));
  }
  get autoHideDuration(): number {
    return this._snackbarState.autoHideDuration || 6000;
  }
  get open(): boolean { return this._snackbarState.open || false; }
  get content(): JSX.Element|undefined { return this._snackbarState.content; }
  get message(): string { return this._snackbarState.message ?? ''; }
  get actions(): JSX.Element[] { return this._snackbarState.actions || []; }
  get id(): string { return this._snackbarState.id ?? ''; }
  get defaultId(): string {
    return this._snackbarState.defaultId || `message-${Date.now().toString()}`;
  }
  get type(): Required<IStateSnackbar>['type'] {
    return this._snackbarState.type || 'message';
  }
  get variant(): Required<IStateSnackbar>['variant'] {
    return this._snackbarState.variant || 'info';
  }

  /** Provides a default anchorOrigin if its not defined. */
  private getAnchorOrigin = (): IStateAnchorOrigin => {
    return this._snackbarState.anchorOrigin || {
      vertical: 'bottom',
      horizontal: 'left'
    };
  }
}
