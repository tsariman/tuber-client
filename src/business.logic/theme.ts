import { THEME_DEFAULT_MODE, type TThemeMode } from '@tuber/shared'

const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export function get_default_theme_mode(): TThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return THEME_DEFAULT_MODE
  }

  try {
    return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light'
  } catch {
    return THEME_DEFAULT_MODE
  }
}