// [APP-SPECIFIC] Tuber bookmark query-string builder.
// Encodes search mode, text, player state, and playing bookmark into URL params.
// If reusing the framework, replace this entire module with your app's own builder.

import { APP_REQUEST_FAILED } from '@tuber/shared'
import type { IBookmark } from './tuber.interfaces'
import { PAGE_RESEARCH_APP_ID } from './tuber.config'
import { safely_get_as } from 'src/business.logic/utility'

const ALLOWED_SEARCH_MODES = new Set(['public', 'private', 'all'])
const MAX_SEARCH_LENGTH = 255

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

/** If pathname only contains a leading slash, return an empty string */
const $normalize_pathname = (pathname: string): string => {
  if (typeof pathname !== 'string') {
    return ''
  }
  const trimmed = pathname.trim()
  if (trimmed === '/') {
    return ''
  }
  return trimmed
}

// [FRAMEWORK] Generic state shape passed to query builder from App.
type TQuerySyncState = {
  app: {
    status?: string
    route?: string
    homepage?: string
  }
  pagesData: Record<string, unknown>
  staticRegistry: Record<string, unknown>
  routeKey?: string
  searchMode?: string
  playerOpen?: boolean
  showThumbnail?: boolean
  bookmarkToPlay?: IBookmark
  appbarQueries: Record<string, { value?: string } | undefined>
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

  const {
    appbarQueries,
    pagesData,
    playerOpen,
    showThumbnail,
    bookmarkToPlay,
    staticRegistry
  } = state

  const routeKey = staticRegistry[PAGE_RESEARCH_APP_ID] as string | undefined
  if (!routeKey) {
    return null
  }
  const searchValue = appbarQueries[routeKey]?.value
  const search = typeof searchValue === 'string' ? searchValue.trim() : ''
  if (!search || search.length > MAX_SEARCH_LENGTH) {
    return null
  }

  const searchMode = safely_get_as(pagesData, `${routeKey}.searchMode`, 'public')

  if (typeof searchMode !== 'string' || !ALLOWED_SEARCH_MODES.has(searchMode)) {
    return null
  }

  const params = new URLSearchParams()
  params.set('filter[search_mode]', searchMode)
  params.set('filter[search]', search)

  if (typeof playerOpen === 'boolean') {
    params.set('filter[player_open]', String(playerOpen))
  }
  if (typeof showThumbnail === 'boolean') {
    params.set('filter[show_thumbnail]', String(showThumbnail))
  }

  const playingBookmarkKey = getPlayingBookmarkKey(bookmarkToPlay)
  if (playingBookmarkKey) {
    params.set('filter[playing_bookmark_key]', playingBookmarkKey)
  }

  const query = params.toString()
  const pathname = $normalize_pathname(basePathname)
  return query ? `${pathname}?${query}${baseHash}` : `${pathname}${baseHash}`
}
