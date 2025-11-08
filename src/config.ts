import { type TThemeMode, get_config, type IConfiguration } from '@tuber/shared';
// import { TThemeMode } from './common.types';

const initConfObj = {
  /** App default theme mode. */
  DEFAULT_THEME_MODE: 'light' as TThemeMode,
  /** Indicates whether the app is in debug mode or not. */
  DEBUG: false,
  /** Indicates whether the app is in development mode or not. */
  DEV: false,
  // TODO Add your config object values here e.g.
  // MY_CONFIG: 'my config value',
};

const Config = get_config();
Config.init(initConfObj);

// Makes config object key available in suggestions
export type IAppConfig = IConfiguration & typeof initConfObj;

export default Config as IAppConfig;
