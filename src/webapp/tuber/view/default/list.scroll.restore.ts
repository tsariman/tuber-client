import { type RefObject, useEffect, useRef } from 'react'

type BookmarkListItem = {
  id?: number | string | null
  url?: string | null
}

type VirtualizerLike = {
  getVirtualItems: () => Array<{ index: number; start: number; end: number }>
  scrollToIndex: (
    index: number,
    options?: { align?: 'auto' | 'start' | 'center' | 'end' }
  ) => void
}

type ScrollAnchorState = {
  bookmarkKey: string | null
}

// Shared in-memory anchor so sibling list views can restore to the same bookmark.
const bookmarkScrollAnchor: ScrollAnchorState = {
  bookmarkKey: null,
}

const getBookmarkKey = (bookmark: BookmarkListItem): string | null => {
  if (bookmark.id !== undefined && bookmark.id !== null) {
    return String(bookmark.id)
  }
  if (bookmark.url) {
    return bookmark.url
  }
  return null
}

export function useBookmarkListScrollRestore(
  bookmarks: BookmarkListItem[],
  virtualizer: VirtualizerLike,
  scrollContainerRef: RefObject<HTMLDivElement | null>
) {
  const didRestoreRef = useRef(false)

  useEffect(() => {
    if (didRestoreRef.current) return
    if (!bookmarks.length) return
    if (!bookmarkScrollAnchor.bookmarkKey) return

    const targetIndex = bookmarks.findIndex(
      (bookmark) => getBookmarkKey(bookmark) === bookmarkScrollAnchor.bookmarkKey
    )

    if (targetIndex >= 0) {
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(targetIndex, { align: 'start' })
      })
      didRestoreRef.current = true
    }
  }, [bookmarks, virtualizer])

  useEffect(() => {
    const updateAnchor = () => {
      const scrollTop = scrollContainerRef.current?.scrollTop ?? 0
      const firstVisibleVirtualItem = virtualizer
        .getVirtualItems()
        .find((virtualItem) => virtualItem.end > scrollTop)

      if (!firstVisibleVirtualItem) return

      const firstVisibleBookmark = bookmarks[firstVisibleVirtualItem.index]
      if (!firstVisibleBookmark) return

      bookmarkScrollAnchor.bookmarkKey = getBookmarkKey(firstVisibleBookmark)
    }

    updateAnchor()

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const onScroll = () => {
      requestAnimationFrame(updateAnchor)
    }

    scrollContainer.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scrollContainer.removeEventListener('scroll', onScroll)
    }
  }, [bookmarks, virtualizer, scrollContainerRef])
}
