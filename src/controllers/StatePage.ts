import { get_parsed_content } from '../business.logic/parsing'
import { error_id } from '../business.logic/errors'
import { mongo_object_id } from '../business.logic/utility'
import { ler } from '../business.logic/logging'
import StatePageAppbar from './templates/StatePageAppbar'
import StatePageBackground from './templates/StatePageBackground'
import type StateAllPages from './StateAllPages'
import StatePageDrawer from './templates/StatePageDrawer'
import StatePageTypography from './templates/StatePageTypography'
import AbstractState from './AbstractState'
import type {
  IStatePageContent,
  IStateBackground,
  IStateComponent,
  IStateTypography,
  TStatePageLayout,
  IJsonapiPageLinks
} from '@tuber/shared'
import type {
  IStateAppbar,
  IStateDrawer,
  IStatePage,
  IStatePageDrawer
} from '../interfaces/localized'
import StateComponent from './StateComponent'
import type { IStatePageConfig } from '../interfaces/IControllerConfiguration'

/** Wrapper class for a page state located in the `initialState.pages` object */
export default class StatePage extends AbstractState implements IStatePage {
  private _state: IStatePage
  private _parent: StateAllPages
  static EMPTY_APPBAR: IStateAppbar = { items: [] }
  static EMPTY_DRAWER: IStateDrawer = {
    items: [],
    open: false,
    width: 300
  }
  private _pageId?: string
  private _pageAppbarState?: IStateAppbar
  private _pageAppbar?: StatePageAppbar
  private _noPageAppbar: boolean
  private _pageAppbarCustomState?: IStateComponent
  private _pageAppbarCustom?: StateComponent<this>
  private _pageDrawerState?: IStateDrawer
  private _noPageDrawer: boolean
  private _pageContentState?: IStatePageContent
  private _pageBackgroundState?: IStateBackground
  private _pageBackground?: StatePageBackground
  private _pageTypographyState: IStateTypography
  private _pageTypography?: StatePageTypography
  private _pageDrawer?: StatePageDrawer
  private _defaultAppbarState?: IStateAppbar
  private _defaultDrawerState?: IStateDrawer
  private _defaultBackgroundState?: IStateBackground

  /**
   * Constructor
   *
   * @param state 
   */
  constructor(state: IStatePage, parent: StateAllPages) {
    super()
    this._state = state
    this._parent = parent
    this._pageId = this._state._id
    this._noPageAppbar = !this._state.appbar
    this._noPageDrawer = !this._state.drawer
    this._pageTypographyState = this._state.typography || {}
  }

  /** Get the page json. */
  get state(): IStatePage { return this._state }
  /** Chain-access to all pages definition. */
  get parent(): StateAllPages { return this._parent }
  get props(): Record<string, unknown> { return this.die('Not implemented yet.', {}) }
  configure(conf: IStatePageConfig) {
    this._defaultAppbarState ??= conf.defaultAppbarState
    this._defaultDrawerState ??= conf.defaultDrawerState
    this._defaultBackgroundState ??= conf.defaultBackgroundState
  }
  /**
   * Returns the page appbar json implementation or an empty object.  
   * The purpose is to initialize different instances of appbars using
   * templates.  
   * **Note:** Inheritances and swaps are ignored.
   * 
   */
  get appbarJson(): IStateAppbar { return this.state.appbar || {} }

  /**
   * A unique id is assigned if you would like to use an identifier for the
   * page besides its title.
   */
  get _id(): string { return this._pageId || (this._pageId = mongo_object_id()) }
  get _type(): Required<IStatePage>['_type'] { return this._state._type || 'generic' }
  get _key(): string { return this._state._key ?? '' }
  get title(): string { return this._state.title ?? this._key }
  get forcedTitle(): string { return this._state.forcedTitle ?? '' }

  /** Chain-access to the page appbar definition. */
  get appbar(): StatePageAppbar {
    if (this._pageAppbar) {
      return this._pageAppbar
    }
    this._pageAppbarState = this._initPageAppbar()
    this._pageAppbar = new StatePageAppbar(this._pageAppbarState, this)
    return this._pageAppbar
  }

