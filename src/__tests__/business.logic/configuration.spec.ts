import { describe, it, expect } from 'vitest';
import { get_config, type IConfiguration } from '@tuber/shared';


describe('configuration.ts', () => {
  const initConfObj = {
    /** App default theme mode. */
    DEFAULT_THEME_MODE: 'light',
    /** Indicates whether the app is in debug mode or not. */
    DEBUG: false,
    /** Indicates whether the app is in development mode or not. */
    DEV: false,
    // TODO Add your config object values here e.g.
    // MY_CONFIG: 'my config value',
  };

  const $config = get_config();
  $config.init(initConfObj);

  // Makes config object key available in suggestions
  type IAppConfig = IConfiguration & typeof initConfObj;

  const Config = $config as IAppConfig;

  it('should initialize config object', () => {
    expect(Config).toBeDefined();
    expect(Config.DEFAULT_THEME_MODE).toBe('light');
    expect(Config.DEBUG).toBe(false);
    expect(Config.DEV).toBe(false);
  });

  it('should set config object value', () => {
    Config.set('MY_CONFIG', 'my config value');
    expect(Config.MY_CONFIG).toBe('my config value');
  });

  it('should read config object value', () => {
    expect(Config.read('MY_CONFIG')).toBe('my config value');
  });

  it('should write config object value', () => {
    Config.write('MY_CONFIG', 'new config value');
    expect(Config.MY_CONFIG).toBe('new config value');
  });

  it('should delete config object value', () => {
    Config.delete('MY_CONFIG');
    expect(Config.MY_CONFIG).toBeUndefined();
  });

  it('should clear config object', () => {
    Config.clear();
    expect(Config.DEFAULT_THEME_MODE).toBeUndefined();
    expect(Config.DEBUG).toBeUndefined();
    expect(Config.DEV).toBeUndefined();
  });
});