import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import { useMemo, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from 'src/state'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  LoadEarlierBookmarksFromServer,
  InfiniteScrollTrigger
} from './list.bookmark.loader'
import type { IBookmark } from '../../tuber.interfaces'
import StateData from 'src/controllers/StateData'
import BookmarkWithThumbnail from './bookmark.with.thumbnail'

const BookmarkListWrapper = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 128px)',
  overflowY: 'auto',
  [theme.breakpoints.up('md')]: {
    width: 500,
  },
  width: '100%',
  paddingLeft: theme.spacing(2),
}))

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}))

const VirtualItem = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  transform: 'translateY(var(--transform-y))',
}))

export default function TuberThumbnailedBookmarkList() {
  const parentRef = useRef<HTMLDivElement>(null)

  // Memoize state selectors
  const dataState = useSelector((state: RootState) => state.data)
  const data = useMemo(() => new StateData(dataState), [dataState])

  // Memoize bookmark collection
  const bookmarks = useMemo(() => {
    return data.configure({ endpoint: 'bookmarks' })
      .include('id')
      .flatten()
      .get<IBookmark>()
  }, [data])

  // Set up virtual scrolling with dynamic measurement
  const virtualizer = useVirtualizer({
    count: bookmarks.length + 1, // +1 for infinite scroll trigger
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index: number) => {
      // Last item is the infinite scroll trigger
      if (index === bookmarks.length) return 40
      return 120 // Estimated height for bookmark items
    }, [bookmarks.length]),
    overscan: 5, // Render 5 extra items outside visible area for smooth scrolling
  })

  return (
    <BookmarkListWrapper ref={parentRef}>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          // Last virtual item is the infinite scroll trigger
          if (virtualItem.index === bookmarks.length) {
            return (
              <VirtualItem
                key="infinite-scroll-trigger"
                style={{
                  '--transform-y': `${virtualItem.start}px`,
                } as React.CSSProperties}
              >
                <InfiniteScrollTrigger
                  def={data}
                  scrollContainerRef={parentRef}
                />
              </VirtualItem>
            )
          }
          const bookmark = bookmarks[virtualItem.index]
          return (
            <VirtualItem
              key={bookmark.id || bookmark.url || `bookmark-${virtualItem.index}`}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                '--transform-y': `${virtualItem.start}px`,
              } as React.CSSProperties}
            >
              <BookmarkWithThumbnail
                index={virtualItem.index}
              >
                {bookmark}
              </BookmarkWithThumbnail>
            </VirtualItem>
          )
        })}
      </StyledList>
    </BookmarkListWrapper>
  )
}
