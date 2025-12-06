import AbstractState from './AbstractState'
import type { ILoadedPagesRange, IStateDataPagesRange } from '@tuber/shared'
import type { IStateDataPagesRangConfig } from '../interfaces/IControllerConfiguration'
import State from './State'
import { get_state } from '../state'

const EMPTY_PAGES_RANGE: ILoadedPagesRange = {
  first: '1',
  last: '1',
}

/** Wrapper class for `initialState.dataPagesRange` */
export default class StateDataPagesRange extends AbstractState {
  private _pagesRangeState: IStateDataPagesRange
  private _parent?: State
  private _maxLoadedPages?: number
  private _endpoint?: string
  private _pageSize?: number
  private _pageToBeDropped?: string
  private _newPageRange?: ILoadedPagesRange

  constructor(pagesRangeState: IStateDataPagesRange, parent?: State) {
    super()
    this._pagesRangeState = pagesRangeState
    this._parent = parent
  }

  get state(): unknown { return this._pagesRangeState }
  get parent(): State { return this._parent ?? (this._parent = new State(get_state())) }
  get props(): unknown { return this.die('Method not implemented.', {}) }

  /** Instance needs to be given specific information to function properly. */
  configure(opts: IStateDataPagesRangConfig): this {
    const { maxLoadedPages, endpoint, pageSize } = opts
    this._maxLoadedPages = maxLoadedPages
    this._endpoint = endpoint
    this._pageSize = pageSize
    return this
  }

  private _getPageSize(): number {
    if (!this._pageSize) {
      return this.die('StateDataPagesRange: pageSize not set.', 0)
    }
    return this._pageSize
  }

  getPageSize(): number {
    return this._getPageSize()
  }

  getMaxLoadedPages(): number {
    if (!this._maxLoadedPages) {
      return this.die('StateDataPagesRange: maxLoadedPages not set.', 0)
    }
    return this._maxLoadedPages
  }

  /** Get the page to be dropped as a number */
  getPageToBeDropped(): number | false {
    if (this._pageToBeDropped) {
      return parseInt(this._pageToBeDropped) - 1
    }
    return false
  }

  private _getPageRange(): ILoadedPagesRange {
    if (!this._endpoint) {
      return this.die(
        'StateDataPagesRange: endpoint not set.',
        EMPTY_PAGES_RANGE
      )
    }
    if (!this._pagesRangeState[this._endpoint]) {
      return this.notice(
        'StateDataPagesRange: endpoint not found.',
        EMPTY_PAGES_RANGE
      )
    }
    return this._pagesRangeState[this._endpoint] || EMPTY_PAGES_RANGE
  }

  private _getLoadedPageTotal(): number | false {
    const { first, last } = this._getPageRange()
    return parseInt(last) - parseInt(first) + 1
  }

  getLoadedPageTotal(): number | false {
    return this._getLoadedPageTotal()
  }

  get firstPage(): number {
    return parseInt(this._getPageRange().first)
  }

  get lastPage(): number {
    return parseInt(this._getPageRange().last)
  }

  /**
   * Enforce the "max loaded pages" limit by dropping a newer page or older page
   * if that limit is reached, based on the page number.
   * If the page number is not sequential, then set that page as both the first
   * and last page.
   */
  pageToBeLoaded(page: number): this {
    const { first, last } = this._getPageRange()
    const firstPage = parseInt(first)
    const lastPage = parseInt(last)

    // If no page range was found
    if (lastPage + firstPage === 0) {
      this._newPageRange = {
        first: '1',
        last: page.toString(),
      }
      return this
    }

    // If the page is within the pages range, then return false.
    // This means that the page is already loaded.
    if (page >= firstPage && page <= lastPage) {
      return this
    }

    // If the page number is not sequential, then set that page as both the
    // first and last page.
    if (page > (lastPage + 1) || page < (firstPage - 1)) {
      this._newPageRange = {
        first: page.toString(),
        last: page.toString(),
      }
      this._pageToBeDropped = 'all'
      return this
    }

    // If the page number is sequential, then check if the limit is reached.
    // If the limit is reached, then drop the earliest or latest page.
    const maxLoadedPages = this.getMaxLoadedPages()
    if (lastPage - firstPage >= maxLoadedPages) {
      if (page === lastPage + 1) {
        this._newPageRange = {
          first: (firstPage + 1).toString(),
          last: page.toString(),
        }
        this._pageToBeDropped = firstPage.toString()
      } else if (page === firstPage - 1) {
        this._newPageRange = {
          first: page.toString(),
          last: (lastPage - 1).toString(),
        }
        this._pageToBeDropped = lastPage.toString()
      }
      return this
    }

    // If the limit is not reached, then add the page to the pages range.
    if (page === lastPage + 1) {
      this._newPageRange = {
        first: firstPage.toString(),
        last: page.toString(),
      }
    } else if (page === firstPage - 1) {
      this._newPageRange = {
        first: page.toString(),
        last: lastPage.toString(),
      }
    }
    return this
  }

  /** Returns the new page range. */
  getNewPageRange(): ILoadedPagesRange | false {
    if (this._newPageRange) {
      return this._newPageRange
    }
    return this.notice(
      `StateDataPagesRange: 'newPageRange' is undefined.
       Run 'pageToBeLoaded()' first.
      `,
      false
    )
  }

  /** Check if page is within range */
  isPageInRange(page: number): boolean {
    const { first, last } = this._getPageRange()
    const firstPage = parseInt(first)
    const lastPage = parseInt(last)
    return firstPage !== lastPage && page >= firstPage && page <= lastPage
  }
}
