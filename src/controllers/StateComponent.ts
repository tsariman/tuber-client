import AbstractState from './AbstractState';
import type { IStateComponent } from '@tuber/shared';
import type { CSSProperties } from 'react';

export default class StateComponent<P = unknown>
  extends AbstractState
  implements IStateComponent
{
  private _componentState: IStateComponent;
  private _parent: P;
  private _componentItems?: StateComponent<P>[];

  constructor (componentState: IStateComponent, parent: P) {
    super();
    this._componentState = componentState;
    this._parent = parent;
  }

  get state(): IStateComponent { return this._componentState; }
  get parent(): P { return this._parent; }
  get type(): string { return this._componentState._type || 'div'; }
  get theme(): CSSProperties { return this._componentState.theme || {}; }
  get props(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this._componentState };
    delete props.type;
    delete props.theme;
    delete props.items;
    return props;
  }
  get items(): StateComponent[] {
    return this._componentItems = this._componentItems
      || (this._componentItems = (this._componentState.items || []).map(
        (item: IStateComponent) => new StateComponent<P>(item, this._parent)
      ));
  }
  getJson = <T = unknown>(): T => this._componentState as T;
}

export function getStateComponents<T>(
  sc: IStateComponent[],
  parent: T
): StateComponent<T>[] {
  return sc.map(component => new StateComponent<T>(component, parent));
}
