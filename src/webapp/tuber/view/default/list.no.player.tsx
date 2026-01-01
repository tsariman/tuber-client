import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import React, { useCallback, useMemo, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useVirtualizer } from '@tanstack/react-virtual'
import StateData from 'src/controllers/StateData'
import { type RootState } from 'src/state'
import { shorten_text } from '../../_tuber.common.logic'
import type { IBookmark } from '../../tuber.interfaces'
import {
  LoadEarlierBookmarksFromServer,
  InfiniteScrollTrigger
} from './list.bookmark.loader'
import BookmarkNoPlayer from './bookmark.no.player'
import { EP_BOOKMARKS } from '@tuber/shared'

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}))

// Max width of 'lg' breakpoint is 1200px
// Dynamic padding centers content while respecting viewport width
const ScrollableContainer = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  paddingLeft: `max(${theme.spacing(2)}, calc((100vw - 1200px) / 2))`,
  paddingRight: `max(${theme.spacing(2)}, calc((100vw - 1200px) / 2))`,
  boxSizing: 'border-box',
}))

const VirtualItem = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  transform: 'translateY(var(--transform-y))',
}))

export default function TuberBookmarkSearchWithThumbnails() {
  const parentRef = useRef<HTMLDivElement>(null)
  
  // Memoize state selectors
  const dataState = useSelector((state: RootState) => state.data)
  const data = useMemo(() => new StateData(dataState), [dataState])
  
  // Memoize bookmark collection
  const bookmarks = useMemo(() => {
    return data.configure({ endpoint: EP_BOOKMARKS })
      .include('id')
      .flatten()
      .get<IBookmark>()
  }, [data])

  // State for expanded notes (replaces global array)
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set())

  // Memoized expand toggle handler
  const handleToggleExpand = useCallback((index: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  const handleExpandDetailIconOnClick = useCallback((
    bookmark: IBookmark,
    i: number
  ) => (e: React.MouseEvent) => {
    e.preventDefault()
    const element = e.currentTarget as HTMLAnchorElement
    const icon = element.children.item(0) as HTMLOrSVGImageElement
    
    // Toggle expanded state
    handleToggleExpand(i)
    const isExpanded = !expandedNotes.has(i)
    
    // Animate icon
    icon.style.transition = 'all 0.4s ease'
    icon.style.transform = isExpanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)'
    
    // Update text content
    const detail = element.parentElement?.children.item(1) as HTMLDivElement
    while (detail.firstChild) {
      detail.removeChild(detail.firstChild)
    }
    
    if (isExpanded) {
      // Insert the full note into the detail div
      const note = bookmark.note ? bookmark.note.replace('\n', '<br>') : '(No note)'
      detail.innerHTML = note
    } else {
      // Insert the shortened note into the detail div using text node
      detail.appendChild(document.createTextNode(shorten_text(bookmark.note)))
    }
  }, [expandedNotes, handleToggleExpand])

  // Set up virtual scrolling with dynamic measurement
  const virtualizer = useVirtualizer({
    count: bookmarks.length + 1, // +1 for infinite scroll trigger
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index: number) => {
      if (index === bookmarks.length) return 40 // Infinite scroll trigger
      return 100 // Estimated height for bookmark items
    }, [bookmarks.length]),
    overscan: 5,
  })

  return (
    <ScrollableContainer ref={parentRef}>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            if (virtualItem.index === bookmarks.length) {
              return (
                <VirtualItem
                  key="infinite-scroll-trigger"
                  style={{ '--transform-y': `${virtualItem.start}px` } as React.CSSProperties}
                >
                  <InfiniteScrollTrigger def={data} scrollContainerRef={parentRef} />
                </VirtualItem>
              )
            }
            const bookmark = bookmarks[virtualItem.index]
            return (
              <VirtualItem
                key={`bookmark-${virtualItem.index}-${bookmark.id || bookmark.url}`}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{ '--transform-y': `${virtualItem.start}px` } as React.CSSProperties}
              >
                <BookmarkNoPlayer
                  handleExpandDetailIconOnClick={handleExpandDetailIconOnClick}
                  index={virtualItem.index}
                >
                  {bookmark}
                </BookmarkNoPlayer>
              </VirtualItem>
            )
          })}
        </StyledList>
    </ScrollableContainer>
  )
}
