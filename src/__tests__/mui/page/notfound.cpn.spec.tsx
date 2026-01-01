import { describe, it, expect, vi } from 'vitest'

// Mock problematic classes before importing anything
vi.mock('../../../controllers/StateAppbar', () => ({
  default: class MockStateAppbar {
    constructor() {
      return {}
    }
  }
}))

vi.mock('../../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    constructor() {
      return {}
    }
  }
}))

vi.mock('../../../controllers/State', () => ({
  default: class MockState {
    _rootState: unknown
    constructor(rootState: unknown) {
      this._rootState = rootState
    }
  }
}))

import { renderWithProviders, screen } from '../../test-utils'
import PageNotFound from '../../../mui/page/notfound.cpn'
import StatePage from '../../../controllers/StatePage'
import StateAllPages from '../../../controllers/StateAllPages'
import type { IStatePage } from '../../../interfaces/localized'

// Helper to create a minimal StatePage instance
const createMockPage = (pageData: Partial<IStatePage> = {}) => {
  const mockAllPages = {} as StateAllPages
  const pageState: IStatePage = {
    _id: 'not-found-page',
    _type: 'generic',
    _key: 'not-found',
    title: '404 Not Found',
    data: pageData.data || { message: 'Page not found' },
    ...pageData
  }
  return new StatePage(pageState, mockAllPages)
}

describe('PageNotFound', () => {
  describe('Rendering', () => {
    it('renders 404 heading', () => {
      const page = createMockPage()
      renderWithProviders(<PageNotFound instance={page} />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
    })

    it('displays message from page data', () => {
      const customMessage = 'Custom error message'
      const page = createMockPage({ 
        data: { message: customMessage } 
      })
      
      renderWithProviders(<PageNotFound instance={page} />)
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(customMessage)
    })

    it('displays message from tmp state when available', () => {
      const tmpMessage = 'Message from tmp state'
      const page = createMockPage({ 
        data: { message: 'Default message' } 
      })
      
      const preloadedState = {
        tmp: {
          '/current-route': {
            message: tmpMessage
          }
        },
        app: {
          route: '/current-route',
          status: 'idle',
          showSpinner: false,
          spinnerDisabled: false,
          fetchingStateAllowed: true,
          title: 'Test App'
        }
      }
      
      renderWithProviders(<PageNotFound instance={page} />, { preloadedState })
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(tmpMessage)
    })

    it('falls back to page data message when tmp state has no message', () => {
      const defaultMessage = 'Fallback message'
      const page = createMockPage({ 
        data: { message: defaultMessage } 
      })
      
      const preloadedState = {
        tmp: {
          '/current-route': {}
        },
        app: {
          route: '/current-route',
          status: 'idle',
          showSpinner: false,
          spinnerDisabled: false,
          fetchingStateAllowed: true,
          title: 'Test App'
        }
      }
      
      renderWithProviders(<PageNotFound instance={page} />, { preloadedState })
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(defaultMessage)
    })
  })

  describe('Styling', () => {
    it('renders with proper structure', () => {
      const page = createMockPage()
      const { container } = renderWithProviders(<PageNotFound instance={page} />)
      
      const h1 = container.querySelector('h1')
      const h2 = container.querySelector('h2')
      
      expect(h1).toBeTruthy()
      expect(h2).toBeTruthy()
      expect(h1?.textContent).toBe('404')
    })
  })

  describe('Edge Cases', () => {
    it('handles missing message gracefully', () => {
      const page = createMockPage({ data: {} })
      
      renderWithProviders(<PageNotFound instance={page} />)
      
      // Should render headings even without message
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('handles non-string message data', () => {
      const page = createMockPage({ 
        data: { message: null as any } 
      })
      
      renderWithProviders(<PageNotFound instance={page} />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
    })
  })
})
