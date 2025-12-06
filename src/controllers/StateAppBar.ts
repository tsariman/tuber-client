import type { AppBarProps } from '@mui/material'
import AbstractState from './AbstractState'
import type {
  IStateBackground,
  IStateTypography,
  TAppbarStyle
} from '@tuber/shared'
import type State from './State'
import type StateAppbarBackground from './templates/StateAppbarBackground'
import type StateAppbarTypography from './templates/StateAppbarTypography'
import StateComponent from './StateComponent'
import StateLink from './StateLink'
import type { IStateAppbar } from '../interfaces/localized'

/** Wrapper class for `initialState.appbar` */
export default class StateAppbar<P = State>
  extends AbstractState implements IStateAppbar
{
  protected parentDef: P
  protected appbarState: IStateAppbar
  protected appbarItems?: StateLink<this>[]
  protected appbarItems2?: StateLink<this>[]
  protected appbarTypographyState: IStateTypography
  protected appbarTypography?: StateAppbarTypography<P>
  protected appbarBackgroundState: IStateBackground
  protected appbarBackground?: StateAppbarBackground<P>
  protected appbarComponentsState: Required<IStateAppbar>['components']
  protected appbarComponents: {
    [comp: string]: StateComponent<P>[]
  }

  /**
   * Constructor
   *
   * @param appbarState
   */
  constructor(appbarState: IStateAppbar, parent: P) {
    super()
    this.parentDef = parent
    this.appbarState = appbarState
    this.appbarTypographyState = this.appbarState.typography
      || {}
    this.appbarBackgroundState = this.appbarState.background
      || {}
    this.appbarComponentsState = this.appbarState.components || {}
    this.appbarComponents = {}
  }

  /** Get a copy of the `appbar` json. */
  get state(): IStateAppbar { return this.appbarState }
  get parent(): P { return this.parentDef }
  get props(): AppBarProps { return this.appbarState.props ?? {} }
  configure(conf: unknown): void { void conf }
  get _type(): TAppbarStyle { return this.appbarState._type ?? 'none' }
  get appbarStyle(): TAppbarStyle { return this.appbarState.appbarStyle || 'basic' }

  /** Get app bar link objects. */
  get items(): StateLink<this>[] {
    return this.appbarItems || (
      this.appbarItems = (this.appbarState.items || []).map(
        item => new StateLink(item, this)
      )
    )
  }

  /** Get secondary app bar link objects if applicable. */
  get items2(): StateLink<this>[] {
    return this.appbarItems2 || (
      this.appbarItems2 = (this.appbarState.items2 || []).map(
        item => new StateLink(item, this)
      )
    )
  }

  get logoTheme(): React.HTMLAttributes<HTMLDivElement> {
    return this.appbarState.logoTheme || {}
  }

  getComponentItem(c: string): StateComponent<P>[] {
    if (this.appbarComponents[c]) {
      return this.appbarComponents[c]
    }
    if (this.appbarComponentsState[c]) {
      return this.appbarComponents[c] = this.appbarComponentsState[c].map(
        comp => new StateComponent(comp, this.parentDef)
      )
    }
    return []
  }

} // END class StateAppbar --------------------------------------------------
