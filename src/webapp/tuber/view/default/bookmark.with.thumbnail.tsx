
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import React, { Fragment, useCallback, useMemo } from 'react';
import type { IBookmark } from '../../tuber.interfaces';
import { gen_video_url, shorten_text } from '../../_tuber.common.logic';
import BookmarkActionsToolbar from './list.actions';
import Thumbnail from './thumbnail';
import PlatformIcon from './platform.icon';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from 'src/state';
import StatePagesData from 'src/controllers/StatePagesData';
import { ENDPOINT, PLAYER_OPEN, SET_TO_PLAY } from '../../tuber.config';
import { pagesDataAdd } from 'src/slices/pagesData.slice';

interface IBookmarkProps {
  children: IBookmark;
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

const ClickTitle = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  fontSize: '1.13rem',
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}));

const ClickThumbnail = styled('a')(() => ({
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',
}));

const PlatformIconWrapper = styled('div')(() => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: '0.25rem 0.5rem 0 0',
}));

// Optimized BookmarkWithThumbnail component with React.memo for performance
const BookmarkWithThumbnail = React.memo<IBookmarkProps>(({ 
  children: bookmark, 
  index: i
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const pagesDataState = useSelector((state: RootState) => state.pagesData);
  const reduxStore = useMemo(
    () => new StatePagesData(pagesDataState),
    [pagesDataState]
  );
  reduxStore.configure({ endpoint: ENDPOINT });
  const playerOpen = reduxStore.get<boolean>(PLAYER_OPEN);

  // Memoize shortened text values
  const shortenedTitle = useMemo(() => shorten_text(bookmark.title, false, 27), [bookmark.title]);
  const shortenedNote = useMemo(() => 
    bookmark.note ? shorten_text(bookmark.note, false, 27) : null, 
    [bookmark.note]
  );

  // Memoize thumbnail href
  const thumbnailHref = useMemo(() => 
    `#${bookmark.videoid ?? bookmark.slug}`, 
    [bookmark.videoid, bookmark.slug]
  );

  // Memoized click handlers - now stable across renders
  const handleBookmarkClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
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

  return (
    <StyledListItem key={`bookmark[${i}]`} disablePadding>
      {bookmark.thumbnail_url ? ( // If bookmark has a thumbnail, it can be clicked.
        <ClickThumbnail
          href={thumbnailHref}
          onClick={handleBookmarkClick}
        >
          <Thumbnail i={i} bookmark={bookmark} />
        </ClickThumbnail>
      ) : ( // Otherwise, it is not clickable.
        <Thumbnail i={i} bookmark={bookmark} />
      )}
      <Stack sx={{ position: 'relative' }}>
        <Grid container direction='column'>
          <TitleWrapper>
            <PlatformIconWrapper>
              <PlatformIcon platform={bookmark.platform} />
            </PlatformIconWrapper>
            <ClickTitle href='#' onClick={handleBookmarkClick}>
              <ListItemText primary={shortenedTitle} />
            </ClickTitle>
          </TitleWrapper>
        </Grid>
        {bookmark.note ? (
          <Fragment>
            <NoteGrid container direction='row'>
              <NoteWrapper>
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
BookmarkWithThumbnail.displayName = 'BookmarkWithThumbnail';

export default BookmarkWithThumbnail;