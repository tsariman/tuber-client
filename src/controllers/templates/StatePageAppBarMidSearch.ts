import type { IconButtonProps } from '@mui/material/IconButton'
import type { IStateAppbar } from '../../interfaces/localized'
import type { IStatePageAppbarConfig } from '../../interfaces/IControllerConfiguration'
import StateAppbarInputChip from '../StateAppbarInputChip'
import StateFormItemCustom from '../StateFormItemCustom'
import StateLink from '../StateLink'
import StateFormItemCustomChip from './StateFormItemCustomChip'
import StatePageAppbar from './StatePageAppbar'

/** Wrapper template class for a page appbar state */
export default class StatePageAppbarMidSearch extends StatePageAppbar {
  
  protected searchFieldIconButtonDef?: StateLink<this>
  protected inputChipsDefs?: StateFormItemCustomChip[]
  protected _chip?: StateAppbarInputChip
  protected _route?: string
  protected _template?: string

  configure = (opts: IStatePageAppbarConfig) => {
    const { chips, route, template, $default, app, allPages } = opts
    this.defaultDef = $default
    this.appDef = app
    this.allPagesDef = allPages
    if (chips) {
      this._chip = new StateAppbarInputChip(chips)
      this._chip.configure({ route, template })
    }
    this._route = route
    this._template = template
  }

  /** Whether the app bar has any chips in the search field. */
  get inputHasChips(): boolean {
    return !!this.inputChipsDefs && this.inputChipsDefs.length > 0
  }

  get inputHasNoChips(): boolean {
    return !this.inputChipsDefs || this.inputChipsDefs.length === 0
  }

  get menuIconProps(): IconButtonProps {
    return {
      'size': 'large',
      'edge': 'start',
      'color': 'inherit',
      'aria-label': 'open drawer',
      'sx': { 'mr': 2 },
      ...this.appbarState.menuIconProps
    }
  }

  get searchFieldIcon(): StateFormItemCustom<this> {
    return new StateFormItemCustom({
      'icon': 'search_outline',
      'svgIconProps': {
        'sx': { 'color': 'grey.500' }
      },
      ...this.appbarState.searchFieldIcon
    }, this)
  }

  get searchFieldIconButton(): StateLink<this> {
    return this.searchFieldIconButtonDef || (this.searchFieldIconButtonDef = new StateLink({
      'type': 'icon',
      'has': {
        'icon': 'search_outline',
      },
      ...this.appbarState.searchFieldIconButton,
      'props': {
        'aria-label': 'search',
        'onMouseDown': this.handleMouseDown,
        'edge': 'end',
        'size': 'small',
        'sx': { 'mr': .5 },
        ...this.appbarState.searchFieldIconButtonProps
      },
    }, this))
  }

  get inputBaseProps(): Required<IStateAppbar>['inputBaseProps'] {
    return {
      'autoComplete': 'off',
      'placeholder': 'Search…',
      'inputProps': { 'aria-label': 'search' },
      'fullWidth': true,
      'id': 'search-field',
      ...this.appbarState.inputBaseProps,
      'sx': {
        ...this.appbarState.inputBaseProps?.sx,
        ...(this.inputHasNoChips ? {
          'paddingLeft': (theme) => `calc(1em + ${theme.spacing(4)})`
        } : {
          'paddingLeft': .5,
        }),
      },
    }
  }

  get logoContainerProps(): Required<IStateAppbar>['logoContainerProps'] {
    return this.appbarState.logoContainerProps ?? {}
  }

  private _breakPath(path: string): string[] {
    const fixedPath = path.replace(/^\/|\/$/, '')
    const parts = fixedPath.split('/')
    return parts
  }

  /**
   * Gathers information about the template and route to determine if the
   * a chip should be added to the search field.  
   * The template and route must have the same first part and the same number
   * of parts.
   *
   * @param tpl papthnames with placeholders e.g. endpoint/:page/:id
   * @param route current route pathnames
   * @returns 
   */
  private _tplRouteAnal(tpl: string, route: string): {
    tplParts: string[],
    routeParts: string[],
    match: boolean
  } {
    const anal = {
      'tplParts': this._breakPath(tpl),
      'routeParts': this._breakPath(route),
      'match': false
    }
    anal.match = anal.tplParts.length === anal.routeParts.length
      && anal.tplParts[0] === anal.routeParts[0]
    return anal
  }

  tplRouteAnal(tpl: string, route: string) {
    this._tplRouteAnal(tpl, route)
  }

  /**
   * Get input chip definition from state and path variables.
   *
   * @param tpl template string
   * @param route current route
   * @returns array of input chips definitions
   */
  get chips() {
    if (this.inputChipsDefs) { return this.inputChipsDefs }
    if (!this._route || !this._template || !this._chip) {
      return this.ler(
        'call StatePageAppbarMidSearch.configure() first.',
        this.inputChips
      )
    }
    this.inputChipsDefs = [ ...this._chip.alwaysGet() ]
    for (const ic of this.appbarState.inputBaseChips ?? []) {
      this.inputChipsDefs.push(
        new StateFormItemCustomChip<this>(ic, this)
      )
    }
    return this.inputChipsDefs
  }

  /** Get all chips in the search field. */
  get inputChips(): StateFormItemCustomChip[] {
    return this.inputChipsDefs
      || (this.inputChipsDefs = (this.appbarState.inputBaseChips || []).map(
        item => new StateFormItemCustomChip(item, this)
      ))
  }

}
