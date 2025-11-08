import { get_parsed_content } from '../business.logic/parsing';
import { error_id } from '../business.logic/errors';
import { mongo_object_id } from '../business.logic/utility';
import { ler } from '../business.logic/logging';
import StatePageAppbar from './templates/StatePageAppbar';
import StatePageBackground from './templates/StatePageBackground';
import type StateAllPages from './StateAllPages';
import StatePageDrawer from './templates/StatePageDrawer';
import StatePageTypography from './templates/StatePageTypography';
import AbstractState from './AbstractState';
import type {
  IStatePageContent,
  IStateBackground,
  IStateComponent,
  IStateTypography,
  TStatePageLayout,
  IJsonapiPageLinks
} from '@tuber/shared';
import type {
  IStateAppbar,
  IStateDrawer,
  IStatePage,
  IStatePageDrawer
} from '../localized/interfaces';
import StateComponent from './StateComponent';
import type { CSSProperties } from 'react';

export default class StatePage extends AbstractState implements IStatePage {
  private _pageState: IStatePage;
  private _parent: StateAllPages;
  static EMPTY_APPBAR: IStateAppbar = { items: [] };
  static EMPTY_DRAWER: IStateDrawer = {
    items: [],
    open: false,
    width: 300
  };
  private _pageId?: string;
  private _pageAppbarState?: IStateAppbar;
  private _pageAppbar?: StatePageAppbar;
  private _noPageAppbar: boolean;
  private _pageAppbarCustomState?: IStateComponent;
  private _pageAppbarCustom?: StateComponent<this>;
  private _pageDrawerState?: IStateDrawer;
  private _noPageDrawer: boolean;
  private _pageContentState?: IStatePageContent;
  private _pageBackgroundState?: IStateBackground;
  private _pageBackground?: StatePageBackground;
  private _pageTypographyState: IStateTypography;
  private _pageTypography?: StatePageTypography;
  private _pageDrawer?: StatePageDrawer;

  /**
   * Constructor
   *
   * @param pageState 
   */
  constructor(pageState: IStatePage, parent: StateAllPages) {
    super();
    this._pageState = pageState;
    this._parent = parent;
    this._pageId = this._pageState._id;
    this._noPageAppbar = !this._pageState.appbar;
    this._noPageDrawer = !this._pageState.drawer;
    this._pageTypographyState = this._pageState.typography || {};
  }