  get appbarCustom(): StateComponent<this> {
    if (this._pageAppbarCustom) {
      return this._pageAppbarCustom
    }
    this._pageAppbarCustomState = this._initPageAppbarCustom()
    this._pageAppbarCustom = new StateComponent(this._pageAppbarCustomState, this)
    return this._pageAppbarCustom
  }

  /** Chain-access to the page background definition. */
  get background(): StatePageBackground {
    if (this._pageBackground) {
      return this._pageBackground
    }
    this._pageBackgroundState = this._initPageBackground()
    this._pageBackground = new StatePageBackground(
      this._pageBackgroundState,
      this
    )
    return this._pageBackground
  }

  /** Get font family and color of the currently displayed page. */
  get typography(): StatePageTypography {
    return this._pageTypography
      || (this._pageTypography = new StatePageTypography(
        this._pageTypographyState,
        this
      ))
  }
  /** The page content definition. */
  get content(): string { return this._state.content ?? '' }
  /** The type of the page content represented by a special symbol. */
  get contentType(): string {
    return (this._pageContentState || this._getContentObj()).type
  }
  /**
   * Identifier for a a specific content.  
   * e.g. name of a form, a page... etc.
   */
  get contentName(): string {
    return (this._pageContentState || this._getContentObj()).name
  }
  /** Endpoint to which data may be sent or retrieve for the page. */
  get contentEndpoint(): string {
    return (this._pageContentState || this._getContentObj()).endpoint ?? ''
  }
  /**
   * Miscellanous URL arguments to be inserted when making a server request
   * at the endpoint specified in the page definition.
   */
  get contentArgs(): string {
    return (this._pageContentState || this._getContentObj()).args ?? ''
  }
  get view(): string {
    return (this._pageContentState || this._getContentObj()).name + 'View'
  }

  /** Chain-access to the page drawer definition. */
  get drawer(): StatePageDrawer {
    if (this._pageDrawer) {
      return this._pageDrawer
    }
    this._pageDrawerState = this._initPageDrawer()
    this._pageDrawer = new StatePageDrawer(this._pageDrawerState, this)
    return this._pageDrawer
  }
  /** Chain-access to the page's layout definition */
  get layout(): TStatePageLayout { return this._state.layout || 'layout_none' }
  /** Check if an appbar was defined for the current page. */
  get hasAppbar(): boolean {
    return !this._noPageAppbar
      || !!this._state.appbarInherited
      || !!this._state.useDefaultAppbar
  }
  /** Check if a custom appbar was defined for the current page. */
  get hasCustomAppbar(): boolean {
    return !!this._state.appbarCustom
      || !!this._state.appbarCustomInherited
  }
  /** Check if a drawer was defined for the current page. */
  get hasDrawer(): boolean {
    return !this._noPageDrawer
      || !!this._state.drawerInherited
      || !!this._state.useDefaultDrawer
  }
  get hideAppbar(): boolean { return this._state.hideAppbar === true }
  get hideDrawer(): boolean { return this._state.hideDrawer === true }
  get useDefaultAppbar(): boolean { return !!this._state.useDefaultAppbar }
  get useDefaultDrawer(): boolean { return !!this._state.useDefaultDrawer }
  get useDefaultBackground(): boolean { return !!this._state.useDefaultBackground }
  get useDefaultTypography(): boolean { return !!this._state.useDefaultTypography }
  get inherit(): string { return this._state.inherited ?? '' }
  get appbarInherited(): string { return this._state.appbarInherited ?? '' }
  get drawerInherited(): string { return this._state.drawerInherited ?? '' }
  get generateDefaultDrawer(): boolean { return this._state.generateDefaultDrawer === true }
  get contentInherited(): string { return this._state.contentInherited ?? '' }
  get backgroundInherited(): string { return this._state.backgroundInherited ?? '' }
  get data(): Record<string, unknown> { return this._state.data ?? {} }
  get meta(): Record<string, unknown> { return this._state.meta ?? {} }
  get links(): IJsonapiPageLinks { return this._state.links ?? {} }

  /** Define a drawer for the current page. */
  setDrawer = (drawer: IStatePageDrawer): void => {
    this._pageDrawerState = { ...StatePage.EMPTY_DRAWER, ...drawer }
    this._noPageDrawer = !drawer
    this._pageDrawer = new StatePageDrawer(this._pageDrawerState, this)
  }

