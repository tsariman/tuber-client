
import type StateSnackbar from './StateSnackbar'
import AbstractState from './AbstractState'
import type {
  IStateAnchorOrigin, 
  AnchorHorizontal,
  AnchorVertical
} from '@tuber/shared'

/** Wrapper class */
export default class StateAnchorOrigin
  extends AbstractState
  implements IStateAnchorOrigin
{
  private _state: IStateAnchorOrigin
  private _parent: StateSnackbar

  constructor(state: IStateAnchorOrigin, parent: StateSnackbar) {
    super()
    this._state = state
    this._parent = parent
  }

  get state(): IStateAnchorOrigin { return this._state }
  get parent(): StateSnackbar { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  configure(conf: unknown): void { void conf }

  get vertical(): AnchorVertical { return this._state.vertical }
  get horizontal(): AnchorHorizontal {
    return this._state.horizontal
  }
}
