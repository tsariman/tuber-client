import type { IRedux, TReduxHandler } from '../state'
import { ler } from '../business.logic'
import AbstractState from './AbstractState'
import type {
  FormControlLabelProps,
  FormControlProps,
  FormGroupProps,
  FormHelperTextProps,
  FormLabelProps,
  IconProps,
  SvgIconProps
} from '@mui/material'
import type {
  IHandlerDirective,
  TEventName,
  TStateFormItemCustomColor,
  TObj
} from '@tuber/shared'
import type { IStateFormItemCustom } from '../interfaces/localized'
import React from 'react'
import ReduxHandlerFactory from '../business.logic/ReduxHandlerFactory'
import { get_handler_registry } from '../business.logic/HandlerRegistry'

/** Wrapper class */
export default class StateFormItemCustom<P = unknown, T = unknown>
  extends AbstractState
  implements IStateFormItemCustom<T>
{
  protected hasState: IStateFormItemCustom<T>
  protected parentDef: P
  protected hasItemsState: T[]
  protected hasCallback?: TReduxHandler
  protected hasClasses: unknown
  private _fieldOk = true

  constructor (hasState: IStateFormItemCustom<T>, parent: P) {
    super()
    this.hasState = hasState
    this.parentDef = parent
    this.hasItemsState = this.hasState.items || []
    this.hasCallback = this.hasState.callback
    this.hasClasses = this.hasState.classes || {}
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateFormItemCustom<T> { return this.hasState }
  get parent(): P { return this.parentDef }
  get id(): string { return this.hasState.id ?? '' }
  get callback(): TReduxHandler | undefined { return this.hasCallback }
  get classes(): unknown { return this.hasClasses }
  get content(): string { return this.hasState.content ?? '' }
  get color(): TStateFormItemCustomColor { return this.hasState.color ?? 'default' }
  get defaultValue(): string { return this.hasState.defaultValue ?? '' }
  get faIcon(): string { return this.hasState.faIcon ?? '' }
  get icon(): string { return this.hasState.icon ?? '' }
  get muiIcon(): string { return this.hasState.muiIcon ?? '' }
  get svgIcon(): Required<IStateFormItemCustom<T>>['svgIcon'] {
    return this.hasState.svgIcon ?? 'none'
  }
  get iconPosition(): IStateFormItemCustom<T>['iconPosition'] {
    return this.hasState.iconPosition
  }
  get iconProps(): IconProps { return this.hasState.iconProps ?? {} }
  get svgIconProps(): SvgIconProps { return this.hasState.svgIconProps ?? {} }
  get items(): T[] { return this.hasItemsState }
  get label(): string { return this.hasState.label ?? '' }

  /**
   * 
   * When defining a regular expression in document, you can either
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
    const regex = this.hasState.predefinedRegex ?? ''
    switch (regex.toLowerCase()) {
    case 'username':
      // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
      return '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'
    case 'email':
      // https://emailregex.com/
      return "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$"
    case 'phone':
      // https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
      return '^(+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$'
    default:
      return regex
    }
  }

  get route(): string { return this.hasState.route ?? '' }
  get text(): string {
    return this.hasState.text
      ?? this.hasState.label
      ?? this.hasState.title
      ?? ''
  }
  get helperText(): string { return this.hasState.helperText ?? '' }
  get title(): string { return this.hasState.title ?? '' }
  /**
   * Material UI component attribute.  
   * __Note__: Can be undefined on purpose.
   */
  get variant(): IStateFormItemCustom<T>['variant'] { return this.hasState.variant }
  get badge(): IStateFormItemCustom<T>['badge'] { return this.hasState.badge }
  /**
   * to be used with `load` when loading `meta`. e.g.
   * ```ts
   * const meta = stateMeta['load']['key']
   * ```
   */
  get key(): string { return this.hasState.key ?? '' }
  /** Name of an internally defined callback to be executed. */
  get onclickHandler(): string { return this.hasState.onclickHandler ?? '' }
  get onfocusHandler(): string { return this.hasState.onfocusHandler ?? '' }
  get onchangeHandler(): string { return this.hasState.onchangeHandler ?? '' }
  get onkeydownHandler(): string { return this.hasState.onkeydownHandler ?? '' }
  get onblurHandler(): string { return this.hasState.onblurHandler ?? '' }
  get ondeleteHandler(): string { return this.hasState.ondeleteHandler ?? '' }
  get onclickHandlerDirective(): IHandlerDirective | undefined {
    return this.hasState.onclickHandlerDirective
  }
  get onfocusHandlerDirective(): IHandlerDirective | undefined {
    return this.hasState.onfocusHandlerDirective
  }
  get onchangeHandlerDirective(): IHandlerDirective | undefined {
    return this.hasState.onchangeHandlerDirective
  }
  get onkeydownHandlerDirective(): IHandlerDirective | undefined {
    return this.hasState.onkeydownHandlerDirective
  }
  get onblurHandlerDirective(): IHandlerDirective | undefined {
    return this.hasState.onblurHandlerDirective
  }
  get ondeleteHandlerDirective(): IHandlerDirective | undefined {
    return this.hasState.ondeleteHandlerDirective
  }
  get load(): string { return this.hasState.load ?? '' }
  get startAdornment(): IStateFormItemCustom<T>['startAdornment'] {
    return this.hasState.startAdornment
  }
  get endAdornment(): IStateFormItemCustom<T>['endAdornment'] {
    return this.hasState.endAdornment
  }
  get props(): TObj { return this.hasState.props || {} }
  get formControlProps(): FormControlProps {
    return this.hasState.formControlProps ?? {}
  }
  get formControlLabelProps(): FormControlLabelProps | undefined {
    return this.hasState.formControlLabelProps ?? {
      label: '',
      control: React.createElement('span'),
    }
  }
  get formLabelProps(): FormLabelProps {
    return this.hasState.formLabelProps ?? {}
  }
  get formGroupProps(): FormGroupProps {
    return this.hasState.formGroupProps ?? {}
  }
  get formHelperTextProps(): FormHelperTextProps {
    return this.hasState.formHelperTextProps ?? {}
  }
  /**
   * Check if field value is valid.  
   * `maxLength` or `invalidChars` must be set first. Run the `evaluateVal()`
   * function. Then retrieve the result from this field.
   */
  get validInput(): boolean { return this._fieldOk }
  get required(): boolean { return this.hasState.required === true }
  get requiredMessage(): string { return this.hasState.requiredMessage ?? '' }
  get maxLength(): number | undefined { return this.hasState.maxLength }
  get maxLengthMessage(): string { return this.hasState.maxLengthMessage ?? '' }
  get invalidationRegex(): string | undefined { return this.hasState.invalidationRegex }
  get invalidationMessage(): string { return this.hasState.invalidationMessage ?? '' }
  get validationRegex(): string | undefined { return this.hasState.validationRegex }
  get validationMessage(): string { return this.hasState.validationMessage ?? '' }
  get disableOnError(): boolean { return !!this.hasState.disableOnError }

  set callback(cb: ((redux:IRedux)=>(e:unknown)=>void)|undefined) { this.hasCallback = cb }

  /**
   * Set custom classes for your field.
   *
   * @param classes can be an array of strings, a string, or any other means to
   *                store class names
   */
  set classes(classes: unknown) { this.hasClasses = classes }

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
      return false
    } 
    return !(new RegExp(this.regexStr).test(value))
  }

  /**
   * Set a callback.  
   * If the callback is defined globally, e.g., on the `window` object, it can
   * be acquired using a dot-seperated path string representing its property
   * location.
   * ```ts
   * // For example, if "myCallbackLocation" is the location, then:
   * const myCallback = window.myCallbackLocation
   * // Or, "handleSet.myOtherCallback", then:
   * const myOtherCallback = window.handleSet.myOtherCallback
   * ```
   * @param {TEventName} event e.g., 'onclick', 'onfocus'... etc.
   */
  getHandler = (
    event: TEventName = 'onclick'
  ): TReduxHandler | undefined => {
    const path = this.hasState[`${event}Handler`]
    if (!path || path.trim() === '') { return }
    const handlerRegistry = get_handler_registry()
    const handler = handlerRegistry.getHandlerByPath(path)
    if (typeof handler === 'function') {
      return handler
    }
    ler(`getHandler(): '${path}' not a function`)
  } // END of method

  /** Generate callback */
  getDirectiveHandler = (
    event: TEventName = 'onclick'
  ): TReduxHandler | null => {
    let handlerDirective: IHandlerDirective | undefined
    switch (event) {
      case 'onclick':
        handlerDirective = this.hasState.onclickHandlerDirective
        break
      case 'onfocus':
        handlerDirective = this.hasState.onfocusHandlerDirective
        break
      case 'onchange':
        handlerDirective = this.hasState.onchangeHandlerDirective
        break
      case 'onkeydown':
        handlerDirective = this.hasState.onkeydownHandlerDirective
        break
      case 'onblur':
        handlerDirective = this.hasState.onblurHandlerDirective
        break
      case 'ondelete':
        handlerDirective = this.hasState.ondeleteHandlerDirective
        break
    }
    if (!handlerDirective) { return null }
    const factory = new ReduxHandlerFactory(handlerDirective)
    const callback = factory.getDirectiveCallback()
    return callback
  }

  /**
   * Evaluates the value of the input field. `maxLength` or `invalidChars` must
   * be set first.
   * @deprecated
   */
  evaluation(value: string) {
    const maxLength = this.hasState.maxLength ?? 0
    if (maxLength > 0 && value.length > maxLength) {
      this._fieldOk = false
    }
    if (this._fieldOk && this.hasState.invalidationRegex) {
      this._fieldOk = new RegExp(this.hasState.invalidationRegex).test(value)
    }
  }
}
