import { type TThemeMode, type IConfiguration } from '@tuber/shared'
import get_config from './business.logic/Configuration'

const initConfObj = {
  /** App default theme mode. */
  DEFAULT_THEME_MODE: 'light' as TThemeMode,
  /** Indicates whether the app is in debug mode or not. */
  DEBUG: false,
  /** Indicates whether the app is in development mode or not. */
  DEV: false,
  // TODO Add your config object values here e.g.
  // MY_CONFIG: 'my config value',
}

const Config = get_config()
Config.init(initConfObj)

// Makes config object key available in suggestions
export default Config as IConfiguration & typeof initConfObj
