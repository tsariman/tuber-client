import { default_handler, type TReduxHandler } from '../state'
import AbstractState from './AbstractState'
import type {
  TStateFormITemCustomColor,
  TObj
} from '@tuber/shared'
import StateFormItemCustom from './StateFormItemCustom'
import type { IStateFormItemCustom, IStateLink } from '../interfaces/localized'

/** Wrapper class for a link state, app bar item */
export default class StateLink<P = unknown>
  extends AbstractState
  implements IStateLink
{
  private _linkState: IStateLink
  private _parent: P
  private _linkHasState: IStateFormItemCustom
  private _linkHas?: StateFormItemCustom<this>
  private _handleOnClick?: TReduxHandler

  constructor (linkState: IStateLink, parent?: P) {
    super()
    this._linkState = linkState
    this._parent = parent || ({
      menuItemsProps: {},
      menuItemsSx: {},
      typography: {}
    }) as P
    this._linkHasState = this._linkState.has || { }
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateLink { return this._linkState }
  get parent(): P { return (this._parent ?? {}) as P }
  get props(): TObj { return this._linkState.props ?? {} }
  get type(): Required<IStateLink>['type'] { return this._linkState.type || 'text' }
  get has(): StateFormItemCustom<this> {
    return this._linkHas
      || (this._linkHas = new StateFormItemCustom(
        this._linkHasState, this
      ))
  }
  private setHandleOnClick = (): TReduxHandler => {
    if (this._linkState.onClick) {
      return this._handleOnClick = this._linkState.onClick
    }
    if (this._linkHas) {
      const handleCallback = this._linkHas.getDirectiveHandle()
        || this._linkHas.getHandler()
      if (handleCallback) {
        return this._handleOnClick = handleCallback
      }
    }
    return this._handleOnClick = default_handler
  }
  get onClick(): TReduxHandler {
    return this._handleOnClick || this.setHandleOnClick()
  }
  get href(): string { return this._linkState.href ?? '' }
  get color(): TStateFormITemCustomColor { return this._linkHasState.color || 'default' }
  /** Set form field `onClick` attribute */
  set onClick(cb: TReduxHandler) {
    this._handleOnClick = cb
  }
}

/**
 * Format routes
 *
 * **dev**
 * This function was created because I did not want to be force to include
 * the starting forwardslash in the route when defining buttons and links.
 * I believe it is much cleaner (in terms of naming convension) to keep the
 * forwardslash out of the definition.
 * Although an entire function is not necessary but you never know, the
 * route formatting process might grow in complexity in the furture.
 *
 * @todo This function could be moved to `links.controller.ts` file once it is
 *       created OR if there is a need to create it.
 *
 * @param route
 */
export function get_formatted_route(has: StateFormItemCustom<unknown>, href?: string): string {
  const route = has.route
  if (route) {
    return route.charAt(0) !== '/' ? `/${route}` : route
  }
  const {pathname, search } = window.location
  return href || pathname + (search ?? '')
}