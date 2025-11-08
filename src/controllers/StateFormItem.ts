import AbstractState from './AbstractState';
import StateForm from './StateForm';
import {
  HTML,
  SUBMIT,
  STATE_BUTTON,
  BREAK_LINE,
  FORM_LABEL,
  FORM_HELPER_TEXT,
  BOX,
  FORM_CONTROL,
  FORM_CONTROL_LABEL,
  FORM_GROUP,
  INDETERMINATE,
  LOCALIZED,
  STACK,
  DIV,
  type IStateFormItemError,
  type THandleName,
} from '@tuber/shared';
import type { IStateFormItem, IStateFormItemCustom } from '../localized/interfaces';
import StateFormItemCustom from './StateFormItemCustom';
import { dummy_redux_handler, type TReduxHandler } from '../state';
import StateFormItemInputProps from './StateFormItemInputProps';
import { err } from '../business.logic/logging';
import type { CSSProperties } from 'react';

export interface IFormItemHandle {
  dispatch: unknown;
  form: StateForm;
  input: StateFormItem;
  inputError?: IStateFormItemError;
}

export default class StateFormItem<P = StateForm, T = unknown>
  extends AbstractState
  implements IStateFormItem
{
  protected readonly itemState: IStateFormItem<T>;
  protected parentDef: P;
  protected itemHasState: IStateFormItemCustom<T>;
  protected itemHas?: StateFormItemCustom<StateFormItem<P, T>, T>;
  protected itemDisabled: boolean;

  protected reduxClick?: TReduxHandler;
  protected reduxFocus?: TReduxHandler;
  protected reduxChange?: TReduxHandler;
  protected reduxKeydown?: TReduxHandler;
  protected reduxBlur?: TReduxHandler;

  protected onclickHandler?: unknown;
  protected onchangeHandler?: unknown;
  protected onfocusHandler?: unknown;
  protected onkeydownHandler?: unknown;
  protected onblurHandler?: unknown;

  protected recursiveItems?: StateFormItem<P, T>[];
  protected itemInputProps?: StateFormItemInputProps<StateFormItem<P, T>>;

  private _badReduxHandlers: { [key in THandleName]?: boolean; };

  constructor(itemState: Readonly<IStateFormItem<T>>, parent: P) {
    super();
    this.itemState = itemState;
    this.parentDef = parent;
    this.itemDisabled = !!this.itemState.disabled;
    this.itemHasState = itemState.has || {};

    this.onfocusHandler = this.itemState.onFocus;
    this.onclickHandler = this.itemState.onClick;
    this.onchangeHandler = this.itemState.onChange;
    this.onkeydownHandler = this.itemState.onKeyDown;
    this.onblurHandler = this.itemState.onBlur;
    this._badReduxHandlers = {};
  }

  get state(): IStateFormItem<T> { return this.itemState; }
  /** Chain-access to parent object (form). */
  get parent(): P { return this.parentDef; }
  get props(): Record<string, unknown> {return this.itemState.props || {}; }
  get theme(): CSSProperties { return this.itemState.theme || this.itemHasState.theme || {}; }
  get type(): Required<IStateFormItem>['type'] { return this.itemState.type ?? ''; }
  get id(): string { return this.itemState.id ?? ''; }
  /** Get the current form field name. */
  get name(): string { return this.itemState.name ?? ''; }
  /** Get the current form field custom definition. */
  get has(): StateFormItemCustom<StateFormItem<P, T>, T> {
    return this.itemHas
      || (this.itemHas = new StateFormItemCustom(
        this.itemHasState,
        this
      ));
  }
  /** Get the current form field custom definition. */
  get is(): StateFormItemCustom<StateFormItem<P, T>, T> {
    return this.itemHas
      || (this.itemHas = new StateFormItemCustom(
        this.itemHasState,
        this
      ));
  }
  get _type(): string { return this.itemState._type || ''; }
  /** Get the current form field `href` attribute. */
  get href(): string | undefined { return this.itemState.href; }
  get value(): string { return this.itemState.value ?? ''; }
  /** Get human-readable text. */
  get text(): string {
    return this.itemState.label
      || this.itemHasState.label
      || this.itemHasState.title
      || this.itemHasState.text
      || this.itemState.value
      || this.itemState.name
      || '';
  }
  get hasNoOnClickHandler() { return !!this.itemState.onClick; }
  get hasNoOnChangeHandler() { return !!this.itemState.onChange; }
  get focusReduxHandler(): TReduxHandler {
    return this.reduxFocus
      || (
        this.reduxFocus = this.has.getDirectiveHandle('onfocus')
          || this.has.getHandler('onfocus')
          || this._getDummyReduxHandler('onfocus')
      );
  }
  get clickReduxHandler(): TReduxHandler {
    return this.reduxClick
      || (
        this.reduxClick = this.has.getDirectiveHandle('onclick')
          || this.has.getHandler('onclick')
          || this.has.callback
          || this._getDummyReduxHandler('onclick')
      );
  }
  get changeReduxHandler(): TReduxHandler {
    return this.reduxChange
      || (
        this.reduxChange = this.has.getDirectiveHandle('onchange')
          || this.has.getHandler('onchange')
          || this._getDummyReduxHandler('onchange')
      );
  }
  get keydownReduxHandler(): TReduxHandler {
    return this.reduxKeydown
      || (
        this.reduxKeydown = this.has.getDirectiveHandle('onkeydown')
          || this.has.getHandler('onkeydown')
          || this._getDummyReduxHandler('onkeydown')
      );
  }
  get blurReduxHandler(): TReduxHandler {
    return this.reduxBlur
      || (
        this.reduxBlur = this.has.getDirectiveHandle('onblur')
          || this.has.getHandler('onblur')
          || this._getDummyReduxHandler('onblur')
      );
  }
  /** Callback to run on 'onClick' event. */
  get onFocus(): unknown {
    return this.onfocusHandler ?? this.dummy_factory_handler;
  }
  /** Get the form field `onClick` callback. */
  get onClick(): unknown {
    return this.onclickHandler ?? this.dummy_factory_handler;
  }
  /** Callback to run on 'onChange' event. */
  get onChange(): unknown {
    return this.onchangeHandler ?? this.dummy_factory_handler;
  }
  /** Callback to run on 'onKeyDown' event. */
  get onKeyDown(): unknown {
    return this.onkeydownHandler ?? this.dummy_factory_handler;
  }
  /** Callback to run on 'onBlur' event. */
  get onBlur(): unknown {
    return this.onblurHandler ?? this.dummy_factory_handler;
  }
  get disabled(): boolean { return this.itemDisabled; }
  get label(): string | undefined { return this.itemState.label ?? ''; }
  get language(): string | undefined { return this.itemState.highlight; }
  /** Used with a textfield. */
  get inputProps(): StateFormItemInputProps<StateFormItem<P, T>> {
    return this.itemInputProps || ( this.itemInputProps = new StateFormItemInputProps(
      this.itemState.inputProps || {},
      this
    ));
  }
  /** Must return undefined if not defined. */
  get items(): StateFormItem<P, T>[] | undefined {
    if (this.recursiveItems) {
      return this.recursiveItems;
    }
    if (this.itemState.items) {
      this.recursiveItems = (this.itemState.items as IStateFormItem<T>[]).map(
        item => new StateFormItem(item, this.parentDef)
      );
      return this.recursiveItems;
    }
    return undefined;
  }

  /**
   * Some form items require `name` to be defined.
   */
   get nameProvided(): boolean {
    if (this.itemState.name) {
      return true;
    }
    switch (this.type.toLowerCase()) {
      case HTML:
      case SUBMIT:
      case STATE_BUTTON:
      case BREAK_LINE:
      case FORM_LABEL:
      case FORM_HELPER_TEXT:
      case BOX:
      case STACK:
      case LOCALIZED:
      case FORM_GROUP:
      case FORM_CONTROL:
      case FORM_CONTROL_LABEL:
      case INDETERMINATE:
      case DIV:
        return true;
    }
    err('`formItem.name` is NOT defined.');

    return false;
  }
  /** Use to enable the disabling of form item */
  get disableOn(): Required<IStateFormItem>['disableOn'] {
    return this.itemState.disableOn || [];
  }
  /** Use to disable item based on state. `true` means disabled. */
  get disableOnError(): boolean {
    if (this.parent instanceof StateForm) {
      const errorCount = this.parent.errorCount;
      return this.disableOn.includes('error') && errorCount > 0;
    }
    return false;
  }
  get disableOnBlur(): boolean {
    // [TODO] Implement button disabling on blur.
    return this.disableOn.includes('blur');
  }
  get disableOnClick(): boolean {
    // [TODO] Implement button disabling on click.
    return this.disableOn.includes('click');
  }
  get disableOnChange(): boolean {
    // [TODO] Implement button disabling on change.
    return this.disableOn.includes('change');
  }
  /** Disable form item (submit button) if any conditions are met. */
  get disableOnAll(): boolean {
    return this.disableOnError;
    // [TODO] When disabling on a specific event is implemented, uncomment the
    //        corresponding line below.
      // || this.disableOnBlur
      // || this.disableOnClick
      // || this.disableOnChange
  }
  /** Set form field `onFocus` attribute of the form item. */
  set onFocus(handler: unknown) { this.onfocusHandler = handler; }
  /** Set form field `onClick` attribute */
  set onClick(handler: unknown) { this.onclickHandler = handler; }
  /** Set the 'onChange' attribute of the form item. */
  set onChange(handler: unknown) { this.onchangeHandler = handler; }
  /** Set the 'onKeyDown' attribute of the form item. */
  set onKeyDown(handler: unknown) { this.onkeydownHandler = handler; }
  /** Set the 'onBlur' attribute of the form item. */
  set onBlur(handler: unknown) { this.onblurHandler = handler; }
  set disabled(b: boolean) { this.itemDisabled = b; }

  /**
   * Prevents the app from throwing an exception because of the missing `name`
   * attribute in specific form item definitions.
   *
   * The application is set to throw an exception if the name of a form field is
   * missing. However, not all defined form items are fields. If the name is
   * missing from one of those definitions, the application should not throw an
   * exception.
   *
   * @deprecated
   */
  typeCheckingName = (): string => {
    const type = this.type.toLowerCase();
    if (this.itemState.name) {
      return type;
    } else {
      switch (type) {
        case HTML:
        case SUBMIT:
        case STATE_BUTTON:
        case BREAK_LINE:
        case FORM_LABEL:
        case FORM_HELPER_TEXT:
        case BOX:
        case STACK:
        case LOCALIZED:
        case FORM_GROUP:
        case FORM_CONTROL:
        case FORM_CONTROL_LABEL:
        case INDETERMINATE:
          return type;
      }
    }
    err('`formItem.name` is NOT defined.');

    return type;
  }

  /**
   * Helps keep track of which redux handler isn't provided.
   *
   * @param event Event name
   * @returns 
   */
  private _getDummyReduxHandler(event: THandleName): TReduxHandler {
    this._badReduxHandlers[event] = true;
    return dummy_redux_handler;
  }
  private _noReduxHandlerFor(event: THandleName): boolean {
    return !!this._badReduxHandlers[event];
  }
  /** Checks if a valid Redux handler is set for the event. */
  hasReduxHandler(event: THandleName): boolean {
    return !this._noReduxHandlerFor(event);
  }

}
