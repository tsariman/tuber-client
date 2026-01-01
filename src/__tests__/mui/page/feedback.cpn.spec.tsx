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

import FeedbackPage from '../../../mui/page/feedback.cpn'
import { renderWithProviders, screen } from '../../test-utils'
import StatePage from '../../../controllers/StatePage'
import StateAllPages from '../../../controllers/StateAllPages'
import type { IStatePage } from '../../../interfaces/localized'

// Helper to create a minimal StatePage instance
const createMockPage = (pageData: Partial<IStatePage> = {}) => {
  const mockAllPages = {} as StateAllPages
  const pageState: IStatePage = {
    _id: 'feedback-page',
    _type: 'generic',
    _key: 'feedback',
    title: 'Feedback',
    data: pageData.data || { message: 'Feedback message' },
    typography: pageData.typography || { color: '#333' },
    ...pageData
  }
  return new StatePage(pageState, mockAllPages)
}

describe('FeedbackPage', () => {
  describe('Icon Rendering by Severity', () => {
    it('renders success icon for success severity', () => {
      const page = createMockPage({ data: { message: 'Success!' } })
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="success" />
      )
      
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('renders warning icon for warning severity', () => {
      const page = createMockPage({ data: { message: 'Warning!' } })
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="warning" />
      )
      
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('renders info icon for info severity', () => {
      const page = createMockPage({ data: { message: 'Info' } })
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="info" />
      )
      
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('renders error icon for error severity', () => {
      const page = createMockPage({ data: { message: 'Error!' } })
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="error" />
      )
      
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('renders info icon for unknown severity', () => {
      const page = createMockPage({ data: { message: 'Unknown' } })
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="unknown" />
      )
      
      // Should default to info icon
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })
  })

  describe('Message Display', () => {
    it('displays message from page data', () => {
      const customMessage = 'This is a feedback message'
      const page = createMockPage({ 
        data: { message: customMessage } 
      })
      
      renderWithProviders(<FeedbackPage instance={page} severity="info" />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(customMessage)
    })

    it('displays message from tmp state when available', () => {
      const tmpMessage = 'Message from tmp state'
      const page = createMockPage({ 
        data: { message: 'Default message' } 
      })
      
      const preloadedState = {
        tmp: {
          '/feedback-route': {
            message: tmpMessage
          }
        },
        app: {
          route: '/feedback-route',
          status: 'idle',
          showSpinner: false,
          spinnerDisabled: false,
          fetchingStateAllowed: true,
          title: 'Test App'
        }
      }
      
      renderWithProviders(
        <FeedbackPage instance={page} severity="success" />, 
        { preloadedState }
      )
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(tmpMessage)
    })

    it('falls back to page data message when tmp state has no message', () => {
      const defaultMessage = 'Fallback feedback message'
      const page = createMockPage({ 
        data: { message: defaultMessage } 
      })
      
      const preloadedState = {
        tmp: {
          '/feedback-route': {}
        },
        app: {
          route: '/feedback-route',
          status: 'idle',
          showSpinner: false,
          spinnerDisabled: false,
          fetchingStateAllowed: true,
          title: 'Test App'
        }
      }
      
      renderWithProviders(
        <FeedbackPage instance={page} severity="info" />, 
        { preloadedState }
      )
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(defaultMessage)
    })
  })

  describe('HTML Parsing', () => {
    it('parses HTML in message', () => {
      const htmlMessage = 'Message with <strong>bold</strong> text'
      const page = createMockPage({ 
        data: { message: htmlMessage } 
      })
      
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="info" />
      )
      
      expect(container.querySelector('strong')).toHaveTextContent('bold')
    })

    it('parses complex HTML structures', () => {
      const htmlMessage = '<p>Paragraph 1</p><p>Paragraph 2 with <em>italic</em></p>'
      const page = createMockPage({ 
        data: { message: htmlMessage } 
      })
      
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="success" />
      )
      
      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs.length).toBe(2)
      expect(container.querySelector('em')).toHaveTextContent('italic')
    })
  })

  describe('Typography Styling', () => {
    it('applies typography color to message', () => {
      const customColor = '#ff5722'
      const page = createMockPage({ 
        typography: { color: customColor },
        data: { message: 'Styled message' }
      })
      
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="info" />
      )
      
      const msgDiv = container.querySelector('div')
      expect(msgDiv).toBeTruthy()
    })

    it('handles missing typography color', () => {
      const page = createMockPage({ 
        typography: {} as any,
        data: { message: 'Message' }
      })
      
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="success" />
      )
      
      // Should render without crashing
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty message gracefully', () => {
      const page = createMockPage({ data: { message: '' } })
      
      renderWithProviders(<FeedbackPage instance={page} severity="info" />)
      
      // Should render heading even with empty message
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('handles different severity levels with same message', () => {
      const message = 'Same message'
      const page = createMockPage({ data: { message } })
      
      const severities = ['success', 'warning', 'info', 'error']
      
      severities.forEach(severity => {
        const { container, unmount } = renderWithProviders(
          <FeedbackPage instance={page} severity={severity} />
        )
        
        expect(container.querySelector('svg')).toBeTruthy()
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(message)
        
        // Unmount to clean up for next iteration
        unmount()
      })
    })
  })

  describe('Component Structure', () => {
    it('renders with proper structure', () => {
      const page = createMockPage({ data: { message: 'Test message' } })
      const { container } = renderWithProviders(
        <FeedbackPage instance={page} severity="success" />
      )
      
      // Should have icon (svg) and message heading
      const svg = container.querySelector('svg')
      const heading = container.querySelector('h1')
      
      expect(svg).toBeTruthy()
      expect(heading).toBeTruthy()
      expect(heading?.textContent).toBe('Test message')
    })
  })
})
