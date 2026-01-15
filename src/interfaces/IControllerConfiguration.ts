import type { AppDispatch } from '../state'
import type { IStateAppbar, IStateDrawer, TStateAllChips } from '../interfaces/localized'
import type StateFormsDataErrors from '../controllers/StateFormsDataErrors'
import type { IStateBackground } from '@tuber/shared'
import type StateAppbarDefault from '../controllers/templates/StateAppbarDefault'
import type StateApp from '../controllers/StateApp'
import type StateAllPages from '../controllers/StateAllPages'

export interface IStateAppbarInpuChipConfig {
  template?: string
  route?: string
}

export interface IStateDataConfig<T = unknown> {
  dispatch?: AppDispatch
  endpoint?: string
  attribute?: keyof T
}

export interface IStateDataPagesRangConfig {
  maxLoadedPages?: number
  endpoint?: string
  pageSize?: number
}

export interface IStatePagesDataConfig {
  endpoint?: string
}

export interface IStateTmpConfig {
  dispatch?: AppDispatch
}

export interface IStateFormConfig {
  formsDataErrors?: StateFormsDataErrors<unknown>
}

export interface IStatePageConfig {
  defaultAppbarState?: IStateAppbar
  defaultDrawerState?: IStateDrawer
  defaultBackgroundState?: IStateBackground
}

export interface IStatePageAppbarConfig {
  $default?: StateAppbarDefault
  app?: StateApp
  allPages?: StateAllPages
  chips?: TStateAllChips
  route?: string
  template?: string
  searchModeIcon?: string
  searchModePlaceholder?: string
}