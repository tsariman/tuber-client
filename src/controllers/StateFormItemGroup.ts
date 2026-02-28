import AbstractState from './AbstractState'
import type { TEventHandler, TItemGroup } from '@tuber/shared'
import type { IStateFormItemGroup } from '../interfaces/localized'
import type StateForm from './StateForm'
import StateFormItem from './StateFormItem'
import StateFormItemCustom from './StateFormItemCustom'

/** Wrapper class */
export default class StateFormItemGroup
  extends AbstractState
  implements IStateFormItemGroup
{
  private _state: IStateFormItemGroup
  protected parentDef: StateForm
  private _items?: StateFormItem[]
  private _has?: StateFormItemCustom<this>
  private onKeyDownHandler?: TEventHandler
  private onClickHandler?: TEventHandler
  private onBlurHandler?: TEventHandler
  private onFocusHandler?: TEventHandler
  private onChangeHandler?: TEventHandler

  constructor (state: IStateFormItemGroup, parent: StateForm) {
    super()
    this._state = state
    this.parentDef = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateFormItemGroup { return this._state }
  get parent(): StateForm { return this.parentDef }
  get props(): Record<string, unknown> {
    return {
      ...this._state.props,
      onKeyDown: this.onKeyDownHandler,
      onClick: this.onClickHandler,
      onBlur: this.onBlurHandler,
      onFocus: this.onFocusHandler,
      onChange: this.onChangeHandler
    }
  }
  get eventPropagationEnabled(): boolean { return this._state.eventPropagationEnabled ?? false }
  get has(): StateFormItemCustom<this> {
    return this._has || (this._has = new StateFormItemCustom(
      this._state.has || {},
      this
    ))
  }
  get type(): TItemGroup {
    return this._state.type || 'none'
  }
  get items(): StateFormItem[] {
    return this._items
      || (this._items = (this._state.items || []).map(
          item => new StateFormItem(item, this.parentDef)
        ))
  }
  getProps<T=Record<string, unknown>>($default?: T) {
    return {
      ...this.props,
      ...$default
    } as T
  }
  set onKeyDown(handler: TEventHandler | undefined) { this.onKeyDownHandler = handler }
  set onClick(handler: TEventHandler | undefined) { this.onClickHandler = handler }
  set onBlur(handler: TEventHandler | undefined) { this.onBlurHandler = handler }
  set onFocus(handler: TEventHandler | undefined) { this.onFocusHandler = handler }
  set onChange(handler: TEventHandler | undefined) { this.onChangeHandler = handler }
}
