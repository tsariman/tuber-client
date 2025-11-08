
import type StateSnackbar from './StateSnackbar';
import AbstractState from './AbstractState';
import type {
  IStateAnchorOrigin, 
  AnchorHorizontal,
  AnchorVertical
} from '@tuber/shared';

export default class StateAnchorOrigin
  extends AbstractState
  implements IStateAnchorOrigin
{
  private _anchorOriginState: IStateAnchorOrigin;
  private _parent: StateSnackbar;

  constructor(anchorOriginState: IStateAnchorOrigin, parent: StateSnackbar) {
    super();
    this._anchorOriginState = anchorOriginState;
    this._parent = parent;
  }

  get state(): IStateAnchorOrigin { return this._anchorOriginState; }
  get parent(): StateSnackbar { return this._parent; }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }

  get vertical(): AnchorVertical { return this._anchorOriginState.vertical; }
  get horizontal(): AnchorHorizontal {
    return this._anchorOriginState.horizontal;
  }
}