  /** Get the page json. */
  get state(): IStatePage { return this._pageState; }
  /** Chain-access to all pages definition. */
  get parent(): StateAllPages { return this._parent; }
  get props(): Record<string, unknown> { return this.die('Not implemented yet.', {}); }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}); }
  /**
   * Returns the page appbar json implementation or an empty object.  
   * The purpose is to initialize different instances of appbars using
   * templates.  
   * **Note:** Inheritances and swaps are ignored.
   * 
   */
  get appbarJson(): IStateAppbar { return this.state.appbar || {}; }

  /**
   * A unique id is assigned if you would like to use an identifier for the
   * page besides its title.
   */
  get _id(): string { return this._pageId || (this._pageId = mongo_object_id()); }
  get _type(): Required<IStatePage>['_type'] { return this._pageState._type || 'generic'; }
  get _key(): string { return this._pageState._key ?? ''; }
  get title(): string { return this._pageState.title ?? this._key; }
  get forcedTitle(): string { return this._pageState.forcedTitle ?? ''; }

  /** Chain-access to the page appbar definition. */
  get appbar(): StatePageAppbar {
    if (this._pageAppbar) {
      return this._pageAppbar;
    }
    this._pageAppbarState = this._initPageAppbar();
    this._pageAppbar = new StatePageAppbar(this._pageAppbarState, this);
    return this._pageAppbar;
  }

  get appbarCustom(): StateComponent<this> {
    if (this._pageAppbarCustom) {
      return this._pageAppbarCustom;
    }
    this._pageAppbarCustomState = this._initPageAppbarCustom();
    this._pageAppbarCustom = new StateComponent(this._pageAppbarCustomState, this);
    return this._pageAppbarCustom;
  }

  /** Chain-access to the page background definition. */
  get background(): StatePageBackground {
    if (this._pageBackground) {
      return this._pageBackground;
    }
    this._pageBackgroundState = this._initPageBackground();
    this._pageBackground = new StatePageBackground(
      this._pageBackgroundState,
      this
    );
    return this._pageBackground;
  }

  /** Get font family and color of the currently displayed page. */
  get typography(): StatePageTypography {
    return this._pageTypography
      || (this._pageTypography = new StatePageTypography(
        this._pageTypographyState,
        this
      ));
  }
  /** The page content definition. */
  get content(): string { return this._pageState.content ?? ''; }
  /** The type of the page content represented by a special symbol. */
  get contentType(): string {
    return (this._pageContentState || this._getContentObj()).type;
  }
  /**
   * Identifier for a a specific content.  
   * e.g. name of a form, a page... etc.
   */
  get contentName(): string {
    return (this._pageContentState || this._getContentObj()).name;
  }
  /** Endpoint to which data may be sent or retrieve for the page. */
  get contentEndpoint(): string {
    return (this._pageContentState || this._getContentObj()).endpoint ?? '';
  }
  /**
   * Miscellanous URL arguments to be inserted when making a server request
   * at the endpoint specified in the page definition.
   */
  get contentArgs(): string {
    return (this._pageContentState || this._getContentObj()).args ?? '';
  }
  get view(): string {
    return (this._pageContentState || this._getContentObj()).name + 'View';
  }

  /** Chain-access to the page drawer definition. */
  get drawer(): StatePageDrawer {
    if (this._pageDrawer) {
      return this._pageDrawer;
    }
    this._pageDrawerState = this._initPageDrawer();
    this._pageDrawer = new StatePageDrawer(this._pageDrawerState, this);
    return this._pageDrawer;
  }
  /** Chain-access to the page's layout definition */
  get layout(): TStatePageLayout { return this._pageState.layout || 'layout_none'; }
  /** Check if an appbar was defined for the current page. */
  get hasAppbar(): boolean {
    return !this._noPageAppbar
      || !!this._pageState.appbarInherited
      || !!this._pageState.useDefaultAppbar;
  }
  /** Check if a custom appbar was defined for the current page. */
  get hasCustomAppbar(): boolean {
    return !!this._pageState.appbarCustom
      || !!this._pageState.appbarCustomInherited;
  }
  /** Check if a drawer was defined for the current page. */
  get hasDrawer(): boolean {
    return !this._noPageDrawer
      || !!this._pageState.drawerInherited
      || !!this._pageState.useDefaultDrawer;
  }
  get hideAppbar(): boolean { return this._pageState.hideAppbar === true; }
  get hideDrawer(): boolean { return this._pageState.hideDrawer === true; }
  get useDefaultAppbar(): boolean { return !!this._pageState.useDefaultAppbar; }
  get useDefaultDrawer(): boolean { return !!this._pageState.useDefaultDrawer; }
  get useDefaultBackground(): boolean { return !!this._pageState.useDefaultBackground; }
  get useDefaultTypography(): boolean { return !!this._pageState.useDefaultTypography; }
  get inherit(): string { return this._pageState.inherited ?? ''; }
  get appbarInherited(): string { return this._pageState.appbarInherited ?? ''; }
  get drawerInherited(): string { return this._pageState.drawerInherited ?? ''; }
  get generateDefaultDrawer(): boolean { return this._pageState.generateDefaultDrawer === true; }
  get contentInherited(): string { return this._pageState.contentInherited ?? ''; }
  get backgroundInherited(): string { return this._pageState.backgroundInherited ?? ''; }
  get data(): Record<string, unknown> { return this._pageState.data ?? {}; }
  get meta(): Record<string, unknown> { return this._pageState.meta ?? {}; }
  get links(): IJsonapiPageLinks { return this._pageState.links ?? {}; }

  /** Define a drawer for the current page. */
  setDrawer = (drawer: IStatePageDrawer): void => {
    this._pageDrawerState = { ...StatePage.EMPTY_DRAWER, ...drawer };
    this._noPageDrawer = !drawer;
    this._pageDrawer = new StatePageDrawer(this._pageDrawerState, this);
  }

  /** Get browser tab's title */
  getTabTitle = (): string => {
    if (this.forcedTitle) {
      return this.forcedTitle;
    }

    const appTitle = this.parent.parent.app.title;

    if (this.title) {
      return `${appTitle} | ${this.title}`;
    }

    return appTitle;
  }

  /** Set the browser tab's title */
  setTabTitle = (): void => {
    document.title = this.getTabTitle();
  }

  private _getContentObj(): IStatePageContent {
    if (this._pageState.content) {
      return this._pageContentState = get_parsed_content(
        this._pageState.content
      );
    }
    if (this._pageState.inherited) {
      const inheritedContent = this.parent
        .getPageState(this._pageState.inherited)
        ?.content;
      return this._pageContentState = get_parsed_content(inheritedContent);
    }
    if (this._pageState.contentInherited) {
      const inheritedContent = this.parent
        .getPageState(this._pageState.contentInherited)
        ?.content;
      return this._pageContentState = get_parsed_content(inheritedContent);
    }
    return this._pageContentState = get_parsed_content();
  }

  /** Ensures the page has the correct appbar. */
  private _initPageAppbar = (): IStateAppbar => {
    if (this._pageState.appbar) {
      return { ...StatePage.EMPTY_APPBAR, ...this._pageState.appbar };
    }
    if (this._pageState.inherited) {
      const inheritedRoute = this._pageState.inherited;
      const inheritedState = this.parent.getPageState(inheritedRoute)?.appbar
      if (inheritedState) { return inheritedState; }
      ler(`StatePage.initPageAppbar: Failed to inherit app bar.`);
    }
    if (this._pageState.appbarInherited) {
      const appbarInheritedRoute = this._pageState.appbarInherited;
      const appbarInheritedState = this.parent
        .getPageState(appbarInheritedRoute)
        ?.appbar;
      if (appbarInheritedState) { return appbarInheritedState; }
      ler(`StatePage.initPageAppbar: Failed to inherit app bar.`);
    }
    if (this._pageState.useDefaultAppbar) {
      return this.parent.parent.appbar.state;
    }
    return StatePage.EMPTY_APPBAR;
  }

  /** There's no default custom appbar but you can inherit one. */
  private _initPageAppbarCustom = (): IStateComponent => {
    if (this._pageState.appbarCustom) {
      return this._pageState.appbarCustom;
    }
    if (this._pageState.appbarCustomInherited) {
      const route = this._pageState.appbarCustomInherited;
      return this.parent.getPageState(route)?.appbarCustom || {};
    }
    return this._pageAppbarCustomState || {};
  }

  /** Initializes and ensures that the page has the correct drawer. */
  private _initPageDrawer = (): IStateDrawer => {
    if (this._pageState.drawer) {
      return { ...StatePage.EMPTY_DRAWER, ...this._pageState.drawer };
    }
    if (this._pageState.inherited) {
      const route = this._pageState.inherited;
      const inheritedDrawerState = this.parent.getPageState(route)?.drawer;
      if (inheritedDrawerState) { return inheritedDrawerState; }
      ler(`StatePage.initPageDrawer: Failed to inherit drawer.`);
    }
    if (this._pageState.drawerInherited) {
      const drawerInheritedRoute = this._pageState.drawerInherited;
      const drawerInheritedState = this.parent
        .getPageState(drawerInheritedRoute)
        ?.drawer;
      if (drawerInheritedState) {
        return drawerInheritedState;
      }
      ler(`StatePage.initPageDrawer: Failed to inherit drawer.`);
    }
    if (this._pageState.useDefaultDrawer) {
      return this.parent.parent.drawer.state;
    }
    return StatePage.EMPTY_DRAWER;
  }

  /** Initializes and ensures that the page has the correct background. */
  private _initPageBackground = (): IStateBackground => {
    if (this._pageState.background) { return this._pageState.background; }
    // if background should be inherited from another page
    if (this._pageState.inherited) {
      const inheritedRoute = this._pageState.inherited;
      const inheritedBackground = this.parent.getPageState(inheritedRoute)
        ?.background
      if (inheritedBackground) { return inheritedBackground; }
    }
    if (this._pageState.backgroundInherited) {
      const route = this._pageState.backgroundInherited;
      try {
        const background = this.parent.getPageState(route)?.background;
        if (background) { return background; }
      } catch (e) {
        const message = `Error while inheriting background from "${route}" page.`;
        ler(message);
        ler((e as Error).stack);
        error_id(14).remember_exception(e, message); // error 14
      }
    }
    // If explicitly set to not use the default background.
    if (this._pageState.useDefaultBackground === false) { return {}; }
    // if no background was defined, pages will automatically use the default.
    return this.parent.parent.background.state;
  }

}
