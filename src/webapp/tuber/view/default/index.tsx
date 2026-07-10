import { Fragment, useEffect, useLayoutEffect, useMemo } from 'react'
import { StatePage, StatePagesData } from 'src/controllers'
import type { IBookmark } from '../../tuber.interfaces'
import BookmarkList from './list'
import TuberPlayer from './player'
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import ResearchToolbarFixed from '../tuber.toolbar.video.search'
import BookmarkListThumbnailedNoPlayer from './list.no.player'
import { useMediaQuery } from '@mui/material'
import BookmarkListThumbnailed from './list.with.thumbnail'
import type { AppDispatch, RootState } from 'src/state'
import { useDispatch, useSelector } from 'react-redux'
import {
  PLAYER_OPEN,
  SET_TO_PLAY,
  SHOW_THUMBNAIL,
} from '../../tuber.config'
import { pagesDataAdd } from 'src/slices/pagesData.slice'
import { build_bookmarks_query_sync_path } from '../../query.string.sync'
import { EP_BOOKMARKS, APP_REQUEST_FAILED } from '@tuber/shared'

// [FRAMEWORK] Debounce duration for query-string syncing (configurable per app).
const QUERY_SYNC_DEBOUNCE_MS = 150

const TuberPlayerWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(2),
  },
  height: 'calc(100vh - 128px)',
  top: 64,
  right: 0,
}))

export default function ViewDefault({ instance: page }: { instance: StatePage}) {
  const dispatch = useDispatch<AppDispatch>()
  const pagesDataState = useSelector((state: RootState) => state.pagesData)
  const pagesData = useMemo(() => {
    const instance = new StatePagesData(pagesDataState)
    instance.configure({ endpoint: EP_BOOKMARKS })
    return instance
  }, [pagesDataState])

  const theme = useTheme()
  const currentGreaterThanMid = useMediaQuery(theme.breakpoints.up('md'))
  const playerOpen = pagesData.get<boolean>(PLAYER_OPEN)
  const showThumbnail = pagesData.get<boolean>(SHOW_THUMBNAIL)
  const bookmarkToPlay = pagesData.get<IBookmark>(SET_TO_PLAY)
  const appState = useSelector((state: RootState) => state.app)
  const appbarQueriesState = useSelector((state: RootState) => state.appbarQueries)
  const staticRegistryState = useSelector((state: RootState) => state.staticRegistry)

  // Closes the integrated player if window size is too small.
  useLayoutEffect(() => {
    const updateLayout = () => {
      if (!currentGreaterThanMid) {
        dispatch(pagesDataAdd({
          route: EP_BOOKMARKS,
          key: PLAYER_OPEN,
          value: false
        }))
      }
    }
    window.addEventListener('resize', updateLayout)
    updateLayout()
    return () => window.removeEventListener('resize', updateLayout)
  }, [currentGreaterThanMid, dispatch])

  // [FRAMEWORK] Debounced URL syncing pattern for shareable state.
  // [BEHAVIOR] Collects state snapshot, builds URL via app-specific builder,
  // debounces 150ms, diffs against current URL, and replaceState only if changed.
  // [TO REUSE] Keep the debounce + diff + replaceState pattern; swap buildBookmarksQuerySyncPath
  // for your app's own query builder. Adjust QUERY_SYNC_DEBOUNCE_MS if needed.
  useEffect(() => {
    const snapshot = {
      app: appState,
      pagesData: pagesDataState,
      staticRegistry: staticRegistryState,
      playerOpen,
      showThumbnail,
      bookmarkToPlay,
      appbarQueries: appbarQueriesState,
    }
    // [APP-SPECIFIC] buildBookmarksQuerySyncPath extracts tuber bookmark state rules.
    const nextUrl = build_bookmarks_query_sync_path(
      snapshot,
      window.location.pathname,
      window.location.hash
    )
    if (!nextUrl || appState.status === APP_REQUEST_FAILED) {
      return
    }

    const timer = window.setTimeout(() => {
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
      // [FRAMEWORK] Diff guard: only call replaceState if URL changed.
      if (currentUrl !== nextUrl) {
        window.history.replaceState(null, '', nextUrl)
      }
    }, QUERY_SYNC_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [
    appState,
    appbarQueriesState,
    pagesDataState,
    staticRegistryState,
    playerOpen,
    showThumbnail,
    bookmarkToPlay
  ])

  return (
    <Fragment>
      <Toolbar />
      {playerOpen ? (
        <Grid container direction='row'>
          {showThumbnail ? (
            <BookmarkListThumbnailed />
          ) : (
            <BookmarkList />
          )}
          <TuberPlayerWrapper>
            <TuberPlayer bookmark={bookmarkToPlay} instance={page.appbar} />
          </TuberPlayerWrapper>
        </Grid>
      ) : (
        <Fragment>
          <BookmarkListThumbnailedNoPlayer />
          <ResearchToolbarFixed instance={page.appbar} />
        </Fragment>
      )}
    </Fragment>
  )
}
