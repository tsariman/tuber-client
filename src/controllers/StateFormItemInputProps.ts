import type {
  IStateFormItemAdornment,
  IStateFormItemInputProps
} from '../localized/interfaces';
import AbstractState from './AbstractState';

import type StateFormItem from './StateFormItem';

export default class StateFormItemInputProps<P=StateFormItem>
  extends AbstractState
  implements IStateFormItemInputProps
{
  private _inputPropsState: IStateFormItemInputProps;
  private _parent: P;

  constructor (inputPropsState: IStateFormItemInputProps, parent: P) {
    super();
    this._inputPropsState = inputPropsState;
    this._parent = parent;
  }

  get state(): IStateFormItemInputProps { return this._inputPropsState; }
  get start(): IStateFormItemAdornment | undefined { return this._inputPropsState.start; }
  get end(): IStateFormItemAdornment | undefined { return this._inputPropsState.end; }
  get parent(): P { return this._parent; }
  get props(): Record<string, unknown> {
    const { start, end, ...props } = this._inputPropsState;
    void start;
    void end;
    return props;
  }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}