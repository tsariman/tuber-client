import Grid from '@mui/material/Grid'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import type { IBookmark } from '../../tuber.interfaces'
import { gen_video_url, shorten_text } from '../../_tuber.common.logic'
import React, { Fragment, useCallback, useMemo } from 'react'
import { SHORTENED_NOTE_MAX_LENGTH } from '../../tuber.config'
import BookmarkActionsToolbar from './bookmark.actions'
import Thumbnail from './thumbnail'
import { StateJsxIcon } from 'src/mui/icon'
import PlatformIcon from './platform.icon'
import BookmarkNoteMarkdown from './bookmark.note.markdown'

interface IBookmarkProps {
  children: IBookmark
  handleExpandDetailIconOnClick: (i: number)
    => (e: React.MouseEvent)
    => void
  index: number
  isExpanded: boolean
}

const StyledListItem = styled(ListItem)(({ theme: { spacing } }) => ({
  float: 'left',
  marginBottom: spacing(4),
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

const StackGrid = styled(Grid)(() => ({
  position: 'relative',
  flex: 1,
  minWidth: 0,
}))

const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start'
}))

const Title = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  fontSize: '1.13rem',
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}))

const TitleText = styled('span')(() => ({
  fontSize: 20,
  fontWeight: 400,
  wordBreak: 'break-word'
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

// Optimized BookmarkNoPlayer component with React.memo for performance
const BookmarkNoPlayer = React.memo<IBookmarkProps>(({
  children: bookmark,
  index: i,
  handleExpandDetailIconOnClick,
  isExpanded
}) => {

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
    const url = bookmark.url || gen_video_url(bookmark)
    window.open(url, '_blank')?.focus()
  }, [bookmark])
  
  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    handleExpandDetailIconOnClick(i)(e)
  }, [handleExpandDetailIconOnClick, i])

  return (
    <StyledListItem key={`bookmark[${i}]`} disablePadding>
      <Thumbnail i={i} bookmark={bookmark} />
      <StackGrid container direction='column'>
        <Grid container direction='row'>
          <TitleWrapper>
            <PlatformIconWrapper>
              <PlatformIcon platform={bookmark.platform} />
            </PlatformIconWrapper>
            <Title href='#' onClick={handleBookmarkClick}>
              <TitleText>{bookmark.title}</TitleText>
            </Title>
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
      </StackGrid>
    </StyledListItem>
  )
})

// Set display name for debugging
BookmarkNoPlayer.displayName = 'BookmarkNoPlayer'

export default BookmarkNoPlayer