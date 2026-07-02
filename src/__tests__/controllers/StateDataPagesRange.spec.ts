import { describe, it, expect } from 'vitest'
import StateDataPagesRange from '../../controllers/StateDataPagesRange'

describe('StateDataPagesRange', () => {
  describe('constructor', () => {
    it('should create a state data pages range object', () => {
      expect((new StateDataPagesRange({}) as any)._pagesRangeState).toEqual({})
    })
  })

  describe('pageToBeLoaded', () => {
    it('should create a new range from an empty state', () => {
      const state = new StateDataPagesRange({})
        .configure({ endpoint: 'bookmarks', maxLoadedPages: 3 })

      state.pageToBeLoaded(2)

      expect(state.getNewPageRange()).toEqual({ first: '2', last: '2' })
      expect(state.getPageToBeDropped()).toBe(false)
    })

    it('should clear transient results between evaluations', () => {
      const state = new StateDataPagesRange({
        bookmarks: { first: '2', last: '4' },
      }).configure({ endpoint: 'bookmarks', maxLoadedPages: 3 })

      state.pageToBeLoaded(5)
      expect(state.getNewPageRange()).toEqual({ first: '3', last: '5' })
      expect(state.getPageToBeDropped()).toBe(2)

      state.pageToBeLoaded(4)
      expect(state.getNewPageRange()).toBe(false)
      expect(state.getPageToBeDropped()).toBe(false)
    })

    it('should ignore invalid page arguments', () => {
      const state = new StateDataPagesRange({
        bookmarks: { first: '2', last: '4' },
      }).configure({ endpoint: 'bookmarks', maxLoadedPages: 3 })

      state.pageToBeLoaded(0)

      expect(state.getNewPageRange()).toBe(false)
      expect(state.getPageToBeDropped()).toBe(false)
    })
  })

  describe('range normalization', () => {
    it('should treat malformed persisted values as an empty range', () => {
      const state = new StateDataPagesRange({
        bookmarks: { first: 'x', last: '4' },
      }).configure({ endpoint: 'bookmarks', maxLoadedPages: 3 })

      expect(state.firstPage).toBe(0)
      expect(state.lastPage).toBe(0)
      expect(state.getLoadedPageTotal()).toBe(false)
      expect(state.isPageInRange(1)).toBe(false)

      state.pageToBeLoaded(3)
      expect(state.getNewPageRange()).toEqual({ first: '3', last: '3' })
    })
  })
})