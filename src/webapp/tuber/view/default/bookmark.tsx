import Grid from '@mui/material/Grid'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { Fragment, useCallback, useMemo } from 'react'
import {
  ENDPOINT,
  PLAYER_OPEN,
  PLAYING_BOOKMARK_PAGE,
  SET_TO_PLAY,
  SHORTENED_NOTE_MAX_LENGTH
} from '../../tuber.config'
import type { IBookmark } from '../../tuber.interfaces'
import {
  can_play_bookmark_in_player,
  gen_video_url,
  shorten_text
} from '../../_tuber.common.logic'
import BookmarkActionsToolbar from './bookmark.actions'
import { StateJsxIcon } from 'src/mui/icon'
import PlatformIcon from './platform.icon'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from 'src/state'
import StatePagesData from 'src/controllers/StatePagesData'
import { pagesDataAdd } from 'src/slices/pagesData.slice'
import BookmarkNoteMarkdown from './bookmark.note.markdown'

interface IBookmarkProps {
  children: IBookmark
  handleExpandDetailIconOnClick: (i: number)
    => (e: React.MouseEvent)
    => void
  index: number
  isExpanded: boolean
  sourcePage?: number
}

const StyledListItem = styled(ListItem)(() => ({
  float: 'left'
}))

const NoteGrid = styled(Grid)(() => ({
  display: 'flex'
}))

const NoteWrapper = styled('div')(() => ({
  position: 'relative',
  flex: 1
}))

const Note = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(3),
}))

const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
}))

const ClickableTitle = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}))

const Title = styled(ListItemText)(({ theme }) => ({
  margin: 0,
  '& .MuiListItemText-primary': {
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  }
}))

const PlatformIconWrapper = styled('div')(() => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: '0.25rem 0.5rem 0 0'
}))

const ExpandNoteIconWrapper = styled('a')<{ expanded: boolean }>(({ theme, expanded }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'absolute',
  left: 0,
  top: 0,
  textDecoration: 'none',
  color: theme.palette.grey[500],
  '& svg': {
    transition: 'all 0.4s ease',
    transform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
  },
}))

const ExpandNoteIcon = React.memo(() => <StateJsxIcon name='play_arrow_outline' />)

// Optimized Bookmark component with React.memo for performance
const Bookmark = React.memo<IBookmarkProps>(({ children: bookmark, index: i, handleExpandDetailIconOnClick, isExpanded, sourcePage }) => {
  const dispatch = useDispatch<AppDispatch>()
  const pagesDataState = useSelector((state: RootState) => state.pagesData)
  const reduxStore = useMemo(
    () => new StatePagesData(pagesDataState),
    [pagesDataState]
  )
  reduxStore.configure({ endpoint: ENDPOINT })
  const playerOpen = reduxStore.get<boolean>(PLAYER_OPEN)
  const bookmarkToPlay = reduxStore.get<IBookmark | undefined>(SET_TO_PLAY)
  const isCurrentlyPlaying = useMemo(() => {
    if (!playerOpen || !bookmarkToPlay) {
      return false
    }

    const currentBookmarkKey = bookmark.id || bookmark._id || bookmark.videoid || bookmark.slug || bookmark.url
    const playingBookmarkKey = bookmarkToPlay.id || bookmarkToPlay._id || bookmarkToPlay.videoid || bookmarkToPlay.slug || bookmarkToPlay.url

    return Boolean(currentBookmarkKey && currentBookmarkKey === playingBookmarkKey)
  }, [bookmark, bookmarkToPlay, playerOpen])

  // Memoize shortened note text
  const shortenedNote = useMemo(() => shorten_text(bookmark.note), [bookmark.note])

  // Memoize whether note should show expand button
  const shouldShowExpandButton = useMemo(() => 
    bookmark.note && bookmark.note.length > SHORTENED_NOTE_MAX_LENGTH, 
    [bookmark.note]
  )

  // Memoized click handlers
  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (playerOpen && can_play_bookmark_in_player(bookmark)) {
      dispatch(pagesDataAdd({
        route: ENDPOINT,
        key: SET_TO_PLAY,
        value: bookmark
      }))
      if (typeof sourcePage === 'number' && Number.isInteger(sourcePage) && sourcePage > 0) {
        dispatch(pagesDataAdd({
          route: ENDPOINT,
          key: PLAYING_BOOKMARK_PAGE,
          value: sourcePage
        }))
      }
      dispatch(pagesDataAdd({
        route: ENDPOINT,
        key: PLAYER_OPEN,
        value: true
      }))
    } else {
      const url = bookmark.url || gen_video_url(bookmark)
      window.open(url, '_blank')?.focus()
    }
  }, [bookmark, dispatch, playerOpen, sourcePage])

  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    handleExpandDetailIconOnClick(i)(e)
  }, [handleExpandDetailIconOnClick, i])

  return (
    <StyledListItem
      disablePadding
      sx={{
        width: '100%',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: isCurrentlyPlaying ? 'action.selected' : 'transparent',
        transition: 'background-color 0.2s ease-in-out'
      }}
    >
      <Stack sx={{ position: 'relative', width: '100%' }}>
        <Grid container direction='column'>
          <TitleWrapper>
            <PlatformIconWrapper>
              <PlatformIcon platform={bookmark.platform} />
            </PlatformIconWrapper>
            <ClickableTitle href='#' onClick={handleBookmarkClick}>
              <Title primary={bookmark.title} />
            </ClickableTitle>
          </TitleWrapper>
        </Grid>
        {bookmark.note ? (
          <Fragment>
            <NoteGrid container direction='row'>
              <NoteWrapper>
                {shouldShowExpandButton && (
                  <ExpandNoteIconWrapper
                    href='#'
                    onClick={handleExpandClick}
                    expanded={isExpanded}
                  >
                    <ExpandNoteIcon aria-label='expand row' />
                  </ExpandNoteIconWrapper>
                )}
                <Note>
                  {isExpanded ? (
                    <BookmarkNoteMarkdown note={bookmark.note} />
                  ) : (
                    shortenedNote
                  )}
                </Note>
              </NoteWrapper>
            </NoteGrid>
            <BookmarkActionsToolbar i={i} bookmark={bookmark} />
          </Fragment>
        ) : (
          <BookmarkActionsToolbar i={i} bookmark={bookmark} />
        )}
      </Stack>
    </StyledListItem>
  )
})

// Set display name for debugging
Bookmark.displayName = 'Bookmark'

export default Bookmark