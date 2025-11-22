import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from 'src/state';
import LoadMoreBookmarksFromServer, {
  LoadEarlierBookmarksFromServer
} from './list.bookmark.loader';
import type { IBookmark } from '../../tuber.interfaces';
import StateData from 'src/controllers/StateData';
import BookmarkWithThumbnail from './bookmark.with.thumbnail';

const BookmarkListWrapper = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  [theme.breakpoints.up('md')]: {
    width: 500,
  },
  width: '100%',
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

export default function TuberThumbnailedBookmarkList() {

  // Memoize state selectors
  const dataState = useSelector((state: RootState) => state.data);
  const data = useMemo(() => new StateData(dataState), [dataState]);

  // Memoize bookmark collection
  const bookmarks = useMemo(() => {
    return data.configure({ endpoint: 'bookmarks' })
      .flatten()
      .get<IBookmark>();
  }, [data]);

  return (
    <BookmarkListWrapper>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList>
        {bookmarks.map((bookmark, i) => (
          <BookmarkWithThumbnail
            key={bookmark.id || bookmark.url || `bookmark-${i}`}
            index={i}
          >
            {bookmark}
          </BookmarkWithThumbnail>
        ))}
      </StyledList>
      <LoadMoreBookmarksFromServer def={data} />
    </BookmarkListWrapper>
  );
}
