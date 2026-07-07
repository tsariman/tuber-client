import React, { useRef } from 'react'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useBookmarkListScrollRestore } from '../list.scroll.restore'

type Bookmark = {
  id?: number | string | null
  url?: string | null
}

type VirtualItem = { index: number; start: number; end: number }

function HookProbe({
  bookmarks,
  virtualizer,
  playingBookmarkKey,
}: {
  bookmarks: Bookmark[]
  virtualizer: {
    getVirtualItems: () => VirtualItem[]
    scrollToIndex: (index: number, options?: { align?: 'auto' | 'start' | 'center' | 'end' }) => void
  }
  playingBookmarkKey: string
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useBookmarkListScrollRestore(bookmarks, virtualizer, scrollContainerRef, {
    bootstrapPhase: true,
    centerPlayingBookmarkOnBootstrap: true,
    playingBookmarkKey,
  })

  return <div data-testid='hook-probe' ref={scrollContainerRef} />
}

describe('useBookmarkListScrollRestore bootstrap centering', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('centers the playing bookmark during bootstrap when it is off-screen', () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })

    const getVirtualItems = vi.fn(() => [{ index: 0, start: 0, end: 100 }])
    const scrollToIndex = vi.fn()

    const bookmarks: Bookmark[] = [
      { id: 10 },
      { id: 20 },
      { id: 30 },
    ]

    render(
      <HookProbe
        bookmarks={bookmarks}
        virtualizer={{ getVirtualItems, scrollToIndex }}
        playingBookmarkKey='30'
      />
    )

    expect(scrollToIndex).toHaveBeenCalledTimes(1)
    expect(scrollToIndex).toHaveBeenCalledWith(2, { align: 'center' })
  })

  it('does not scroll when the playing bookmark is already visible during bootstrap', () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })

    const getVirtualItems = vi.fn(() => [
      { index: 1, start: 100, end: 200 },
      { index: 2, start: 200, end: 300 },
    ])
    const scrollToIndex = vi.fn()

    const bookmarks: Bookmark[] = [
      { id: 10 },
      { id: 20 },
      { id: 30 },
    ]

    render(
      <HookProbe
        bookmarks={bookmarks}
        virtualizer={{ getVirtualItems, scrollToIndex }}
        playingBookmarkKey='30'
      />
    )

    expect(scrollToIndex).not.toHaveBeenCalled()
  })
})
