import { type CSSProperties } from 'react'
import { type SxProps } from '@mui/material'
import AbstractState from './AbstractState'
import type { IStateBackground } from '@tuber/shared'
import type State from './State'

/** Wrapper class for `initial.state.background` */
export default class StateBackground<P = State>
  extends AbstractState
  implements IStateBackground
{
  private _backgroundState: IStateBackground
  private _parent: P

  constructor(backgroundState: IStateBackground, parent: P) {
    super()
    this._backgroundState = backgroundState
    this._parent = parent
  }

  /** Get the background json. */
  get state(): IStateBackground { return this._backgroundState }
  get parent(): P { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  configure(conf: unknown): void { void conf }
  get color(): CSSProperties['backgroundColor'] { return this._backgroundState.color }
  get image(): CSSProperties['backgroundImage'] { return this._backgroundState.image }
  get repeat(): CSSProperties['backgroundRepeat'] { return this._backgroundState.repeat }

  get sx(): SxProps {
    return {
      backgroundColor: this._backgroundState.color,
      backgroundImage: this._backgroundState.image,
      backgroundRepeat: this._backgroundState.repeat
    }
  }
}
