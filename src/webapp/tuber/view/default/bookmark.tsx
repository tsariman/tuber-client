import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import React, { Fragment, useCallback, useMemo } from 'react';
import { ENDPOINT, PLAYER_OPEN, SET_TO_PLAY, SHORTENED_NOTE_MAX_LENGTH } from '../../tuber.config';
import type { IBookmark } from '../../tuber.interfaces';
import { gen_video_url, shorten_text } from '../../_tuber.common.logic';
import BookmarkActionsToolbar from './bookmark.actions';
import { StateJsxIcon } from 'src/mui/icon';
import PlatformIcon from './platform.icon';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'src/state';
import StatePagesData from 'src/controllers/StatePagesData';
import { pagesDataAdd } from 'src/slices/pagesData.slice';

interface IBookmarkProps {
  children: IBookmark;
  handleExpandDetailIconOnClick: (annotation: IBookmark, i: number)
    => (e: React.MouseEvent)
    => void;
  index: number;
}

const StyledListItem = styled(ListItem)(() => ({
  float: 'left'
}));

const NoteGrid = styled(Grid)(() => ({
  display: 'flex'
}));

const NoteWrapper = styled('div')(() => ({
  position: 'relative',
  flex: 1
}));

const Note = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(3),
}));

const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
}));

const Title = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  fontSize: '1.13rem',
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}));

const PlatformIconWrapper = styled('div')(() => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: '0.25rem 0.5rem 0 0'
}));

const ExpandNoteIconWrapper = styled('a')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'absolute',
  left: 0,
  top: 0,
  textDecoration: 'none',
  color: theme.palette.grey[500],
}));

const ExpandNoteIcon = React.memo(() => <StateJsxIcon name='play_arrow_outline' />);

// Optimized Bookmark component with React.memo for performance
const Bookmark = React.memo<IBookmarkProps>(({ children: bookmark, index: i, handleExpandDetailIconOnClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const pagesDataState = useSelector((state: RootState) => state.pagesData);
  const reduxStore = useMemo(
    () => new StatePagesData(pagesDataState),
    [pagesDataState]
  );
  reduxStore.configure({ endpoint: ENDPOINT });
  const playerOpen = reduxStore.get<boolean>(PLAYER_OPEN);

  // Memoize shortened note text
  const shortenedNote = useMemo(() => shorten_text(bookmark.note), [bookmark.note]);

  // Memoize whether note should show expand button
  const shouldShowExpandButton = useMemo(() => 
    bookmark.note && bookmark.note.length > SHORTENED_NOTE_MAX_LENGTH, 
    [bookmark.note]
  );

  // Memoized click handlers
  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (playerOpen) {
      dispatch(pagesDataAdd({
        route: ENDPOINT,
        key: SET_TO_PLAY,
        value: bookmark
      }));
      dispatch(pagesDataAdd({
        route: ENDPOINT,
        key: PLAYER_OPEN,
        value: true
      }));
    } else {
      const url = bookmark.url || gen_video_url(bookmark);
      window.open(url, '_blank')?.focus();
    }
  }, [bookmark, dispatch, playerOpen]);

  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    handleExpandDetailIconOnClick(bookmark, i)(e);
  }, [handleExpandDetailIconOnClick, bookmark, i]);

  return (
    <StyledListItem disablePadding>
      <Stack sx={{ position: 'relative' }}>
        <Grid container direction='column'>
          <TitleWrapper>
            <PlatformIconWrapper>
              <PlatformIcon platform={bookmark.platform} />
            </PlatformIconWrapper>
            <Title href='#' onClick={handleBookmarkClick}>
              <ListItemText primary={bookmark.title} />
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
                  >
                    <ExpandNoteIcon aria-label='expand row' />
                  </ExpandNoteIconWrapper>
                )}
                <Note>{shortenedNote}</Note>
              </NoteWrapper>
            </NoteGrid>
            <BookmarkActionsToolbar i={i} bookmark={bookmark} />
          </Fragment>
        ) : (
          <BookmarkActionsToolbar i={i} bookmark={bookmark} />
        )}
      </Stack>
    </StyledListItem>
  );
});

// Set display name for debugging
Bookmark.displayName = 'Bookmark';

export default Bookmark;