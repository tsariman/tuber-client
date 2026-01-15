import { get_val, is_object, ler, non_empty_string } from 'src/business.logic'
import type { IRedux } from 'src/state'

type TSearchMode = 'public' | 'private' | 'both'

const searchModes: TSearchMode[] = [ 'private', 'public', 'both' ]
const icon: Record<TSearchMode, string> = {
  public: 'public_outline',
  private: 'user',
  both: 'user_circle'
}
const placeholder: Record<TSearchMode, string> = {
  public: 'Search public bookmarks…',
  private: 'Search your bookmarks…',
  both: 'Search all bookmarks…'
}

/**
 * Handler to switch between private and public search mode. In private mode,
 * user will search only their own bookmarks; in public mode, all public bookmarks
 * are searched.
 * @id xx_C_1
 */
const appbar_toggle_search_scope = (redux: IRedux) => {
  return () => {
    const { store: { dispatch, getState } } = redux
    const rootState = getState()
    const endpoint = rootState.staticRegistry[40]
    if (!non_empty_string(endpoint)) {
      ler('Cannot toggle search scope: no public endpoint configured.')
      return
    }
    const currentMode = get_val<TSearchMode>(rootState.pagesData, `${endpoint}.searchMode`)
    if (!non_empty_string(currentMode)) {
      ler('Cannot toggle search scope: no current search mode set.')
      return
    }
    if (!is_object(rootState.pagesData[endpoint]) || !searchModes.includes(currentMode)) {
      ler(`Cannot toggle search scope: invalid current mode "${currentMode}".`)
      return
    }

    const currentIndex = searchModes.indexOf(currentMode)
    const nextIndex = (currentIndex + 1) % searchModes.length
    const nextMode = searchModes[nextIndex]

    dispatch({ type: 'pagesData/pagesDataAdd', payload: {
      route: endpoint,
      key: 'searchMode',
      value: nextMode
    }})
    dispatch({ type: 'pagesData/pagesDataAdd', payload: {
      route: endpoint,
      key: 'icon',
      value: icon[nextMode]
    }})
    dispatch({ type: 'pagesData/pagesDataAdd', payload: {
      route: endpoint,
      key: 'placeholder',
      value: placeholder[nextMode]
    }})
  }
}

export default appbar_toggle_search_scope