  private _getContentObj(): IStatePageContent {
    if (this._state.content) {
      return this._pageContentState = get_parsed_content(
        this._state.content
      )
    }
    if (this._state.inherited) {
      const inheritedContent = this.parent
        .getPageState(this._state.inherited)
        ?.content
      return this._pageContentState = get_parsed_content(inheritedContent)
    }
    if (this._state.contentInherited) {
      const inheritedContent = this.parent
        .getPageState(this._state.contentInherited)
        ?.content
      return this._pageContentState = get_parsed_content(inheritedContent)
    }
    return this._pageContentState = get_parsed_content()
  }

  /** Ensures the page has the correct appbar. */
  private _initPageAppbar = (): IStateAppbar => {
    if (this._state.appbar) {
      return { ...StatePage.EMPTY_APPBAR, ...this._state.appbar }
    }
    if (this._state.inherited) {
      const inheritedRoute = this._state.inherited
      const inheritedState = this.parent.getPageState(inheritedRoute)?.appbar
      if (inheritedState) { return inheritedState }
      ler(`StatePage.initPageAppbar: Failed to inherit app bar.`)
    }
    if (this._state.appbarInherited) {
      const appbarInheritedRoute = this._state.appbarInherited
      const appbarInheritedState = this.parent
        .getPageState(appbarInheritedRoute)
        ?.appbar
      if (appbarInheritedState) { return appbarInheritedState }
      ler(`StatePage.initPageAppbar: Failed to inherit app bar.`)
    }
    if (this._state.useDefaultAppbar) {
      return this._defaultAppbarState ?? this.throw_if_not_configured(
        'The default app bar state is missing'
      )
    }
    return StatePage.EMPTY_APPBAR
  }

  /** There's no default custom appbar but you can inherit one. */
  private _initPageAppbarCustom = (): IStateComponent => {
    if (this._state.appbarCustom) {
      return this._state.appbarCustom
    }
    if (this._state.appbarCustomInherited) {
      const route = this._state.appbarCustomInherited
      return this.parent.getPageState(route)?.appbarCustom || {}
    }
    return this._pageAppbarCustomState || {}
  }

  /** Initializes and ensures that the page has the correct drawer. */
  private _initPageDrawer = (): IStateDrawer => {
    if (this._state.drawer) {
      return { ...StatePage.EMPTY_DRAWER, ...this._state.drawer }
    }
    if (this._state.inherited) {
      const route = this._state.inherited
      const inheritedDrawerState = this.parent.getPageState(route)?.drawer
      if (inheritedDrawerState) { return inheritedDrawerState }
      ler(`StatePage.initPageDrawer: Failed to inherit drawer.`)
    }
    if (this._state.drawerInherited) {
      const drawerInheritedRoute = this._state.drawerInherited
      const drawerInheritedState = this.parent
        .getPageState(drawerInheritedRoute)
        ?.drawer
      if (drawerInheritedState) {
        return drawerInheritedState
      }
      ler(`StatePage.initPageDrawer: Failed to inherit drawer.`)
    }
    if (this._state.useDefaultDrawer) {
      return this._defaultDrawerState ?? this.throw_if_not_configured(
        'The default drawer state is missing'
      )
    }
    return StatePage.EMPTY_DRAWER
  }

  /** Initializes and ensures that the page has the correct background. */
  private _initPageBackground = (): IStateBackground => {
    if (this._state.background) { return this._state.background }
    // if background should be inherited from another page
    if (this._state.inherited) {
      const inheritedRoute = this._state.inherited
      const inheritedBackground = this.parent.getPageState(inheritedRoute)
        ?.background
      if (inheritedBackground) { return inheritedBackground }
    }
    if (this._state.backgroundInherited) {
      const route = this._state.backgroundInherited
      try {
        const background = this.parent.getPageState(route)?.background
        if (background) { return background }
      } catch (e) {
        const message = `Error while inheriting background from "${route}" page.`
        ler(message)
        ler((e as Error).stack)
        error_id(14).remember_exception(e, message) // error 14
      }
    }
    // If explicitly set to not use the default background.
    if (this._state.useDefaultBackground === false) { return {} }
    // if no background was defined, pages will automatically use the default.
    return this._defaultBackgroundState ?? this.throw_if_not_configured(
      'The default background state is missing'
    )
  }

}
