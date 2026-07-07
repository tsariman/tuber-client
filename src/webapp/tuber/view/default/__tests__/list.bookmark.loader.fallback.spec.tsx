import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { APP_IS_FETCHING_BOOKMARKS } from '../../../tuber.config'

const mockDispatch = vi.fn()

const mockState = {
  app: {
    status: 'APP_REQUEST_SUCCESS',
  },
  dataPagesRange: {},
  topLevelLinks: {
    bookmarks: {},
  },
}

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: typeof mockState) => unknown) => selector(mockState),
}))

vi.mock('src/controllers', () => ({
  StateDataPagesRange: class MockStateDataPagesRange {
    firstPage = 1
    lastPage = 1

    configure() {
      return this
    }
  },
}))

vi.mock('src/business.logic/JsonapiPaginationLinks', () => ({
  default: class MockJsonapiPaginationLinks {
    lastPageNumber = 3

    constructor(_links: unknown) {}

    getLinkUrl({ pageNumber }: { pageNumber: number }) {
      return `/bookmarks?page[number]=${String(pageNumber)}`
    }
  },
}))

describe('InfiniteScrollTrigger fallback timer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockState.app.status = 'APP_REQUEST_SUCCESS'
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders Load More only after the fallback timeout elapses', async () => {
    const { InfiniteScrollTrigger } = await import('../list.bookmark.loader')

    render(
      <InfiniteScrollTrigger
        scrollContainerRef={{ current: null }}
      />
    )

    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1499)
    })

    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    act(() => {
      vi.runOnlyPendingTimers()
    })

    expect(screen.getByRole('button', { name: 'Load More' })).toBeInTheDocument()
  })

  it('does not render fallback while bookmarks are already fetching', async () => {
    const { InfiniteScrollTrigger } = await import('../list.bookmark.loader')
    mockState.app.status = APP_IS_FETCHING_BOOKMARKS

    render(
      <InfiniteScrollTrigger
        scrollContainerRef={{ current: null }}
      />
    )

    act(() => {
      vi.advanceTimersByTime(2000)
      vi.runOnlyPendingTimers()
    })

    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument()
  })
})
