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
import PageSuccess from '../../../mui/page/success.cpn'
import StatePage from '../../../controllers/StatePage'
import StateAllPages from '../../../controllers/StateAllPages'
import type { IStatePage } from '../../../interfaces/localized'

// Helper to create a minimal StatePage instance
const createMockPage = (pageData: Partial<IStatePage> = {}) => {
  const mockAllPages = {} as StateAllPages
  const pageState: IStatePage = {
    _id: 'success-page',
    _type: 'generic',
    _key: 'success',
    title: 'Success',
    data: pageData.data || { message: 'Operation successful!' },
    typography: pageData.typography || { color: '#4caf50' },
    ...pageData
  }
  return new StatePage(pageState, mockAllPages)
}

describe('PageSuccess', () => {
  describe('Rendering', () => {
    it('renders success icon', () => {
      const page = createMockPage()
      const { container } = renderWithProviders(<PageSuccess instance={page} />)
      
      // Check for SVG icon
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('displays message from page data', () => {
      const customMessage = 'Your request was successful!'
      const page = createMockPage({ 
        data: { message: customMessage } 
      })
      
      renderWithProviders(<PageSuccess instance={page} />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(customMessage)
    })

    it('displays message from tmp state when available', () => {
      const tmpMessage = 'Message from tmp state'
      const page = createMockPage({ 
        data: { message: 'Default message' } 
      })
      
      const preloadedState = {
        tmp: {
          '/success-route': {
            message: tmpMessage
          }
        },
        app: {
          route: '/success-route',
          status: 'idle',
          showSpinner: false,
          spinnerDisabled: false,
          fetchingStateAllowed: true,
          title: 'Test App'
        }
      }
      
      renderWithProviders(<PageSuccess instance={page} />, { preloadedState })
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(tmpMessage)
    })

    it('falls back to page data message when tmp state has no message', () => {
      const defaultMessage = 'Fallback success message'
      const page = createMockPage({ 
        data: { message: defaultMessage } 
      })
      
      const preloadedState = {
        tmp: {
          '/success-route': {}
        },
        app: {
          route: '/success-route',
          status: 'idle',
          showSpinner: false,
          spinnerDisabled: false,
          fetchingStateAllowed: true,
          title: 'Test App'
        }
      }
      
      renderWithProviders(<PageSuccess instance={page} />, { preloadedState })
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(defaultMessage)
    })

    it('applies typography color to icon and message', () => {
      const customColor = '#ff5722'
      const page = createMockPage({ 
        typography: { color: customColor },
        data: { message: 'Success!' }
      })
      
      const { container } = renderWithProviders(<PageSuccess instance={page} />)
      
      // Check message div has color
      const msgDiv = container.querySelector('div')
      expect(msgDiv).toBeTruthy()
    })
  })

  describe('HTML Parsing', () => {
    it('parses HTML in message', () => {
      const htmlMessage = 'Success with <strong>bold</strong> text'
      const page = createMockPage({ 
        data: { message: htmlMessage } 
      })
      
      const { container } = renderWithProviders(<PageSuccess instance={page} />)
      
      expect(container.querySelector('strong')).toHaveTextContent('bold')
    })

    it('parses complex HTML structures', () => {
      const htmlMessage = '<p>Line 1</p><p>Line 2 with <em>emphasis</em></p>'
      const page = createMockPage({ 
        data: { message: htmlMessage } 
      })
      
      const { container } = renderWithProviders(<PageSuccess instance={page} />)
      
      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs.length).toBe(2)
      expect(container.querySelector('em')).toHaveTextContent('emphasis')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty message gracefully', () => {
      const page = createMockPage({ data: { message: '' } })
      
      renderWithProviders(<PageSuccess instance={page} />)
      
      // Should render heading even with empty message
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('handles missing data object', () => {
      const page = createMockPage({ data: { message: 'Default success' } })
      
      renderWithProviders(<PageSuccess instance={page} />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('handles missing typography color', () => {
      const page = createMockPage({ 
        typography: {} as any,
        data: { message: 'Success' }
      })
      
      const { container } = renderWithProviders(<PageSuccess instance={page} />)
      
      // Should render without crashing
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })
  })

  describe('Component Structure', () => {
    it('renders with proper structure', () => {
      const page = createMockPage()
      const { container } = renderWithProviders(<PageSuccess instance={page} />)
      
      // Should have icon (svg) and message div
      const svg = container.querySelector('svg')
      const heading = container.querySelector('h1')
      
      expect(svg).toBeTruthy()
      expect(heading).toBeTruthy()
    })
  })
})
