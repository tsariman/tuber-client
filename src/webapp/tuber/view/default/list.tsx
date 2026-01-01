import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import React, { useCallback, useMemo, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from 'src/state'
import { useVirtualizer } from '@tanstack/react-virtual'
import { shorten_text } from '../../_tuber.common.logic'
import {
  LoadEarlierBookmarksFromServer,
  InfiniteScrollTrigger
} from './list.bookmark.loader'
import type { IBookmark } from '../../tuber.interfaces'
import StateData from 'src/controllers/StateData'
import Bookmark from './bookmark'

const BookmarkListWrapper = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 128px)',
  overflowY: 'auto',
  [theme.breakpoints.up('md')]: {
    width: 500,
  },
  width: '100%',
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

export default function TuberBookmarkList() {
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
    annotation: IBookmark,
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
    
    const text = isExpanded 
      ? (annotation.note ?? '(No note)')
      : shorten_text(annotation.note)
    detail.appendChild(document.createTextNode(text))
  }, [expandedNotes, handleToggleExpand])

  // Set up virtual scrolling with dynamic measurement
  const virtualizer = useVirtualizer({
    count: bookmarks.length + 1, // +1 for infinite scroll trigger
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index: number) => {
      if (index === bookmarks.length) return 40 // Infinite scroll trigger
      return 80 // Estimated height for bookmark items without thumbnails
    }, [bookmarks.length]),
    overscan: 5,
  })

  return (
    <BookmarkListWrapper ref={parentRef}>
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
              <Bookmark
                handleExpandDetailIconOnClick={handleExpandDetailIconOnClick}
                index={virtualItem.index}
              >
                {bookmark}
              </Bookmark>
            </VirtualItem>
          )
        })}
      </StyledList>
    </BookmarkListWrapper>
  )
}
