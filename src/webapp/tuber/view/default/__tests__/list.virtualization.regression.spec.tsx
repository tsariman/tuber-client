import React from 'react'
import { beforeEach, vi } from 'vitest'
import { runListVirtualizationRegressionSuite, type TestBookmark, type VirtualItem } from './list.virtualization.regression.helper'

const mockUseSelector = vi.fn()
const mockUseVirtualizer = vi.fn()

type TestBookmark = {
  id?: number | string
  url?: string
  title?: string
}

type TestRootState = {
  data: {
    bookmarks: TestBookmark[]
  }
  dataPagesRange: Record<string, unknown>
}

let mockState: TestRootState = {
  data: { bookmarks: [] },
  dataPagesRange: {},
}

let virtualItems: VirtualItem[] = []

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: TestRootState) => unknown) => {
    mockUseSelector(selector)
    return selector(mockState)
  },
}))

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (options: {
    getItemKey?: (index: number) => string
  }) => {
    mockUseVirtualizer(options)
    return {
      getTotalSize: () => 800,
      getVirtualItems: () =>
        virtualItems.map((item) => ({
          ...item,
          key: item.key ?? options.getItemKey?.(item.index) ?? `index-${item.index}`,
          end: item.start + 80,
        })),
      measureElement: vi.fn(),
      scrollToIndex: vi.fn(),
    }
  },
}))

vi.mock('../list.bookmark.loader', () => ({
  LoadEarlierBookmarksFromServer: () => <div data-testid="load-earlier" />,
  InfiniteScrollTrigger: () => <div data-testid="infinite-trigger" />,
}))

vi.mock('../bookmark', () => ({
  default: ({ children }: { children?: TestBookmark }) => (
    <div data-testid="bookmark-row">{children?.id ?? 'ghost'}</div>
  ),
}))

vi.mock('src/controllers/StateData', () => ({
  default: class MockStateData {
    private state: TestRootState['data']

    constructor(state: TestRootState['data']) {
      this.state = state
    }

    configure() {
      return this
    }

    include() {
      return this
    }

    flatten() {
      return this
    }

    get<T>() {
      return this.state.bookmarks as T
    }
  },
}))

vi.mock('src/controllers', () => ({
  StateDataPagesRange: class MockStateDataPagesRange {
    firstPage = 1
    lastPage = 1

    configure() {
      return this
    }

    getLoadedPageTotal() {
      return 1
    }
  },
}))

vi.mock('../list.scroll.restore', () => ({
  useBookmarkListScrollRestore: vi.fn(),
}))

import BookmarkList from '../list'

beforeEach(() => {
  vi.clearAllMocks()
  mockState = {
    data: {
      bookmarks: [],
    },
    dataPagesRange: {},
  }
  virtualItems = []
})

runListVirtualizationRegressionSuite({
  suiteName: 'BookmarkList virtualization regression',
  renderComponent: () => <BookmarkList />,
  setBookmarks: (bookmarks: TestBookmark[]) => {
    mockState = {
      ...mockState,
      data: { bookmarks },
    }
  },
  setVirtualItems: (items: VirtualItem[]) => {
    virtualItems = items
  },
  getVirtualizerOptions: () => mockUseVirtualizer.mock.calls[0]?.[0],
})
