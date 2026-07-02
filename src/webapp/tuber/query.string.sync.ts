// [APP-SPECIFIC] Tuber bookmark query-string builder.
// Encodes search mode, text, player state, and playing bookmark into URL params.
// If reusing the framework, replace this entire module with your app's own builder.

import { APP_REQUEST_FAILED, EP_BOOKMARKS } from '@tuber/shared'
import {
  PLAYER_OPEN,
  SET_TO_PLAY,
  SHOW_THUMBNAIL
} from './tuber.config'
import type { IBookmark } from './tuber.interfaces'

const ALLOWED_SEARCH_MODES = new Set(['public', 'private', 'all'])
const MAX_SEARCH_LENGTH = 255

const getRouteKey = (route: string, homepage?: string): string => {
  const normalize = (value?: string): string => {
    if (!value) {
      return ''
    }
    return value.startsWith('/')
      ? value.slice(1)
      : value
  }

  if (route === '/') {
    return normalize(homepage)
  }
  return normalize(route)
}

const getPlayingBookmarkKey = (bookmark: unknown): string | undefined => {
  const candidate = bookmark as IBookmark | undefined
  if (!candidate || typeof candidate !== 'object') {
    return undefined
  }
  const key = candidate.id
    ?? candidate._id
    ?? candidate.videoid
    ?? candidate.slug
    ?? candidate.url
  return typeof key === 'string' && key.trim().length > 0
    ? key.trim()
    : undefined
}

// [FRAMEWORK] Generic state shape passed to query builder from App.
type TQuerySyncState = {
  app: {
    status?: string
    route?: string
    homepage?: string
  }
  appbarQueries: Record<string, { value?: string } | undefined>
  pagesData: Record<string, unknown>
}

// [APP-SPECIFIC] Tuber builder: accepts generic state shape, extracts tuber state,
// validates search rules, and returns guarded URL or null.
export const build_bookmarks_query_sync_path = (
  state: TQuerySyncState,
  basePathname: string,
  baseHash: string
): string | null => {
  if (state.app.status === APP_REQUEST_FAILED) {
    return null
  }

  const routeKey = getRouteKey(state.app.route ?? '', state.app.homepage)
  const searchValue = state.appbarQueries[routeKey]?.value
  const search = typeof searchValue === 'string' ? searchValue.trim() : ''
  if (!search || search.length > MAX_SEARCH_LENGTH) {
    return null
  }

  const routePageData = state.pagesData[routeKey] as Record<string, unknown> | undefined
  const pageData = state.pagesData[EP_BOOKMARKS] as Record<string, unknown> | undefined
  const searchMode = routePageData?.searchMode ?? pageData?.searchMode
  if (typeof searchMode !== 'string' || !ALLOWED_SEARCH_MODES.has(searchMode)) {
    return null
  }

  const params = new URLSearchParams()
  params.set('filter[search_mode]', searchMode)
  params.set('filter[search]', search)

  if (typeof pageData?.[PLAYER_OPEN] === 'boolean') {
    params.set('filter[player_open]', String(pageData[PLAYER_OPEN]))
  }
  if (typeof pageData?.[SHOW_THUMBNAIL] === 'boolean') {
    params.set('filter[show_thumbnail]', String(pageData[SHOW_THUMBNAIL]))
  }

  const playingBookmarkKey = getPlayingBookmarkKey(pageData?.[SET_TO_PLAY])
  if (playingBookmarkKey) {
    params.set('filter[playing_bookmark_key]', playingBookmarkKey)
  }

  const query = params.toString()
  const pathname = basePathname || '/'
  return query ? `${pathname}?${query}${baseHash}` : `${pathname}${baseHash}`
}
