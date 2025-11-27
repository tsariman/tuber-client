import AbstractState from './AbstractState'
import StateLink from './StateLink'
import type State from './State'
import type { TWithRequired } from '@tuber/shared'
import type { IStateDrawer } from '../interfaces/localized'
import type { DrawerProps } from '@mui/material'

/** Wrapper class for `initial.state.drawer` */
export default class StateDrawer<P = State>
  extends AbstractState
  implements IStateDrawer
{
  protected drawerState: IStateDrawer
  protected parentDef: P
  /** Default drawer width */
  static DEFAULT_WIDTH: number = 300
  protected drawerItems?: StateLink<StateDrawer<P>>[]

  constructor (drawerState: IStateDrawer, parent: P) {
    super()
    this.drawerState = drawerState
    this.parentDef = parent
  }

  get state(): IStateDrawer { return this.drawerState }
  get parent(): P { return this.parentDef }
  get props(): TWithRequired<DrawerProps, 'anchor'> {
    return {
      ...this.drawerState.props,
      anchor: this.drawerState.anchor ?? 'left'
    }
  }
  configure(conf: unknown): void { void conf }
  get _type() { return this.drawerState._type || 'none' }
  /** Get the drawer's list of icon links. */
  get items(): StateLink[] {
    return this.drawerItems
      || (this.drawerItems = (this.drawerState.items || []).map(
        item => new StateLink<this>(item, this)
      ))
  }
  /** Whether the drawer is open or not. */
  get open(): boolean { return this.drawerState.open === true }
  /** Drawer's width */
  get width(): number { return this.drawerState.width || StateDrawer.DEFAULT_WIDTH }
}
