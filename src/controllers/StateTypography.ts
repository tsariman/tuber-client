import AbstractState from './AbstractState'
import type { IStateTypography } from '@tuber/shared'
import type State from './State'

/** Wrapper class for `initialState.typography` */
export default class StateTypography<P = State>
  extends AbstractState
  implements IStateTypography
{
  protected typographyState: IStateTypography
  protected parentDef: P

  /**
   * Constructor
   *
   * @param typographyState 
   */
  constructor(typographyState: IStateTypography, parent: P) {
    super()
    this.typographyState = typographyState
    this.parentDef = parent
  }

  configure(conf: unknown): void { void conf }
  /** Get the typography state */
  get state(): IStateTypography { return this.typographyState }
  /** Chain-access to root, page, or appbar definition */
  get parent(): P { return this.parentDef }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  get color(): string|undefined { return this.typographyState.color }
  get fontFamily(): string|undefined { return this.typographyState.fontFamily }
}
