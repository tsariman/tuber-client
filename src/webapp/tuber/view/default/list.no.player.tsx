import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import StateData from 'src/controllers/StateData';
import { type RootState } from 'src/state';
import { shorten_text } from '../../_tuber.common.logic';
import type { IBookmark } from '../../tuber.interfaces';
import LoadMoreBookmarksFromServer, {
  LoadEarlierBookmarksFromServer
} from './list.load.more';
import Bookmark from './bookmark.no.player';

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

export default function TuberBookmarkSearchWithThumbnails() {
  
  // Memoize state selectors
  const dataState = useSelector((state: RootState) => state.data);
  const data = useMemo(() => new StateData(dataState), [dataState]);
  
  // Memoize bookmark collection
  const bookmarks = useMemo(() => {
    return data.configure({ endpoint: 'bookmarks' })
      .flatten()
      .get<IBookmark>();
  }, [data]);

  // State for expanded notes (replaces global array)
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  // Memoized expand toggle handler
  const handleToggleExpand = useCallback((index: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleExpandDetailIconOnClick = useCallback((
    bookmark: IBookmark,
    i: number
  ) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLAnchorElement;
    const icon = element.children.item(0) as HTMLOrSVGImageElement;
    
    // Toggle expanded state
    handleToggleExpand(i);
    const isExpanded = !expandedNotes.has(i);
    
    // Animate icon
    icon.style.transition = 'all 0.4s ease';
    icon.style.transform = isExpanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)';
    
    // Update text content
    const detail = element.parentElement?.children.item(1) as HTMLDivElement;
    while (detail.firstChild) {
      detail.removeChild(detail.firstChild);
    }
    
    if (isExpanded) {
      // Insert the full note into the detail div
      const note = bookmark.note ? bookmark.note.replace('\n', '<br>') : '(No note)';
      detail.innerHTML = note;
    } else {
      // Insert the shortened note into the detail div using text node
      detail.appendChild(document.createTextNode(shorten_text(bookmark.note)));
    }
  }, [expandedNotes, handleToggleExpand]);

  return (
    <Container maxWidth='lg'>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList>
        {bookmarks.map((bookmark, i) => (
          <Bookmark
            key={`bookmark-${i}-${bookmark.id || bookmark.url}`}
            handleExpandDetailIconOnClick={handleExpandDetailIconOnClick}
            index={i}
          >
            {bookmark}
          </Bookmark>
        ))}
      </StyledList>
      <LoadMoreBookmarksFromServer def={data} />
    </Container>
  );
}
