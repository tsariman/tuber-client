import type { CSSProperties } from 'react';
import AbstractState from './AbstractState';
import type { TItemGroup } from '@tuber/shared';
import type { IStateFormItemGroup } from '../localized/interfaces';
import type StateForm from './StateForm';
import StateFormItem from './StateFormItem';

export default class StateFormItemGroup
  extends AbstractState
  implements IStateFormItemGroup
{
  private _itemGroupState: IStateFormItemGroup;
  protected parentDef: StateForm;
  private _itemGroupItems?: StateFormItem[];

  constructor (itemGroupState: IStateFormItemGroup, parent: StateForm) {
    super();
    this._itemGroupState = itemGroupState;
    this.parentDef = parent;
  }

  get state(): IStateFormItemGroup { return this._itemGroupState; }
  get parent(): StateForm { return this.parentDef; }
  get props(): Record<string, unknown> { return this._itemGroupState.props ?? {}; }
  get theme(): CSSProperties { return this._itemGroupState.theme ?? {}; }

  get type(): TItemGroup {
    return this._itemGroupState.type || 'none';
  }

  get items(): StateFormItem[] {
    return this._itemGroupItems
      || (this._itemGroupItems = (this._itemGroupState.items || []).map(
          item => new StateFormItem(item, this.parentDef
        )));
  }

  getProps<T=Record<string, unknown>>($default?: T) {
    return {
      ...this.props,
      ...$default
    } as T;
  }
}
