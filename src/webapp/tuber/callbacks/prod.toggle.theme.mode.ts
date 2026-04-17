import { clear_last_content_jsx } from 'src/business.logic/cache'
import Config from 'src/config'
import type { TThemeMode } from '@tuber/shared'
import { THEME_DEFAULT_MODE, THEME_MODE } from '@tuber/shared'
import { type IRedux } from 'src/state'
import { get_cookie } from 'src/business.logic'

/** @id 44_C_1 */
export default function toggle_theme_mode (redux: IRedux) {
  return async () => {
    const { store: { dispatch }, actions } = redux
    const rootState = redux.store.getState()
    const cookieThemeMode = get_cookie<TThemeMode>(THEME_MODE)
    const previousThemeMode = Config.read<TThemeMode>(
      THEME_MODE,
      cookieThemeMode || THEME_DEFAULT_MODE
    ) || cookieThemeMode || THEME_DEFAULT_MODE
    const nextThemeMode: TThemeMode = previousThemeMode === 'dark'
      ? 'light'
      : 'dark'
    const {
      pagesLight,
      pagesDark,
      formsLight,
      formsDark,
      dialogsLight,
      dialogsDark,
      themeLight,
      themeDark
    } = rootState
    setTimeout(() => {
      const isLightMode = nextThemeMode === 'light'
      clear_last_content_jsx()
      dispatch(actions.dialogDismount())
      dispatch(actions.appThemeModeUpdate(nextThemeMode))
      dispatch(actions.formsAddMultiple(isLightMode ? formsLight : formsDark))
      dispatch(actions.dialogsAddMultiple(isLightMode ? dialogsLight : dialogsDark))
      dispatch(actions.pagesAddMultiple(isLightMode ? pagesLight : pagesDark))
      dispatch(actions.themeSet(isLightMode ? themeLight : themeDark))
      document.cookie = `${THEME_MODE}=${nextThemeMode}; path=/; max-age=31536000; SameSite=Lax`
      Config.write(THEME_MODE, nextThemeMode)
    })
  }
}
