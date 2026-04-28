import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

type TestBookmark = {
  id?: number | string
  url?: string
  title?: string
}

type VirtualItem = {
  index: number
  start: number
  key?: string
}

type VirtualizerOptions = {
  getItemKey?: (index: number) => string
}

type RunListVirtualizationRegressionSuiteArgs = {
  suiteName: string
  renderComponent: () => React.ReactElement
  setBookmarks: (bookmarks: TestBookmark[]) => void
  setVirtualItems: (items: VirtualItem[]) => void
  getVirtualizerOptions: () => VirtualizerOptions
}

export function runListVirtualizationRegressionSuite({
  suiteName,
  renderComponent,
  setBookmarks,
  setVirtualItems,
  getVirtualizerOptions,
}: RunListVirtualizationRegressionSuiteArgs) {
  describe(suiteName, () => {
    it('passes stable item keys to virtualizer', () => {
      setBookmarks([
        { id: 101, url: 'https://example.test/101', title: 'A' },
        { id: 202, url: 'https://example.test/202', title: 'B' },
      ])
      setVirtualItems([
        { index: 0, start: 0 },
        { index: 1, start: 80 },
        { index: 2, start: 160 },
      ])

      render(renderComponent())

      const virtualizerOptions = getVirtualizerOptions()
      expect(virtualizerOptions).toBeDefined()
      expect(typeof virtualizerOptions.getItemKey).toBe('function')
      expect(virtualizerOptions.getItemKey?.(0)).toBe('bookmark-101')
      expect(virtualizerOptions.getItemKey?.(1)).toBe('bookmark-202')
      expect(virtualizerOptions.getItemKey?.(2)).toBe('infinite-scroll-trigger')
    })

    it('does not render ghost rows after bookmarks are cleared while virtualizer still reports stale indexes', () => {
      setBookmarks([
        { id: 1, url: 'https://example.test/1', title: 'One' },
        { id: 2, url: 'https://example.test/2', title: 'Two' },
      ])
      setVirtualItems([
        { index: 0, start: 0 },
        { index: 1, start: 80 },
        { index: 2, start: 160 },
      ])

      const { rerender } = render(renderComponent())
      expect(screen.getAllByTestId('bookmark-row')).toHaveLength(2)

      setBookmarks([])
      setVirtualItems([{ index: 1, start: 0 }])

      rerender(renderComponent())

      expect(screen.queryAllByTestId('bookmark-row')).toHaveLength(0)
      expect(screen.queryByText('ghost')).not.toBeInTheDocument()
    })
  })
}

export type { TestBookmark, VirtualItem }
