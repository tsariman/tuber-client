import React, { useRef } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetBookmarkListScrollAnchorForTests, useBookmarkListScrollRestore } from '../list.scroll.restore'

type Bookmark = {
  id?: number | string | null
  url?: string | null
}

type VirtualItem = { index: number; start: number; end: number }

type HookOptions = {
  bootstrapPhase?: boolean
  centerPlayingBookmarkOnBootstrap?: boolean
  playingBookmarkKey?: string | null
}

function HookProbe({
  bookmarks,
  virtualizer,
  options,
}: {
  bookmarks: Bookmark[]
  virtualizer: {
    getVirtualItems: () => VirtualItem[]
    scrollToIndex: (index: number, options?: { align?: 'auto' | 'start' | 'center' | 'end' }) => void
  }
  options?: HookOptions
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useBookmarkListScrollRestore(bookmarks, virtualizer, scrollContainerRef, {
    bootstrapPhase: options?.bootstrapPhase ?? true,
    centerPlayingBookmarkOnBootstrap: options?.centerPlayingBookmarkOnBootstrap ?? true,
    playingBookmarkKey: options?.playingBookmarkKey ?? null,
  })

  return <div data-testid='hook-probe' ref={scrollContainerRef} />
}

describe('useBookmarkListScrollRestore bootstrap centering', () => {
  beforeEach(() => {
    resetBookmarkListScrollAnchorForTests()
  })

  afterEach(() => {
    resetBookmarkListScrollAnchorForTests()
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
        options={{ playingBookmarkKey: '30' }}
      />
    )

    expect(scrollToIndex).toHaveBeenCalledTimes(1)
    expect(scrollToIndex).toHaveBeenCalledWith(2, { align: 'center' })
  })

  it('restores the previously visible bookmark centered when switching views', () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })

    const getVirtualItems = vi.fn(() => [
      { index: 0, start: 0, end: 100 },
      { index: 1, start: 100, end: 200 },
      { index: 2, start: 200, end: 300 },
    ])
    const scrollToIndex = vi.fn()

    const bookmarks: Bookmark[] = [
      { id: 10 },
      { id: 20 },
      { id: 30 },
    ]

    const { getByTestId, unmount } = render(
      <HookProbe
        bookmarks={bookmarks}
        virtualizer={{ getVirtualItems, scrollToIndex }}
        options={{ bootstrapPhase: false, centerPlayingBookmarkOnBootstrap: false, playingBookmarkKey: null }}
      />
    )

    const probe = getByTestId('hook-probe') as HTMLDivElement
    probe.scrollTop = 150
    fireEvent.scroll(probe)

    scrollToIndex.mockClear()
    unmount()

    render(
      <HookProbe
        bookmarks={bookmarks}
        virtualizer={{ getVirtualItems, scrollToIndex }}
        options={{ bootstrapPhase: true, centerPlayingBookmarkOnBootstrap: true, playingBookmarkKey: null }}
      />
    )

    expect(scrollToIndex).toHaveBeenCalledTimes(1)
    expect(scrollToIndex).toHaveBeenCalledWith(1, { align: 'center' })
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
        options={{ playingBookmarkKey: '30' }}
      />
    )

    expect(scrollToIndex).not.toHaveBeenCalled()
  })
})
