import type { TThemeMode, IConfiguration } from '@tuber/shared'
import get_config from './business.logic/Configuration'
import { get_default_theme_mode } from './business.logic/theme'

const initConfObj = {
  /** App default theme mode. */
  DEFAULT_THEME_MODE: get_default_theme_mode() as TThemeMode,
  /** Indicates whether the app is in debug mode or not. */
  DEBUG: false,
  /** Indicates whether the app is in development mode or not. */
  DEV: false,
  /** Patreon page opened when upgrade prompts are triggered. */
  PATREON_URL: 'https://www.patreon.com/cw/TubeResearcher/membership',
  // TODO Add your config object values here e.g.
  // MY_CONFIG: 'my config value',
}

const Config = get_config()
Config.init(initConfObj)

// Makes config object key available in suggestions
export default Config as IConfiguration & typeof initConfObj
