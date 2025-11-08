import { dummy_redux_handler, type IRedux, type TReduxHandler } from '../state';
import { ler, get_val } from '../business.logic';
import AbstractState from './AbstractState';
import type {
  FormControlLabelProps,
  FormControlProps,
  FormGroupProps,
  FormHelperTextProps,
  FormLabelProps,
  IconProps,
  SvgIconProps
} from '@mui/material';
import type {
  IHandleDirective,
  THandleName,
  TStateFormITemCustomColor,
  TObj
} from '@tuber/shared';
import type { IStateFormItemCustom } from '../localized/interfaces';
import type { CSSProperties } from 'react';
import React from 'react';
import ReduxHandlerFactory from '../event/ReduxHandlerFactory';

export default class StateFormItemCustom<P, T = unknown>
  extends AbstractState
  implements IStateFormItemCustom<T>
{
  protected hasState: IStateFormItemCustom<T>;
  protected parentDef: P;
  protected hasItemsState: T[];
  protected hasCallback?: TReduxHandler;
  protected hasClasses: unknown;
  private _fieldOk = true;

  constructor (hasState: IStateFormItemCustom<T>, parent: P) {
    super();
    this.hasState = hasState;
    this.parentDef = parent;
    this.hasItemsState = this.hasState.items || [];
    this.hasCallback = this.hasState.callback;
    this.hasClasses = this.hasState.classes || {};
  }

  get state(): IStateFormItemCustom<T> { return this.hasState; }
  get parent(): P { return this.parentDef; }
  get id(): string { return this.hasState.id ?? ''; }
  get callback(): TReduxHandler { return this.hasCallback || dummy_redux_handler; }
  get classes(): unknown { return this.hasClasses; }
  get content(): string { return this.hasState.content ?? ''; }
  get color(): TStateFormITemCustomColor { return this.hasState.color ?? 'default'; }
  get defaultValue(): string { return this.hasState.defaultValue ?? ''; }
  get faIcon(): string { return this.hasState.faIcon ?? ''; }
  get icon(): string { return this.hasState.icon ?? ''; }
  get muiIcon(): string { return this.hasState.muiIcon ?? ''; }
  get svgIcon(): Required<IStateFormItemCustom<T>>['svgIcon'] {
    return this.hasState.svgIcon ?? 'none';
  }
  get iconPosition(): IStateFormItemCustom<T>['iconPosition'] {
    return this.hasState.iconPosition;
  }
  get iconProps(): IconProps { return this.hasState.iconProps ?? {}; }
  get svgIconProps(): SvgIconProps { return this.hasState.svgIconProps ?? {}; }
  get items(): T[] { return this.hasItemsState; }
  get label(): string { return this.hasState.label ?? ''; }

  /**
   * 
   * When defining a regular expression in JSON document, you can either
   * use one of the following identifier to get a default regular expression
   * or pass in your own
   * 
   * Types of default regular expressions:
   *
   * #1 username -- returns a regular expression that matches a username
   * #2 email    -- returns a regular expression that matches an email
   * #3 phone    -- returns a regular expression that matches a phone number
   */
  get regexStr(): string {
    const regex = this.hasState.predefinedRegex ?? '';
    switch (regex.toLowerCase()) {
    case 'username':
      // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
      return '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$';
    case 'email':
      // https://emailregex.com/
      return "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
    case 'phone':
      // https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
      return '^(+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$';
    default:
      return regex;
    }
  }

  get route(): string { return this.hasState.route ?? ''; }
  get text(): string { return this.hasState.text ?? ''; }
  get helperText(): string { return this.hasState.helperText ?? ''; }
  get title(): string { return this.hasState.title ?? ''; }
  /**
   * Material UI component attribute.  
   * __Note__: Can be undefined on purpose.
   */
  get variant(): IStateFormItemCustom<T>['variant'] { return this.hasState.variant; }
  get badge(): IStateFormItemCustom<T>['badge'] { return this.hasState.badge; }
  /**
   * to be used with `load` when loading `meta`. e.g.
   * ```ts
   * const meta = stateMeta['load']['key']
   * ```
   */
  get key(): string { return this.hasState.key ?? ''; }
  /** Name of an internally defined callback to be executed. */
  get onclickHandle(): string { return this.hasState.onclickHandle ?? ''; }
  get onfocusHandle(): string { return this.hasState.onfocusHandle ?? ''; }
  get onchangeHandle(): string { return this.hasState.onchangeHandle ?? ''; }
  get onkeydownHandle(): string { return this.hasState.onkeydownHandle ?? ''; }
  get onblurHandle(): string { return this.hasState.onblurHandle ?? ''; }
  get ondeleteHandle(): string { return this.hasState.ondeleteHandle ?? ''; }
  get onclickHandleDirective(): IHandleDirective | undefined {
    return this.hasState.onclickHandleDirective;
  }
  get onfocusHandleDirective(): IHandleDirective | undefined {
    return this.hasState.onfocusHandleDirective;
  }
  get onchangeHandleDirective(): IHandleDirective | undefined {
    return this.hasState.onchangeHandleDirective;
  }
  get onkeydownHandleDirective(): IHandleDirective | undefined {
    return this.hasState.onkeydownHandleDirective;
  }
  get onblurHandleDirective(): IHandleDirective | undefined {
    return this.hasState.onblurHandleDirective;
  }
  get ondeleteHandleDirective(): IHandleDirective | undefined {
    return this.hasState.ondeleteHandleDirective;
  }
  get load(): string { return this.hasState.load ?? ''; }
  get startAdornment(): IStateFormItemCustom<T>['startAdornment'] {
    return this.hasState.startAdornment;
  }
  get endAdornment(): IStateFormItemCustom<T>['endAdornment'] {
    return this.hasState.endAdornment;
  }
  get props(): TObj { return this.hasState.props || {}; }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}); }
  get formControlProps(): FormControlProps {
    return this.hasState.formControlProps ?? {};
  }
  get formControlLabelProps(): FormControlLabelProps | undefined {
    return this.hasState.formControlLabelProps ?? {
      label: '',
      control: React.createElement('span'),
    };
  }
  get formLabelProps(): FormLabelProps {
    return this.hasState.formLabelProps ?? {};
  }
  get formGroupProps(): FormGroupProps {
    return this.hasState.formGroupProps ?? {};
  }
  get formHelperTextProps(): FormHelperTextProps {
    return this.hasState.formHelperTextProps ?? {};
  }
  /**
   * Check if field value is valid.  
   * `maxLength` or `invalidChars` must be set first. Run the `evaluateVal()`
   * function. Then retrieve the result from this field.
   */
  get validInput(): boolean { return this._fieldOk; }
  get required(): boolean { return this.hasState.required === true; }
  get requiredMessage(): string { return this.hasState.requiredMessage ?? ''; }
  get maxLength(): number | undefined { return this.hasState.maxLength; }
  get maxLengthMessage(): string { return this.hasState.maxLengthMessage ?? ''; }
  get invalidationRegex(): string | undefined { return this.hasState.invalidationRegex; }
  get invalidationMessage(): string { return this.hasState.invalidationMessage ?? ''; }
  get validationRegex(): string | undefined { return this.hasState.validationRegex; }
  get validationMessage(): string { return this.hasState.validationMessage ?? ''; }
  get disableOnError(): boolean { return !!this.hasState.disableOnError; }

  set callback(cb: ((redux:IRedux)=>(e:unknown)=>void)|undefined) { this.hasCallback = cb; }

  /**
   * Set custom classes for your field.
   *
   * @param classes can be an array of strings, a string, or any other means to
   *                store class names
   */
  set classes(classes: unknown) { this.hasClasses = classes; }

  /**
   * If `has.regex` is set, you can use this function to do regular
   * expression test.
   *
   * @param value to be tested
   *
   * @returns `true` if the regular expression test on the _passed-in_ value
   *          fails.
   */
  regexError(value: string): boolean {
    if (!this.hasState.predefinedRegex || !value) {
      return false;
    } 
    return !(new RegExp(this.regexStr).test(value));
  }

  /**
   * Set a callback.  
   * If the callback is defined globally, e.g., on the `window` object, it can
   * be acquired using a dot-seperated path string representing its property
   * location.
   * ```ts
   * // For example, if "myCallbackLocation" is the location, then:
   * const myCallback = window.myCallbackLocation;
   * // Or, "handleSet.myOtherCallback", then:
   * const myOtherCallback = window.handleSet.myOtherCallback;
   * ```
   * @param {THandleName} event e.g., 'onclick', 'onfocus'... etc.
   */
  getHandler = (
    event: THandleName = 'onclick'
  ): TReduxHandler | undefined => {
    const callbackName = this.hasState[`${event}Handle`];
    if (!callbackName) {
      return;
    }
    const callback = get_val(window, callbackName);
    if (typeof callback !== 'function') {
      ler(`getHandle(): '${callbackName}' not a function`);
      return;
    }
    return callback as TReduxHandler;
  } // END of method

  /** Generate callback */
  getDirectiveHandle = (
    event: THandleName = 'onclick'
  ): TReduxHandler | undefined => {
    let handleDirective: IHandleDirective | undefined;
    switch (event) {
      case 'onclick':
        handleDirective = this.hasState.onclickHandleDirective;
        break;
      case 'onfocus':
        handleDirective = this.hasState.onfocusHandleDirective;
        break;
      case 'onchange':
        handleDirective = this.hasState.onchangeHandleDirective;
        break;
      case 'onkeydown':
        handleDirective = this.hasState.onkeydownHandleDirective;
        break;
      case 'onblur':
        handleDirective = this.hasState.onblurHandleDirective;
        break;
      case 'ondelete':
        handleDirective = this.hasState.ondeleteHandleDirective;
        break;
    }
    if (!handleDirective) { return undefined; };
    const handleFactory = new ReduxHandlerFactory(handleDirective);
    const callback = handleFactory.getDirectiveCallback();
    return callback;
  }

  /**
   * Evaluates the value of the input field. `maxLength` or `invalidChars` must
   * be set first.
   * @deprecated
   */
  evaluation(value: string) {
    const maxLength = this.hasState.maxLength ?? 0;
    if (maxLength > 0 && value.length > maxLength) {
      this._fieldOk = false;
    }
    if (this._fieldOk && this.hasState.invalidationRegex) {
      this._fieldOk = new RegExp(this.hasState.invalidationRegex).test(value);
    }
  }
}
